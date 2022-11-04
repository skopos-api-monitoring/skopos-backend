import { MiddlewareFn, UseMiddleware } from 'type-graphql'
import { ResolversEnhanceMap } from '@generated/type-graphql'
import { addOrUpdateRule } from '../utils/eventBridgeRules'

const AddSchedule: MiddlewareFn = async ({ args }, next) => {
  addOrUpdateRule(args.data)
  return next()
}

export const resolversEnhanceMap: ResolversEnhanceMap = {
  Monitor: {
    createOneMonitor: [UseMiddleware(AddSchedule)],
  },
}
