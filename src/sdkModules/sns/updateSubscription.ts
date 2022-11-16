import { UnsubscribeCommand } from "@aws-sdk/client-sns";
import { snsClient } from "./snsClient.js";
import { createSubscription } from "./createSubscription.js";
import { ListSubscriptionsByTopicCommand } from "@aws-sdk/client-sns";

const getSubscribers = async (topicArn) => {
  const params = { TopicArn: topicArn }
  try {
    const data = await snsClient.send(new ListSubscriptionsByTopicCommand(params));
    console.log("Successfully got subscribers.",  data);
    return data.Subscriptions.map(sub => sub.SubscriptionArn) // [{}, {}]
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

export const updateSubscription = async (topicArn, contactInfo) => {
  const subscribers = await getSubscribers(topicArn)
  for (const sub of subscribers) {
    if (sub !== 'PendingConfirmation') {
      await deleteSubscriber(sub)
    }
  }

  // create a subscription for each value in the contactInfo
  await createSubscription(contactInfo, topicArn)
}