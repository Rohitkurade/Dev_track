const JobApplication = require('../models/JobApplication');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');

// @desc    Add new job application
// @route   POST /api/jobs
// @access  Private
const addJob = asyncHandler(async (req, res, next) => {
  const {
    company,
    role,
    status,
    notes,
    appliedDate,
    location,
    jobType,
    salary,
    jobLink,
  } = req.body;

  const job = await JobApplication.create({
    userId: req.user._id,
    company,
    role,
    status,
    notes,
    appliedDate,
    location,
    jobType,
    salary,
    jobLink,
  });

  res.status(201).json(
    new ApiResponse(201, { job }, 'Job application added successfully')
  );
});

// @desc    Get all job applications for user
// @route   GET /api/jobs
// @access  Private
const getJobs = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    status,
    search,
  } = req.query;

  // Build query
  const query = { userId: req.user._id };

  if (status) query.status = status;
  if (search) {
    query.$or = [
      { company: { $regex: search, $options: 'i' } },
      { role: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const jobs = await JobApplication.find(query)
    .sort({ appliedDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  // Get total count
  const count = await JobApplication.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalJobs: count,
    }, 'Job applications retrieved successfully')
  );
});

// @desc    Get single job application
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = asyncHandler(async (req, res, next) => {
  const job = await JobApplication.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!job) {
    return next(new ApiError(404, 'Job application not found'));
  }

  res.status(200).json(
    new ApiResponse(200, { job }, 'Job application retrieved successfully')
  );
});

// @desc    Update job application
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = asyncHandler(async (req, res, next) => {
  let job = await JobApplication.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!job) {
    return next(new ApiError(404, 'Job application not found'));
  }

  job = await JobApplication.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(
    new ApiResponse(200, { job }, 'Job application updated successfully')
  );
});

// @desc    Delete job application
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = asyncHandler(async (req, res, next) => {
  const job = await JobApplication.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!job) {
    return next(new ApiError(404, 'Job application not found'));
  }

  await job.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, 'Job application deleted successfully')
  );
});

module.exports = {
  addJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
};
