import { MiddlewareFn, UseMiddleware } from 'type-graphql'
import { ResolversEnhanceMap } from '@generated/type-graphql'
// import { addOrUpdateRule } from '../sdkModules/eventBridge/eventBridgeRules'
import { createTopic } from '../sdkModules/sns/createTopic'
import { createSubscription } from '../sdkModules/sns/createSubscription'

const AddSchedule: MiddlewareFn = async ({ args }, next) => {
  const topicARN = await createTopic(args.data)
  await createSubscription(topicARN, args.data)
  args.data.snsTopicArn = topicARN
  // addOrUpdateRule(args.data)
  return next()
}

export const resolversEnhanceMap: ResolversEnhanceMap = {
  Monitor: {
    createOneMonitor: [UseMiddleware(AddSchedule)],
  },
}
