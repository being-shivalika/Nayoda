const asyncHandler = require("express-async-handler");
const AppError = require("../utils/AppError");
const { verifyAccessToken } = require("../utils/token");
const { User } = require("../models");

// Verifies the bearer token and attaches `req.user`
const protect = asyncHandler(async (req, _res, next) => {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authorized — please log in.", 401);
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw new AppError("Session expired or invalid — please log in again.", 401);
  }

  const user = await User.findById(decoded.id);
  if (!user) throw new AppError("The user for this token no longer exists.", 401);
  if (user.isSuspended) throw new AppError("This account has been suspended.", 403);

  req.user = user;
  next();
});

// Role-based access control — usage: restrictTo("admin", "client")
const restrictTo =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("You do not have permission to perform this action.", 403);
    }
    next();
  };

module.exports = { protect, restrictTo };
