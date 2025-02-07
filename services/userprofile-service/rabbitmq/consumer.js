import { prisma } from "../src/config/db.js";
import { getRabbitChannel } from "./connection.js";
import amqp from "amqplib";

const consumeMessages = async() => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue("user_registered");

        console.log("🔔 Listening for `user_registered` events...");

        channel.consume("user_registered", async(msg) => {
            if (msg !== null) {
                const userData = JSON.parse(msg.content.toString());
                console.log("📩 Received `user_registered` event:", userData);

                // Check if profile already exists
                const existingProfile = await prisma.userProfile.findUnique({
                    where: { userId: userData.userId.toString() },
                });

                if (existingProfile) {
                    console.log(
                        `⚠️ Profile already exists for userId ${userData.userId}. Skipping creation.`
                    );
                    return;
                }

                // Create new user profile (MongoDB will auto-generate `_id`)
                const newProfile = await prisma.userProfile.create({
                    data: {
                        userId: userData.userId.toString(), // Reference to `auth-service` user ID
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
                    "✅ Auto-created profile in userprofile-service:",
                    newProfile
                );

                channel.ack(msg); // Acknowledge the message
            }
        });
    } catch (error) {
        console.error("❌ Error consuming user_registered event:", error);
    }
};

export default consumeMessages;