const express = require('express');
const { body } = require('express-validator');
const {
  getAllUsers,
  getPlatformStats,
  deleteUser,
  updateUserRole,
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');
const { validate } = require('../middlewares/validationMiddleware');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// Routes
router.get('/users', getAllUsers);
router.get('/stats', getPlatformStats);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', [
  body('role').isIn(['user', 'admin']).withMessage('Invalid role'),
], validate, updateUserRole);

module.exports = router;
