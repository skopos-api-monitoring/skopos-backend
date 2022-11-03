import { MiddlewareFn, UseMiddleware } from "type-graphql";
import { ResolversEnhanceMap } from "@generated/type-graphql";
import { addOrUpdateRule } from '../utils/eventBridgeRules'

const AddSchedule: MiddlewareFn = async ({ args }, next) => {
  const data = await next()
  const collectionIds = args.data.collections
  addOrUpdateRule(data, collectionIds)
  return data
}

export const resolversEnhanceMap: ResolversEnhanceMap = {
  Monitor: {
    createOneMonitor: [UseMiddleware(AddSchedule)]
  },
}