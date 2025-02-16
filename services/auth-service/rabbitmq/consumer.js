import { getRabbitChannel, waitForRabbitMQ } from "./connection.js";
import { handleUserProfileUpdated } from "./handlers/handleUserProfileUpdated.js";

export const consumeUserProfileUpdated = async () => {
  try {
    const channel = await waitForRabbitMQ();

    await channel.assertQueue("UserProfileUpdated", { durable: true });
    channel.consume("UserProfileUpdated", async (message) => {
      if (message !== null) {
        await handleUserProfileUpdated(message);
        channel.ack(message);
      }
    });

    console.log("Listening for UserProfileUpdated...");
  } catch (error) {
    console.log("Error consuming UserProfileUpdated event:", error);
  }
};
