import dotenv from "dotenv";

dotenv.config();

export const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token required" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return res.status(200).json({ valid: true, user: decoded });
  } catch (error) {
    return res.status(401).json({ valid: false, error: "Invalid token" });
  }
};
