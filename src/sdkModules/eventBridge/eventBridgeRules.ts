import {
  DeleteRuleCommand,
  EventBridgeClient,
  PutRuleCommand,
  PutRuleCommandInput,
  PutTargetsCommand,
  PutTargetsCommandInput,
  RemoveTargetsCommand,
} from '@aws-sdk/client-eventbridge'
import {
  AddPermissionCommand,
  AddPermissionCommandInput,
  RemovePermissionCommand,
  LambdaClient,
} from '@aws-sdk/client-lambda'
import { GraphQLError } from 'graphql'

const REGION = 'us-east-1'
const lambdaClient = new LambdaClient({ region: REGION })
const ebClient = new EventBridgeClient({ region: REGION })

interface RuleData {
  schedule: string
  collections: {
    connect: { id: number }[]
  }
}

type UpdateRuleData = Omit<RuleData, 'collections'> & {
  collectionIds: number[]
}

/**
 * deleteRules removes lambda as target and then deletes the event bridge rules
 * for each collection
 * @param data
 */
export const addRules = async (data: RuleData) => {
  for (const { id } of data.collections.connect) {
    const name = `run-collection-${id}`
    const monitorParams: PutRuleCommandInput = {
      Name: name,
      ScheduleExpression: `rate(${data.schedule})`,
      State: 'ENABLED',
    }
    const targetInput: PutTargetsCommandInput = {
      Rule: name,
      Targets: [
        {
          Id: name,
          Arn: process.env.LAMBDA_ARN,
          Input: JSON.stringify({
            collectionId: id,
          }),
        },
      ],
    }

    try {
      const rule = await ebClient.send(new PutRuleCommand(monitorParams))
      await ebClient.send(new PutTargetsCommand(targetInput))
      const permissionInput: AddPermissionCommandInput = {
        FunctionName: 'run-scheduled-collection',
        Principal: 'events.amazonaws.com',
        Action: 'lambda:InvokeFunction',
        SourceArn: rule.RuleArn,
        StatementId: `InvokeFunction-${name}`,
      }
      const permission = await lambdaClient.send(
        new AddPermissionCommand(permissionInput)
      )
      console.log(permission.Statement)
    } catch (e) {
      if (e.name === 'ResourceConflictException') {
        console.log('permission already exists')
      } else {
        console.log(e)
        throw new GraphQLError(`Failed to schedule: ${e.message}`)
      }
    }
  }
  return true
}

export const updateRules = async ({
  collectionIds,
  schedule,
}: UpdateRuleData) => {
  const commands = collectionIds.map((collectionId) =>
    ebClient.send(
      new PutRuleCommand({
        Name: `run-collection-${collectionId}`,
        ScheduleExpression: `rate(${schedule})`,
      })
    )
  )
  try {
    await Promise.all(commands)
  } catch (err) {
    console.error(err)
    return false
  }
  return true
}

/**
 * deleteRules removes lambda as target and then deletes the event bridge rules
 * for each collection
 * @param collectionIds
 */
export const deleteRules = async (collectionIds: number[]) => {
  try {
    await Promise.all(
      collectionIds.flatMap((id) => {
        const name = `run-collection-${id}`
        return [
          lambdaClient.send(
            new RemovePermissionCommand({
              FunctionName: `run-scheduled-collection`,
              StatementId: `InvokeFunction-${name}`,
            })
          ),
          ebClient.send(
            new RemoveTargetsCommand({
              Rule: name,
              Ids: [name],
            })
          ),
        ]
      })
    )
    await Promise.all(
      collectionIds.map((id) => {
        const name = `run-collection-${id}`
        return ebClient.send(
          new DeleteRuleCommand({
            Force: true,
            Name: name,
          })
        )
      })
    )
    return {
      ok: true,
      count: collectionIds.length,
    }
  } catch (error) {
    console.log(error)
    return { ok: false, count: collectionIds.length }
  }
}
