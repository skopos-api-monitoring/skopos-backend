import { CreateTopicCommand } from "@aws-sdk/client-sns";
import { snsClient } from './snsClient.js'

export const createTopic = async ({ contactInfo }) => {
  const params = {
    Name: contactInfo.split('@')[0],
  }

  try {
    const data = await snsClient.send(new CreateTopicCommand(params))
    console.log('create topic success', data)
    return data.TopicArn
  } catch (err) {
    console.log('Error', err.stack)
  }
}
