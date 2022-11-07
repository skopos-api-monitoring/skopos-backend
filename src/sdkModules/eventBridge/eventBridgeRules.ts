import {
  EventBridgeClient,
  PutRuleCommand,
  PutRuleCommandInput,
  PutTargetsCommand,
  PutTargetsCommandInput,
} from '@aws-sdk/client-eventbridge'
import { LambdaClient, AddPermissionCommandInput, AddPermissionCommand } from '@aws-sdk/client-lambda'

const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION })
const ebClient = new EventBridgeClient({ region: process.env.AWS_REGION })

export const addOrUpdateRule = (data) => {
  data.collections.connect.forEach(async ({ id }) => {
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
        // rename this
        FunctionName: 'runScheduledCollection',
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
      console.log(e)
      throw e
    }
  })
}
