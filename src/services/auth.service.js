const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');

// 🔑 Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// 📝 Register new user
const register = async (data) => {
  const { name, email, password } = data;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered. Please login.', 400);
  }

  // Create user (password hashed automatically via pre-save hook)
  const user = await User.create({ name, email, password });

  // Generate token
  const token = generateToken(user._id);

  return { user, token };
};

// 🔓 Login user
const login = async (email, password) => {
  // Find user and include password (select:false by default)
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated.', 401);
  }

  // Generate token
  const token = generateToken(user._id);

  // Remove password from response
  user.password = undefined;

  return { user, token };
};

module.exports = { register, login };
