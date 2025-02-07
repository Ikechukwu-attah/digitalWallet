import dotenv from "dotenv";
import jwt from "jsonwebtoken"; // Ensure JWT is imported

dotenv.config();

export const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("🟡 Token to verify:", token);
    console.log("🔑 Secret being used:", process.env.TOKEN_SECRET);

    if (!token) {
      return res.status(400).json({ error: "Token required" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ valid: false, error: "Invalid token" });
  }
};
