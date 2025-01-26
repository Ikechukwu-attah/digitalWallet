import express from "express";
const app = express();
import dotenv from "dotenv";

dotenv.config();

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Auth Service is up and running!");
});

console.log("testing", process.env.DB_HOST, process.env.DB_NAME);
// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth Service is running on port ${PORT}`);
});
