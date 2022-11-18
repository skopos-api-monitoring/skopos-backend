import { CreateTopicCommand, CreateTopicCommandInput } from "@aws-sdk/client-sns";
import { snsClient } from './snsClient'
import { v4 as uuidv4 } from 'uuid'

export const createTopic = async () => {
  // contactInfo: "test@test.com" contactInfo: { email: "", pagerDuty: "", slack: ""}
  const params: CreateTopicCommandInput = {
    Name: `skopos-${uuidv4()}`, // test@test.com
  }

  try {
    const data = await snsClient.send(new CreateTopicCommand(params))
    console.log('create topic success', data)
    return data.TopicArn
  } catch (err) {
    console.log('Error', err.stack)
  }
}
