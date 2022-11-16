import { CreateTopicCommand } from "@aws-sdk/client-sns";
import { snsClient } from './snsClient'
import { v4 as uuidv4 } from 'uuid'

interface Params {
  Name: any
}

export const createTopic = async ({ contactInfo }) => { // contactInfo: "test@test.com" contactInfo: { email: "", pagerDuty: "", slack: ""}
  const params: Params = {
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
