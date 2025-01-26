import Joi from "joi";
import { body } from "express-validator";
//Define schema

const userValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  firstname: Joi.string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z]+$/)
    .required(),
  lastname: Joi.string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z]+$/)
    .required(),

  middlename: Joi.string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z]+$/)
    .optional(),

  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
    .required(),
});

// Validate incoming data
const validateUserInput = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: "failed", message: error.details[0].message });
  }
  next();
};

export default validateUserInput;

export const inputSanitize = () => {
  body("email").normalizeEmail();
  body("firstname").trim().escape();
  body("lastname").trim().escape();
  body("middlename").trim().escape().optional();
  body("password").trim();
};
