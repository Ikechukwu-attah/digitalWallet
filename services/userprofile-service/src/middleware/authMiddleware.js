import jwt from "jsonwebtoken";
import axios from "axios";

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }
    const authServiceURL =
      process.env.AUTH_SERVICE_URL || "http://localhost:8080/auth/user";
    const verifyResponse = await axios.post(`${authServiceURL}/verify`, {
      token,
    });

    if (!verifyResponse.data || !verifyResponse.data.valid) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    req.user = verifyResponse.data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Unauthorized - Token verification failed" });
  }
};

export default authenticateUser;
