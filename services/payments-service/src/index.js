import express from "express";
import cors from "cors";
import { consumeEvent } from "../rabbitmq/consumer.js";
import { connectRabbitMQ } from "../rabbitmq/connection.js";
import paymentRoute from "./routes/paymentRoute.js";

const app = express();
const PORT = 5002;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
(async () => {
  await connectRabbitMQ();
  await consumeEvent();
})();

app.use("/", paymentRoute);

app.use("/*", (req, res) => {
  res.status(404).json({ message: "Route Not found" });
});
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
