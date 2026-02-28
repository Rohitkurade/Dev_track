const UserProject = require('../models/UserProject');
const asyncHandler = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');

// @desc    Add new project
// @route   POST /api/projects
// @access  Private
const addProject = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    techStack,
    githubLink,
    liveLink,
    imageUrl,
    status,
    startDate,
    endDate,
  } = req.body;

  const project = await UserProject.create({
    userId: req.user._id,
    title,
    description,
    techStack,
    githubLink,
    liveLink,
    imageUrl,
    status,
    startDate,
    endDate,
  });

  res.status(201).json(
    new ApiResponse(201, { project }, 'Project added successfully')
  );
});

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res, next) => {
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
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const projects = await UserProject.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  // Get total count
  const count = await UserProject.countDocuments(query);

  res.status(200).json(
    new ApiResponse(200, {
      projects,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProjects: count,
    }, 'Projects retrieved successfully')
  );
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res, next) => {
  const project = await UserProject.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!project) {
    return next(new ApiError(404, 'Project not found'));
  }

  res.status(200).json(
    new ApiResponse(200, { project }, 'Project retrieved successfully')
  );
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = asyncHandler(async (req, res, next) => {
  let project = await UserProject.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!project) {
    return next(new ApiError(404, 'Project not found'));
  }

  project = await UserProject.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(
    new ApiResponse(200, { project }, 'Project updated successfully')
  );
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = asyncHandler(async (req, res, next) => {
  const project = await UserProject.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!project) {
    return next(new ApiError(404, 'Project not found'));
  }

  await project.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, 'Project deleted successfully')
  );
});

module.exports = {
  addProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
