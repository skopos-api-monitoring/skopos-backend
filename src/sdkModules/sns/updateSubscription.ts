import { UnsubscribeCommand } from "@aws-sdk/client-sns";
import { snsClient } from "./snsClient.js";
import { createSubscription } from "./createSubscription.js";
import { ListSubscriptionsByTopicCommand } from "@aws-sdk/client-sns";

const getSubscribers = async (topicArn) => {
  const params = { TopicArn: topicArn }; //TOPIC_ARN
  try {
    const data = await snsClient.send(new ListSubscriptionsByTopicCommand(params));
    console.log("Successfully got subscribers.",  data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err.stack);
  }
};

const deleteSubscriber = async (subscriberArn) => {
  const params = { SubscriptionArn: "TOPIC_SUBSCRIPTION_ARN" };
  try {
    const data = await snsClient.send(new UnsubscribeCommand(params));
    console.log("Success.",  data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err.stack);
  }
};

export const updateSubscription = async (topicArn, data) => {
  const subscribers = await getSubscribers(topicArn)
  console.log(subscribers)
  if (subscribers) {
    await deleteSubscriber(subscribers)
  }

  console.log('new data', data)
  createSubscription(topicArn, data)
}