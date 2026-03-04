// Custom Error Class
// Usage: throw new AppError('User not found', 404)

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // our own controlled errors
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
