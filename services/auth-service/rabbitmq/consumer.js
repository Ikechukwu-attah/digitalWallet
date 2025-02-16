import { getRabbitChannel, waitForRabbitMQ } from "./connection.js";
import { handleUserDelete } from "./handlers/handleUserDelete.js";
import { handleUserProfileUpdated } from "./handlers/handleUserProfileUpdated.js";

export const consumeEvent = async () => {
  try {
    const channel = await waitForRabbitMQ();

    await channel.assertQueue("UserProfileUpdated", { durable: true });
    channel.consume("UserProfileUpdated", async (message) => {
      try {
        if (message !== null) {
          await handleUserProfileUpdated(message);
          channel.ack(message);
        }
        console.log("Listening for UserProfileUpdated...");
      } catch (error) {
        console.error("Error consuming UserProfileUpdated event", error);
      }
    });

    //Delete User Event
    await channel.assertQueue("userDeleted", { durable: true });
    channel.consume("userDeleted", async (message) => {
      try {
        if (message !== null) {
          await handleUserDelete(message);
          channel.ack(message);
        }
      } catch (error) {
        console.error("Error consuming userDeleted  event", error);
      }
    });
  } catch (error) {
    console.log("Error consuming  event:", error);
  }
};
