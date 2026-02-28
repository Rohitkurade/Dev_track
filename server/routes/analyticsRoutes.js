const express = require('express');
const {
  getDSAAnalytics,
  getJobAnalytics,
} = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.get('/dsa', getDSAAnalytics);
router.get('/jobs', getJobAnalytics);

module.exports = router;
