import { ClassType, Field, Int, ObjectType } from 'type-graphql'

export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [TItemClass])
    items: TItem[]

    @Field(() => String)
    cursor: string

    @Field(() => Boolean)
    hasMore: boolean
  }
  return PaginatedResponseClass
}