import PaginatedResponse from './PaginatedResponse'
import { ObjectType } from 'type-graphql'
import { CollectionRun } from '@generated/type-graphql/models'

@ObjectType()
class PaginatedCollectionRunResponse extends PaginatedResponse(CollectionRun) {}

export default PaginatedCollectionRunResponse
