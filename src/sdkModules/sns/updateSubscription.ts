import { UnsubscribeCommand } from "@aws-sdk/client-sns";
import { snsClient } from "./snsClient.js";
import { createSubscription } from "./createSubscription.js";
import { ListSubscriptionsByTopicCommand } from "@aws-sdk/client-sns";

const getSubscribers = async (topicArn) => {
  const params = { TopicArn: topicArn }
  try {
    const data = await snsClient.send(new ListSubscriptionsByTopicCommand(params));
    console.log("Successfully got subscribers.",  data);
    return data.Subscriptions[0].SubscriptionArn
  } catch (err) {
    console.log("Error", err.stack);
  }
};

const deleteSubscriber = async (subscriberArn) => {
  const params = { SubscriptionArn: subscriberArn }
  try {
    const data = await snsClient.send(new UnsubscribeCommand(params));
    console.log("Success.", data);
    return data
  } catch (err) {
    console.log("Error", err.stack);
  }
};

export const updateSubscription = async (topicArn, email) => {
  const subscriber = await getSubscribers(topicArn)
  if (subscriber !== 'PendingConfirmation') {
    await deleteSubscriber(subscriber)
  }

  console.log('new data', email)
  await createSubscription(email.set, topicArn)
}