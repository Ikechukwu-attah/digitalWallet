import { prisma } from "../src/config/db.js";
import { getRabbitChannel } from "./connection.js";

const handleUserRegistered = async (message) => {
  try {
    const userData = JSON.parse(message.content.toString());
    console.log(`Received  user_registered event: ${userData}`);

    //check if user exist
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: userData.userId.toString() },
    });
    if (existingProfile) {
      console.log(
        `⚠️ Profile already exists for userId ${userData.userId}. Skipping creation.`
      );
      return;
    }

    // Create new user profile
    const newProfile = await prisma.userProfile.create({
      data: {
        userId: userData.userId.toString(),
        email: userData.email,
        username: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
        middlename: userData.middlename || null,
        phone: "",
        address: "",
        dateOfBirth: null,
        profilePicture: "",
        bio: "",
      },
    });
    console.log(
      "✅ Auto-created profile in `userProfile-service`:",
      newProfile
    );
  } catch (error) {
    console.error("❌ Error processing `user_registered` event:", error);
  }
};

export const consumeUserRegistered = async () => {
  try {
    const channel = getRabbitChannel();
    await channel.assertQueue("user_registered", { durable: true });

    channel.consume("user_registered", async (message) => {
      if (message !== null) {
        await handleUserRegistered(message);
        channel.ack(message); // Acknowledge the message after processing
      }
    });

    console.log("📥 Listening for `user_registered` events...");
  } catch (error) {
    console.error("❌ Error consuming `user_registered` events:", error);
  }
};
