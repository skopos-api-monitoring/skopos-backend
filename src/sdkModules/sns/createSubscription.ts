import { SubscribeCommand } from "@aws-sdk/client-sns"
import { snsClient } from "./snsClient.js"

export const createSubscription = async (topicARN, data) => {
  const params = {
    Protocol: 'email',
    TopicArn: topicARN,
    Endpoint: data.contactInfo,
  }

  try {
    const data = await snsClient.send(new SubscribeCommand(params));
    console.log('Success.', data);
    return data
  } catch (err) {
    console.log('Error', err.stack);
  }
}