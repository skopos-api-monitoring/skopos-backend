import { SubscribeCommand } from "@aws-sdk/client-sns"
import { snsClient } from "./snsClient.js"

export const createSubscription = async (contactInfo, topicArn) => {
  console.log(contactInfo)
  const params = {
    Protocol: 'email',
    TopicArn: topicArn,
    Endpoint: contactInfo,
  }

  try {
    const data = await snsClient.send(new SubscribeCommand(params));
    console.log('Success.', data);
    return data
  } catch (err) {
    console.log('Error', err.stack);
  }
}