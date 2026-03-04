const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { validateUpdate } = require('../middlewares/validate.middleware');

// All routes below require login
router.use(protect);

// Admin only routes
router.get('/', restrictTo('admin'), userController.getAllUsers);
router.get('/:id', restrictTo('admin'), userController.getUserById);
router.delete('/:id', restrictTo('admin'), userController.deleteUser);
router.patch('/:id/toggle-status', restrictTo('admin'), userController.toggleUserStatus);

// Admin or own profile
router.put('/:id', validateUpdate, userController.updateUser);

module.exports = router;
