import { getRabbitChannel } from "./connection.js";

const consumeMessages = async () => {
  try {
    const channel = getRabbitChannel();
    const queue = "user_registered";
    //ensure the query exist
    await channel.assertQueue(queue, { durable: true });
    console.log(`Listening for messages on the queue: ${queue}`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        try {
          const userData = JSON.parse(msg.content.toString());
          console.log(`Creating user profile for :${userData.username}`);

          //Pass data to the handler function

          await handleUserRegistered(userData);

          //Acknowledge message
          channel.ack(msg);
        } catch (error) {
          console.error(`❌ Error processing message:`, error);
        }
      }
    });
  } catch (error) {
    console.log("Error in consumer:", error);
  }
};

export default consumeMessages;
