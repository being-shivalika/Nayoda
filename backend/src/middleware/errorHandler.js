const AppError = require("../utils/AppError");

const handleCastError = (err) => new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsError = (err) => {
  const field = Object.keys(err.keyValue || {})[0];
  return new AppError(`Duplicate value for "${field}" — please use another.`, 409);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input: ${messages.join(". ")}`, 400);
};

const handleJWTError = () => new AppError("Invalid token — please log in again.", 401);
const handleJWTExpired = () => new AppError("Session expired — please log in again.", 401);

// 404 handler for unmatched routes
const notFound = (req, _res, next) => {
  next(new AppError(`Route not found — ${req.originalUrl}`, 404));
};

// Centralized error formatter
const errorHandler = (err, req, res, _next) => {
  let error = { ...err, message: err.message, stack: err.stack };
  error.statusCode = err.statusCode || 500;

  if (err.name === "CastError") error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateFieldsError(err);
  if (err.name === "ValidationError") error = handleValidationError(err);
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpired();

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { errorHandler, notFound };
