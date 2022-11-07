import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import {
  addRules,
  deleteRules,
  updateRules,
} from '../sdkModules/eventBridge/eventBridgeRules'
import { MiddlewareFn, UseMiddleware } from 'type-graphql'
import { ResolversEnhanceMap } from '@generated/type-graphql'

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
  const schedule = args.data.schedule.set
  if (await updateRules({ schedule, collectionIds })) {
    return next()
  }
  throw new GraphQLError('failed to rule for collection run')
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

export const resolversEnhanceMap: ResolversEnhanceMap = {
  Monitor: {
    createOneMonitor: [UseMiddleware(AddSchedule)],
    updateOneMonitor: [UseMiddleware(UpdateSchedule)],
    deleteOneMonitor: [UseMiddleware(DeleteSchedule)],
  },
}
