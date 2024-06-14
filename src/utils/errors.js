class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
};

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
};

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
};

class InternalServerError extends AppError {
  constructor(message) {
    super(message, 500);
  }
};

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  InternalServerError,
};