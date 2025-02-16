import { getRabbitChannel } from "./connection.js";

export const publishQueue = async (queueName, message) => {
  try {
    const channel = getRabbitChannel();
    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });

    console.log(`[auth service ] message sent ti the ${queueName}:`, message);
  } catch (error) {
    console.error("[auth-service] Error publishing to queue:", error);
  }
};
