const { verifyAccessToken } = require('../config/jwt');
const User = require('../models/User');
const { ApiError } = require('../utils/ApiError');

const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'Not authorized, no token'));
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return next(new ApiError(401, 'Not authorized, token invalid or expired'));
    }

    // Get user from token
    const user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, 'Not authorized'));
  }
};

module.exports = { protect };
