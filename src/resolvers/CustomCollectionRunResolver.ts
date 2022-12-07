import { CollectionRunWhereInput } from '@generated/type-graphql/resolvers/inputs'
import { Arg, Ctx, Field, InputType, Int, Query, Resolver } from 'type-graphql'
import { fromCursorHash, toCursorHash } from '../helpers/cursorHelpers'
import { Context } from '../index'
import PaginatedCollectionRunResponse from '../objectTypes/PaginatedCollectionRunResponse'
import { Prisma } from '@prisma/client'

@InputType()
class PaginateCollectionRunInput {
  @Field(() => Int, { nullable: false })
  collectionId: number

  @Field(() => Int, { defaultValue: 4 })
  take: number

  @Field(() => String, { defaultValue: '' })
  cursor: string
}

@Resolver()
class CustomCollectionRunResolver {
  @Query(() => PaginatedCollectionRunResponse, {
    nullable: true,
  })
  async paginateCollectionRuns(
    @Arg('data') { collectionId, take, cursor }: PaginateCollectionRunInput,
    @Ctx() { prisma }: Context
  ): Promise<PaginatedCollectionRunResponse> {
    const id = cursor === '' ? 1 : fromCursorHash(cursor)
    const where: CollectionRunWhereInput = {
      collectionId: {
        equals: collectionId,
      },
    }
    const query = {
      where,
      include: {
        responses: {
          include: {
            assertionResults: {
              orderBy: {
                pass: Prisma.SortOrder.desc,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
      take,
      skip: id === 1 ? 0 : 1,
    }

    const [items, first] = await prisma.$transaction([
      prisma.collectionRun.findMany({
        ...query,
        cursor: cursor === '' ? undefined : { id },
      }),
      prisma.collectionRun.findFirst({ where }),
    ])

    const encodedCursor =
      items.length === 0 ? '' : toCursorHash(items.at(-1).id)
    const hasMore = !items.length ? false : items.at(-1).id !== first.id

    return {
      items,
      cursor: encodedCursor,
      hasMore,
    }
  }
}

export default CustomCollectionRunResolver
