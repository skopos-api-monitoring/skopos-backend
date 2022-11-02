import { buildSchema, MiddlewareFn, UseMiddleware } from "type-graphql";
import { resolvers, applyResolversEnhanceMap, ResolversEnhanceMap } from "@generated/type-graphql";
import { mutateRule } from '../utils/eventBridgeRules'
const AddSchedule: MiddlewareFn = async (_, next) => {
  const data = await next()
  mutateRule(data)
  return data
}

const resolversEnhanceMap: ResolversEnhanceMap = {
  Monitor: {
    createManyMonitor: [UseMiddleware(AddSchedule)],
  },
}

applyResolversEnhanceMap(resolversEnhanceMap)