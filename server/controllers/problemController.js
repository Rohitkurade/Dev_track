const Problem = require('../models/Problem');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const mongoose = require('mongoose');

// @desc    Add new problem
// @route   POST /api/problems
// @access  Private
const addProblem = asyncHandler(async (req, res, next) => {
  const { title, platform, difficulty, topic, status, notes, problemLink, solutionLink } = req.body;

  const problem = await Problem.create({
    userId: req.user._id,
    title,
    platform,
    difficulty,
    topic,
    status,
    notes,
    problemLink,
    solutionLink,
  });

  res.status(201).json(
    new ApiResponse(201, { problem }, 'Problem added successfully')
  );
});

// @desc    Get all problems for user
// @route   GET /api/problems
// @access  Private
const getProblems = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    difficulty,
    topic,
    status,
    search,
  } = req.query;

  // Build query
  const query = { userId: req.user._id };

  if (difficulty) query.difficulty = difficulty;
  if (topic) query.topic = topic;
  if (status) query.status = status;
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  // Execute query with pagination
  const problems = await Problem.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  // Get total count
  const count = await Problem.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      problems,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProblems: count,
    }, 'Problems retrieved successfully')
  );
});

// @desc    Get single problem
// @route   GET /api/problems/:id
// @access  Private
const getProblemById = asyncHandler(async (req, res, next) => {
  const problem = await Problem.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!problem) {
    return next(new ApiError(404, 'Problem not found'));
  }

  res.status(200).json(
    new ApiResponse(200, { problem }, 'Problem retrieved successfully')
  );
});

// @desc    Update problem
// @route   PUT /api/problems/:id
// @access  Private
const updateProblem = asyncHandler(async (req, res, next) => {
  let problem = await Problem.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!problem) {
    return next(new ApiError(404, 'Problem not found'));
  }

  problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(
    new ApiResponse(200, { problem }, 'Problem updated successfully')
  );
});

// @desc    Delete problem
// @route   DELETE /api/problems/:id
// @access  Private
const deleteProblem = asyncHandler(async (req, res, next) => {
  const problem = await Problem.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!problem) {
    return next(new ApiError(404, 'Problem not found'));
  }

  await problem.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, 'Problem deleted successfully')
  );
});

module.exports = {
  addProblem,
  getProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
};
