import { DeleteTopicCommand } from '@aws-sdk/client-sns'
import { snsClient } from './snsClient.js'

export const deleteTopic = async (snsTopicArn) => {
  const params = { TopicArn: snsTopicArn }

  try {
    const data = await snsClient.send(new DeleteTopicCommand(params))
    console.log('Success.', data)
    return data
  } catch (err) {
    console.log('Error', err.stack)
  }
};