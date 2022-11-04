import {
  EventBridgeClient,
  PutRuleCommand,
  PutRuleCommandInput,
  PutTargetsCommand,
  PutTargetsCommandInput,
} from '@aws-sdk/client-eventbridge'
import { LambdaClient, AddPermissionCommandInput, AddPermissionCommand } from '@aws-sdk/client-lambda'

const REGION = 'us-east-1'
const lambdaClient = new LambdaClient({ region: REGION })
const ebClient = new EventBridgeClient({ region: REGION })

export const addOrUpdateRule = (data) => {
  // creates or updates rule
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
            contactInfo: data.contactInfo,
          }),
        },
      ],
    }

    try {
      const rule = await ebClient.send(new PutRuleCommand(monitorParams))
      await ebClient.send(new PutTargetsCommand(targetInput))
      const permissionInput: AddPermissionCommandInput = {
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

  // // deletes rule
  // ebMonitor.deleteRule(params, function(err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     console.log("Success", data.RuleArn);
  //   }
  // });
}
