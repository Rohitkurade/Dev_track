const express = require('express');
const { body } = require('express-validator');
const {
  addProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
} = require('../controllers/problemController');
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Validation rules
const problemValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('platform').isIn(['LeetCode', 'HackerRank', 'CodeForces', 'GeeksforGeeks', 'Others'])
    .withMessage('Invalid platform'),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Invalid difficulty'),
  body('topic').trim().notEmpty().withMessage('Topic is required'),
  body('status').optional().isIn(['Solved', 'Revision', 'Pending'])
    .withMessage('Invalid status'),
];

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getProblems)
  .post(problemValidation, validate, addProblem);

router.route('/:id')
  .get(getProblemById)
  .put(updateProblem)
  .delete(deleteProblem);

module.exports = router;
