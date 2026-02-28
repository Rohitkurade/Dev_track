const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const AnalyticsService = require('../services/analyticsService');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, search } = req.query;

  // Build query
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const users = await User.find(query)
    .select('-password -refreshToken')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  // Get total count
  const count = await User.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count,
    }, 'Users retrieved successfully')
  );
});

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getPlatformStats = asyncHandler(async (req, res, next) => {
  const stats = await AnalyticsService.getAdminStats();

  res.status(200).json(
    new ApiResponse(200, { stats }, 'Platform stats retrieved successfully')
  );
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  // Prevent admin from deleting themselves
  if (user._id.toString() === req.user._id.toString()) {
    return next(new ApiError(400, 'Cannot delete your own account'));
  }

  // Delete user and all associated data
  const Problem = require('../models/Problem');
  const JobApplication = require('../models/JobApplication');
  const UserProject = require('../models/UserProject');

  await Promise.all([
    user.deleteOne(),
    Problem.deleteMany({ userId: user._id }),
    JobApplication.deleteMany({ userId: user._id }),
    UserProject.deleteMany({ userId: user._id }),
  ]);

  res.status(200).json(
    new ApiResponse(200, null, 'User deleted successfully')
  );
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return next(new ApiError(400, 'Invalid role'));
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  user.role = role;
  await user.save();

  res.status(200).json(
    new ApiResponse(200, { user }, 'User role updated successfully')
  );
});

module.exports = {
  getAllUsers,
  getPlatformStats,
  deleteUser,
  updateUserRole,
};
