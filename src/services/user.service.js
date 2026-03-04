const User = require('../models/user.model');
const AppError = require('../utils/AppError');

// 📋 Get all users (exclude password)
const getAllUsers = async (query = {}) => {
  const { page = 1, limit = 10, role, isActive } = query;

  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

// 🔍 Get single user by ID
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found.', 404);
  return user;
};

// ✏️ Update user
const updateUser = async (id, data) => {
  // prevent role & password update through this service
  delete data.password;
  delete data.role;

  const user = await User.findByIdAndUpdate(id, data, {
    new: true,           // return updated document
    runValidators: true, // run schema validators on update
  });

  if (!user) throw new AppError('User not found.', 404);
  return user;
};

// ❌ Delete user
const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError('User not found.', 404);
  return user;
};

// 🔄 Toggle user active status
const toggleUserStatus = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found.', 404);

  user.isActive = !user.isActive;
  await user.save();
  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
};
