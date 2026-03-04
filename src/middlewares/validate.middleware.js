const { body, validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

// ─────────────────────────────────────────
// 🛠️ REUSABLE VALIDATION RULES
// ─────────────────────────────────────────

const nameRules = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required.")
  .isLength({ min: 2, max: 50 })
  .withMessage("Name must be between 2 and 50 characters.");

const emailRules = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required.")
  .isEmail()
  .withMessage("Please provide a valid email address.")
  .normalizeEmail(); // converts "John@Gmail.COM" → "john@gmail.com"

const passwordRules = body("password")
  .notEmpty()
  .withMessage("Password is required.")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters.")
  .matches(/\d/)
  .withMessage("Password must contain at least one number.");

// ─────────────────────────────────────────
// 🔍 ERROR COLLECTOR MIDDLEWARE
// ─────────────────────────────────────────
// Run this AFTER the rules to collect and return errors

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // collect all error messages into one clean array
    const messages = errors.array().map((err) => err.msg);

    return next(new AppError(messages.join(", "), 400));
  }

  next();
};

// ─────────────────────────────────────────
// ✅ VALIDATION CHAINS
// ─────────────────────────────────────────

// POST /api/auth/register
const validateRegister = [
  nameRules,
  emailRules,
  passwordRules,
  handleValidationErrors, // always last
];

// POST /api/auth/login
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email."),
  body("password").notEmpty().withMessage("Password is required."),
  handleValidationErrors,
];

// PUT /api/users/:id
const validateUpdate = [
  body("email")
    .optional() // only validate if provided
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email.")
    .normalizeEmail(),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters."),
  body("password")
    .custom(() => {
      throw new Error("This route is not for password updates.");
    })
    .optional(), // only trigger if password field is sent
  handleValidationErrors,
];

module.exports = { validateRegister, validateLogin, validateUpdate };
