import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = ({ id, role, firstname }) => {
    const token = jwt.sign({ id: id, role: role, firstname: firstname },
        process.env.TOKEN_SECRET, { expiresIn: "1h" }
    );

    return token;
};

export const refreshToken = ({ id, role, firstname }) => {
    const tokenRefresh = jwt.sign({ id: id, role: role, firstname: firstname },
        process.env.REFRESH_TOKEN, {
            expiresIn: "7d",
        }
    );

    return tokenRefresh;
};