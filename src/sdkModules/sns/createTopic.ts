import { CreateTopicCommand } from "@aws-sdk/client-sns";
import { snsClient } from './snsClient.js'

interface Params {
  Name: any
}

export const createTopic = async ({ contactInfo }) => { // contactInfo: "test@test.com" contactInfo: { email: "", pagerDuty: "", slack: ""}
  const params: Params = {
    Name: Object.values(contactInfo)[0],
  }

  try {
    const data = await snsClient.send(new CreateTopicCommand(params))
    console.log('create topic success', data)
    return data.TopicArn
  } catch (err) {
    console.log('Error', err.stack)
  }
}
