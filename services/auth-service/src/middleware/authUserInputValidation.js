import { body, validationResult } from "express-validator";

export const validateAndSanitizeUser = [
    // Validation and Sanitization
    body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
    body("firstname")
    .isLength({ min: 2, max: 50 })
    .withMessage("Firstname must be between 2 and 50 characters")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("Firstname must contain only letters")
    .trim()
    .escape(),
    body("lastname")
    .isLength({ min: 2, max: 50 })
    .withMessage("Lastname must be between 2 and 50 characters")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("Lastname must contain only letters")
    .trim()
    .escape(),
    body("middlename")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Middlename must be between 2 and 50 characters")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("Middlename must contain only letters")
    .trim()
    .escape(),
    body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage(
        "Password must contain at least one letter, one number, and one special character"
    )
    .trim(),

    // Error handling middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "failed", errors: errors.array() });
        }
        next();
    },
];

export const validateLoginUserInput = [
    body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required").trim(),
];