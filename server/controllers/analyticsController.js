const asyncHandler = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const AnalyticsService = require('../services/analyticsService');

// @desc    Get DSA analytics
// @route   GET /api/analytics/dsa
// @access  Private
const getDSAAnalytics = asyncHandler(async (req, res, next) => {
  const analytics = await AnalyticsService.getDSAAnalytics(req.user._id);

  res.status(200).json(
    new ApiResponse(200, { analytics }, 'DSA analytics retrieved successfully')
  );
});

// @desc    Get job funnel analytics
// @route   GET /api/analytics/jobs
// @access  Private
const getJobAnalytics = asyncHandler(async (req, res, next) => {
  const funnel = await AnalyticsService.getJobFunnelAnalytics(req.user._id);

  res.status(200).json(
    new ApiResponse(200, { funnel }, 'Job analytics retrieved successfully')
  );
});

module.exports = {
  getDSAAnalytics,
  getJobAnalytics,
};
