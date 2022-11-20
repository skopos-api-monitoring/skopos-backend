import { Request } from '@generated/type-graphql/models/Request'
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql'
import { Context } from '../index'
import swapSteps from '../resolvers/swapSteps'

@InputType()
class ReorderRequestInput {
  @Field()
  collectionId: number

  @Field()
  fromStep: number

  @Field()
  toStep: number
}

@InputType()
class DeleteRequestInput {
  @Field()
  collectionId: number

  @Field()
  requestId: number
}

@Resolver()
class CustomCollectionResolver {
  @Mutation(() => [Request], { nullable: true })
  async reorderRequests(
    @Arg('data') { collectionId, toStep, fromStep }: ReorderRequestInput,
    @Ctx() { prisma }: Context
  ): Promise<Request[] | null> {
    const requests: Request[] = await prisma.request.findMany({
      where: {
        collectionId,
        stepNumber: {
          in: [toStep, fromStep],
        },
      },
    })
    const movedRequests = swapSteps(requests, fromStep, toStep).map(
      ({ id, stepNumber }) => {
        return prisma.request.update({
          where: { id },
          data: {
            stepNumber,
          },
        })
      }
    )
    await prisma.$transaction(movedRequests)
    const collection = await prisma.collection.findFirst({
      where: { id: collectionId },
      include: {
        requests: {
          orderBy: {
            stepNumber: 'asc',
          },
        },
      },
    })
    return collection.requests
  }

  @Mutation(() => [Request], { nullable: true })
  async deleteRequest(
    @Arg('data') { collectionId, requestId }: DeleteRequestInput,
    @Ctx() { prisma }: Context
  ): Promise<Request[] | null> {
    // disconnect request from collection
    const request = await prisma.request.update({
      where: { id: requestId },
      data: { collection: { disconnect: true } },
    })
    const { stepNumber } = request
    // get rest of requests
    const requests = await prisma.request.findMany({
      orderBy: {
        stepNumber: 'asc',
      },
      where: { collectionId },
    })
    const requestsToUpdate = requests.slice(stepNumber - 1)
    // don't need to update requests if last one was updated
    if (requestsToUpdate.length > 0) {
      await prisma.request.updateMany({
        data: {
          stepNumber: {
            decrement: 1,
          },
        },
        where: {
          collectionId: {
            equals: collectionId,
          },
          stepNumber: {
            gt: stepNumber,
          },
        },
      })
      return await prisma.collection
        .findUnique({ where: { id: collectionId } })
        .requests()
    } else {
      return requests
    }
  }
}

export default CustomCollectionResolver
