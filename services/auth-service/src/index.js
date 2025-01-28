import express from "express";
import authRoutes from "./routes/auth.routes.js";
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request method: ${req.method}, URL: ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("GET request to '/' works!");
});

app.post("/try/hi", (req, res) => {
  console.log(req.body); // To confirm the request body is parsed correctly
  res.send("POST request to '/' works!");
});

app.use("/user", authRoutes);
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
