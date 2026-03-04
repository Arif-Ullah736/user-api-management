const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');

// POST /api/auth/register
const register = catchAsync(async (req, res, next) => {
  const { user, token } = await authService.register(req.body);

  res.status(201).json({
    success: true,
    message: 'Account created successfully!',
    token,
    data: { user },
  });
});

// POST /api/auth/login
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: 'Logged in successfully!',
    token,
    data: { user },
  });
});

// GET /api/auth/me  (protected)
const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: { user: req.user }, // req.user set by protect middleware
  });
});

module.exports = { register, login, getMe };
