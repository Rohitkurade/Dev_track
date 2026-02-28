const express = require('express');
const { body } = require('express-validator');
const {
  addJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Validation rules
const jobValidation = [
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('status').optional().isIn(['Applied', 'Interview', 'Rejected', 'Offer'])
    .withMessage('Invalid status'),
];

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getJobs)
  .post(jobValidation, validate, addJob);

router.route('/:id')
  .get(getJobById)
  .put(updateJob)
  .delete(deleteJob);

module.exports = router;
