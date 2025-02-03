import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp/rabbitmq:5672";

let connection;
let channel;

export const connectRabbitMQ = async () => {
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
