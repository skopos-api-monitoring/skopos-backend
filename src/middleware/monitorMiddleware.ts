import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import toggleEnabled from "../sdkModules/eventBridge/toggleEnabled";
import {
  addRules,
  deleteRules,
  updateRules,
} from '../sdkModules/eventBridge/eventBridgeRules'
import { MiddlewareFn, UseMiddleware } from 'type-graphql'
import { ResolversEnhanceMap } from '@generated/type-graphql'
import { createTopic } from '../sdkModules/sns/createTopic'
import { deleteTopic } from '../sdkModules/sns/deleteTopic'
import { createSubscription } from '../sdkModules/sns/createSubscription'
import { updateSubscription } from '../sdkModules/sns/updateSubscription'

const monitorCollectionIds = async (
  id: number,
  prisma: PrismaClient
): Promise<number[]> => {
  try {
    const collections = await prisma.collection.findMany({
      where: {
        monitorId: id,
      },
    })
    return collections.map((c) => c.id)
  } catch (err) {
    return []
  }
}

const monitorSnsTopicArn = async (
  monitorId: number,
  prisma: PrismaClient
): Promise<any> => {
  try {
    const monitor = await prisma.monitor.findUnique({
      where: {
        id: monitorId,
      },
    })
    return monitor['snsTopicArn']
  } catch (err) {
    return ''
  }
}

const AddSchedule: MiddlewareFn = async ({ args }, next) => {
  if (await addRules(args.data)) {
    return next()
  }
  throw new Error('failed to add collection run rules')
}

const UpdateSchedule: MiddlewareFn<{ prisma: PrismaClient }> = async (
  { args, context },
  next
) => {
  const collectionIds = await monitorCollectionIds(
    args.where.id,
    context.prisma
  )

  if (args.data.enabled) {
    await toggleEnabled(collectionIds, args.data.enabled.set)
  }

  if (!args.data.schedule) {
    return next()
  }

  const schedule = args.data.schedule.set
  if (await updateRules({ schedule, collectionIds })) {
    return next()
  }
  throw new GraphQLError('failed to update collection run')
}

const DeleteSchedule: MiddlewareFn<{ prisma: PrismaClient }> = async (
  { args, context },
  next
) => {
  const collectionIds = await monitorCollectionIds(
    args.where.id,
    context.prisma
  )
  const { ok, count } = await deleteRules(collectionIds)
  if (ok) {
    console.log(`Deleted ${count} events`)
  } else {
    throw new Error('Failed to remove monitor')
  }
  return next()
}

const AddSNS: MiddlewareFn = async ({ args }, next) => {
  if (!args.data.contactInfo) {
    return next()
  }

  let snsTopicArn

  try {
    snsTopicArn = await createTopic()
    args.data.snsTopicArn = snsTopicArn
  } catch (err) {
    throw new Error(err.message)
  }
  try {
    console.log(snsTopicArn)
    await createSubscription(args.data.contactInfo, snsTopicArn)
  } catch (err) {
    throw new Error(err.message)
  }

  return next()
}

const DeleteTopic: MiddlewareFn<{ prisma: PrismaClient }> = async (
  { args, context },
  next
) => {
  console.log('Delete Topic')
  const topicArn = await monitorSnsTopicArn(args.where.id, context.prisma)

  if (!topicArn) {
    return next()
  }

  try {
    console.log(topicArn)
    const data = await deleteTopic(topicArn)
    console.log('topic delete success', data)
  } catch (err) {
    throw new Error('Failed to remove topic')
  }
  return next()
}

const UpdateSubscription: MiddlewareFn<{ prisma: PrismaClient }> = async (
  { args, context },
  next
) => {
  if (!args.data.contactInfo) {
    return next()
  }

  const topicArn = await monitorSnsTopicArn(args.where.id, context.prisma)

  if (!topicArn) {
    return next()
  }

  try {
    const data = await updateSubscription(topicArn, args.data.contactInfo)
    console.log('update subscription success', data)
    // set contact info undefined if one of them doesn't have value
    if (!Object.values(args.data.contactInfo).some(Boolean)) {
      args.data.contactInfo = {}
    }
  } catch (err) {
    throw new Error('Failed to remove topic')
  }
  return next()
}

const CheckNoMonitor: MiddlewareFn<{ prisma: PrismaClient }> = async (
  { args, context },
  next
) => {
  if (!args || !args.where) return next()
  const collection = await context.prisma.collection.findUnique({
    where: args.where,
  })
  if (collection && collection.monitorId) {
    throw new GraphQLError("can't delete collection with a monitor")
  }
  return next()
}

export const resolversEnhanceMap: ResolversEnhanceMap = {
  Collection: {
    deleteOneCollection: [UseMiddleware(CheckNoMonitor)],
  },
  Monitor: {
    createOneMonitor: [UseMiddleware(AddSchedule), UseMiddleware(AddSNS)],
    deleteOneMonitor: [
      UseMiddleware(DeleteSchedule),
      UseMiddleware(DeleteTopic),
    ],
    updateOneMonitor: [
      UseMiddleware(UpdateSchedule),
      UseMiddleware(UpdateSubscription),
    ],
  },
}
