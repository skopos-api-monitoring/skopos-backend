import { Arg, Ctx, Field, InputType, Int, Query, Resolver } from 'type-graphql'
import { fromCursorHash, toCursorHash } from '../helpers/cursorHelpers'
import { Context } from '../index'
import PaginatedCollectionRunResponse from '../objectTypes/PaginatedCollectionRunResponse'

@InputType()
class PaginateCollectionRunInput {
  @Field(() => [Int], { nullable: false })
  collectionIds: number[]

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
    @Arg('data') { collectionIds, take, cursor }: PaginateCollectionRunInput,
    @Ctx() { prisma }: Context
  ): Promise<PaginatedCollectionRunResponse> {
    const id = cursor === '' ? 1 : fromCursorHash(cursor)
    const where: any = {
      collectionId: {
        in: collectionIds,
      },
    }
    const query: any = {
      where,
      include: {
        responses: {
          include: {
            assertionResults: {
              orderBy: [
                {
                  pass: 'desc',
                },
              ],
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip: id === 1 ? 0 : 1,
    }
    if (cursor !== '') {
      query.cursor = {
        id,
      }
    }

    // const items = await prisma.collectionRun.findMany(query)
    const [items, first] = await prisma.$transaction([
      prisma.collectionRun.findMany(query),
      prisma.collectionRun.findFirst({ where }),
    ])

    const encodedCursor =
      items.length === 0 ? '' : toCursorHash(items.at(-1).id)
    const hasMore = items.at(-1).id !== first.id

    return {
      items,
      cursor: encodedCursor,
      hasMore,
    }
  }
}

export default CustomCollectionRunResolver
