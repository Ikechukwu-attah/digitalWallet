import { waitForRabbitMQ } from "./connection.js";
import { handleUserRegistered } from "./handlers/handleUserRegistered.js";

export const consumeEvent = async () => {
  try {
    const channel = await waitForRabbitMQ();
    await channel.assertQueue("user_registered", { durable: true });
    console.log("Listening to user registered event");

    channel.consume("user_registered", async (message) => {
      try {
        if (message !== null) {
          await handleUserRegistered(message);
          channel.ack(message);
        }
      } catch (error) {
        console.log("Error processing user registered event", error);
      }
    });
  } catch (error) {
    console.log("Error processing  event", error);
  }
};
