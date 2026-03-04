const AppError = require('../utils/AppError');

// ✅ Validate registration input
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email and password.', 400));
  }

  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters.', 400));
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return next(new AppError('Please provide a valid email address.', 400));
  }

  next();
};

// ✅ Validate login input
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  next();
};

// ✅ Validate update input
const validateUpdate = (req, res, next) => {
  const { email } = req.body;

  if (email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError('Please provide a valid email address.', 400));
    }
  }

  // Prevent password update through this route
  if (req.body.password) {
    return next(new AppError('This route is not for password updates.', 400));
  }

  next();
};

module.exports = { validateRegister, validateLogin, validateUpdate };
