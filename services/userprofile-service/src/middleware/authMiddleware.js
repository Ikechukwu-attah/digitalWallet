import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      console.log("❌ No token found in request headers.");
      return res
        .status(401)
        .json({ error: "Unauthorized - No token provided" });
    }

    console.log("🟡 Received Token in userprofile-service:", token);

    // Verify token via API Gateway
    const authServiceURL =
      process.env.AUTH_SERVICE_URL || "http://api-gateway:8080/auth/user";
    console.log("🔗 Sending token to API Gateway:", authServiceURL);

    const verifyResponse = await axios.post(`${authServiceURL}/verify`, {
      token,
    });

    console.log("✅ API Gateway Verification Response:", verifyResponse.data);

    if (!verifyResponse.data || !verifyResponse.data.valid) {
      console.log("❌ Token verification failed via API Gateway.");
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    console.log("✅ User Authenticated in userprofile-service:", req.user);

    req.user = verifyResponse.data.user;
    console.log("✅ User Authenticated in userprofile-service:", req.user);

    next();
  } catch (error) {
    console.error("❌ Error verifying token:", error.message);
    return res
      .status(401)
      .json({ error: "Unauthorized - Token verification failed" });
  }
};

export default authenticateUser;
