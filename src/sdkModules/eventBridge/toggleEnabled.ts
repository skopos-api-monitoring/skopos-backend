import {
  DisableRuleCommand,
  DisableRuleCommandInput,
  EnableRuleCommandInput,
  EnableRuleCommand,
} from '@aws-sdk/client-eventbridge'
import { GraphQLError } from 'graphql'
import ebClient from '../eventBridge/ebClient'

const enableRules = async (collectionIds: number[]) => {
  const promises = collectionIds.map((id) => {
    const input: EnableRuleCommandInput = {
      Name: `run-collection-${id}`,
    }
    return ebClient.send(new EnableRuleCommand(input))
  })
  try {
    const results = await Promise.all(promises)
    console.log(results)
    return true
  } catch (e) {
    console.error(e)
    throw new GraphQLError(`Failed to enable rules: ${e.message}`)
  }
}

const disableRules = async (collectionIds: number[]) => {
  const promises = collectionIds.map((id) => {
    const input: DisableRuleCommandInput = {
      Name: `run-collection-${id}`,
    }
    return ebClient.send(new DisableRuleCommand(input))
  })
  try {
    const results = await Promise.all(promises)
    console.log(results)
    return true
  } catch (e) {
    console.error(e)
    throw new GraphQLError(`Failed to disable rules: ${e.message}`)
  }
}

export default async function toggleEnabled(
  collectionIds: number[],
  enabled: boolean
) {
  return enabled ? enableRules(collectionIds) : disableRules(collectionIds)
}
