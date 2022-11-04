import {
  PutTargetsCommand,
  EventBridgeClient,
  PutRuleCommand,
  PutRuleCommandInput,
  PutTargetsCommandInput,
} from '@aws-sdk/client-eventbridge'

const REGION = 'us-east-1'

const ebClient = new EventBridgeClient({ region: REGION })

export const addOrUpdateRule = (data, collectionIds) => {
  // creates or updates rule
  collectionIds.connect.forEach(async ({ id }) => {
    const name = `${data.id}.${id}`
    const monitorParams: PutRuleCommandInput = {
      Name: name,
      ScheduleExpression: `rate(${data.schedule})`,
      State: 'ENABLED',
      Tags: [
        {
          Key: 'email',
          Value: data.contactInfo,
        },
      ],
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
      await ebClient.send(new PutRuleCommand(monitorParams))
      await ebClient.send(new PutTargetsCommand(targetInput))
    } catch (e) {
      console.log(e)
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
