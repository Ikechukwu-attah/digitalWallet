import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();
const RABBITMQ_URL =
    process.env.RABBITMQ_URL || "amqp://guest:guest@rabbitmq:5672";

let connection;
let channel;

export const connectRabbitMQ = async() => {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log("Connected to rabbitmq");
    } catch (error) {
        console.error("RabbitMQ connection error:", error);
    }
};

export const getRabbitChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel is not initialized ");
    }

    return channel;
};

// export const waitForRabbitMQ = async () => {
//   let channel;
//   while (!channel) {
//     try {
//       channel = getRabbitChannel();
//     } catch (error) {
//       console.warn("⏳ RabbitMQ not ready. Retrying...");
//       await new Promise((resolve) => setImmediate(resolve)); // Allows event loop to continue
//     }
//   }
//   return channel;
// };

export const waitForRabbitMQ = async(maxRetries = 10, delay = 3000) => {
    let channel;
    let attempts = 0;

    while (!channel && attempts < maxRetries) {
        try {
            channel = getRabbitChannel();
            console.log("✅ RabbitMQ is ready!");
            return channel;
        } catch (error) {
            attempts++;
            console.warn(
                `⏳ RabbitMQ not ready. Retrying in ${
          delay / 1000
        }s... (${attempts}/${maxRetries})`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }

    throw new Error("❌ RabbitMQ connection failed after multiple attempts.");
};