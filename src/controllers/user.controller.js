const catchAsync = require('../utils/catchAsync');
const userService = require('../services/user.service');

// GET /api/users  (admin only)
const getAllUsers = catchAsync(async (req, res, next) => {
  const result = await userService.getAllUsers(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

// GET /api/users/:id  (admin only)
const getUserById = catchAsync(async (req, res, next) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    data: { user },
  });
});

// PUT /api/users/:id  (admin or own profile)
const updateUser = catchAsync(async (req, res, next) => {
  const user = await userService.updateUser(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'User updated successfully!',
    data: { user },
  });
});

// DELETE /api/users/:id  (admin only)
const deleteUser = catchAsync(async (req, res, next) => {
  await userService.deleteUser(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully!',
  });
});

// PATCH /api/users/:id/toggle-status  (admin only)
const toggleUserStatus = catchAsync(async (req, res, next) => {
  const user = await userService.toggleUserStatus(req.params.id);

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully!`,
    data: { user },
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
};
