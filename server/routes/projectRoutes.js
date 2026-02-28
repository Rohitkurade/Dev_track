const express = require('express');
const { body } = require('express-validator');
const {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Validation rules
const projectValidation = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('techStack').isArray({ min: 1 }).withMessage('Tech stack must be an array with at least one item'),
];

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getProjects)
  .post(projectValidation, validate, addProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
