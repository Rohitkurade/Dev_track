const Problem = require('../models/Problem');

class AnalyticsService {
  // Get DSA analytics for a user
  static async getDSAAnalytics(userId) {
    const analytics = await Problem.aggregate([
      { $match: { userId } },
      {
        $facet: {
          totalSolved: [
            { $match: { status: 'Solved' } },
            { $count: 'count' },
          ],
          difficultyBreakdown: [
            { $match: { status: 'Solved' } },
            {
              $group: {
                _id: '$difficulty',
                count: { $sum: 1 },
              },
            },
          ],
          topicDistribution: [
            { $match: { status: 'Solved' } },
            {
              $group: {
                _id: '$topic',
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
          ],
          weeklyTrend: [
            { $match: { status: 'Solved' } },
            {
              $group: {
                _id: {
                  week: { $week: '$createdAt' },
                  year: { $year: '$createdAt' },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { '_id.year': -1, '_id.week': -1 } },
            { $limit: 12 },
          ],
          statusBreakdown: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    const result = analytics[0];

    return {
      totalSolved: result.totalSolved[0]?.count || 0,
      difficultyBreakdown: result.difficultyBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      topicDistribution: result.topicDistribution,
      weeklyTrend: result.weeklyTrend,
      statusBreakdown: result.statusBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };
  }

  // Get job application funnel analytics
  static async getJobFunnelAnalytics(userId) {
    const JobApplication = require('../models/JobApplication');

    const funnel = await JobApplication.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return funnel.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
  }

  // Get admin platform statistics
  static async getAdminStats() {
    const User = require('../models/User');
    const JobApplication = require('../models/JobApplication');
    const UserProject = require('../models/UserProject');

    const [
      totalUsers,
      totalProblems,
      totalJobs,
      totalProjects,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Problem.countDocuments(),
      JobApplication.countDocuments(),
      UserProject.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(10).select('-password -refreshToken'),
    ]);

    return {
      totalUsers,
      totalProblems,
      totalJobs,
      totalProjects,
      recentUsers,
    };
  }
}

module.exports = AnalyticsService;
