import express from "express";
import validateUserInput, {
  inputSanitize,
} from "../middleware/authUserInputValidation.js";
import { register } from "../controller/user.js";

const route = express.Router();

route.post("/register", inputSanitize, validateUserInput, register);
