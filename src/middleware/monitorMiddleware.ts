import { MiddlewareFn, UseMiddleware } from "type-graphql";
import { ResolversEnhanceMap } from "@generated/type-graphql";
import { mutateRule } from '../utils/eventBridgeRules'

const AddSchedule: MiddlewareFn = async (_, next) => {
  const data = await next()
  console.log(data)
  return data
}

export const resolversEnhanceMap: ResolversEnhanceMap = {
  Monitor: {
    createOneMonitor: [UseMiddleware(AddSchedule)],
  },
}