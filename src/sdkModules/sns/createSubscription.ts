import { SubscribeCommand } from "@aws-sdk/client-sns"
import { snsClient } from "./snsClient"

const addSub = async (params) => {
  try {
    const data = await snsClient.send(new SubscribeCommand(params));
    console.log('Success.', data);
    return data
  } catch (err) {
    console.log('Error', err.stack);
  }
}

export const createSubscription = async (contactInfo, topicArn) => {
  console.log('creating new sub', contactInfo, 'on topic', topicArn)
  // contactInfo = { email: "test", pagerDuty: "test", slack: "webhookUrl"}
  if (contactInfo.email) {
    const emailParams = {
      Protocol: 'email',
      TopicArn: topicArn,
      Endpoint: contactInfo.email,
    }

    await addSub(emailParams)
  }

  if (contactInfo.pagerDuty) {
    const pagerDutyParams = {
      Protocol: 'HTTPS',
      TopicArn: topicArn,
      Endpoint: contactInfo.pagerDuty,
    }

    await addSub(pagerDutyParams)
  }
}
