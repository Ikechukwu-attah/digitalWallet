import { getRabbitChannel } from "./connection.js";

export const publishToQueue = async (queueName, message) => {
  try {
    const channel = getRabbitChannel();
    await channel.assertQueue(queueName, { durable: true });

    //Send message to the queue
    const formattedMessage = JSON.stringify(message);
    channel.sendToQueue(queueName, Buffer.from(formattedMessage));
    console.log(`Message sent to the ${queueName}`, message);
  } catch (error) {
    console.error("Error publishing to queue", error);
  }
};
