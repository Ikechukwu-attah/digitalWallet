import { getRabbitChannel } from "./connection.js";

const handleUserProfileUpdated = async (message) => {
  try {
    const data = JSON.parse(message.content.toString());
    const { userId, firstname, lastname, middlename } = data;

    //update only the auth service
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstname && { firstname }),
        ...(lastname && { lastname }),
        ...(middlename && { middlename }),
      },
    });
    console.log(
      `User profile updated in the auth-service for userId:${userId}`
    );
  } catch (error) {
    console.error("Error updating user in auth-service", error);
  }
};

export const consumeUserProfileUpdated = async () => {
  try {
    const channel = getRabbitChannel();
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
