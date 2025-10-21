import { body, param, validationResult } from "express-validator";

export const todoValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Todo title is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Todo title must be between 1 and 100 characters"),
];

export const todoIdValidationRules = [
  param("id")
    .isInt()
    .withMessage("Todo ID must be a valid integer"),
];

export const toggleCompletionRules = [
  body("completed")
    .isBoolean()
    .withMessage("Completed status must be a boolean value"),
];

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Invalid input data",
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

export const registerValidationRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers and underscores"),
    
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
    
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain at least one letter"),
    
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 40 })
    .withMessage("Name must be less than 40 characters")
];

export const loginValidationRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required"),
    
  body("password")
    .notEmpty()
    .withMessage("Password is required")
];