import { prisma } from "../src/config/db.js";
import { getRabbitChannel } from "./connection.js";
import { handleUserRegistered } from "./handlers/handleUserRegistered.js";

export const consumeEvent = async () => {
  try {
    const channel = getRabbitChannel();
    // Consume registered event
    await channel.assertQueue("user_registered", { durable: true });

    channel.consume("user_registered", async (message) => {
      try {
        if (message !== null) {
          await handleUserRegistered(message);
          channel.ack(message); // Acknowledge the message after processing
        }

        console.log("📥 Listening for `user_registered` events...");
      } catch (error) {
        console.error("❌ Error processing `user_registered` event:", error);
      }
    });
  } catch (error) {
    console.error("❌ Error consuming `user_registered` events:", error);
  }
};
