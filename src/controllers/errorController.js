import AppError from '../utils/appError.js';

const sendErrorDev = (error, res) => {
  res
    .status(error.statusCode)
    .json({ status: error.status, message: error.message, error, stack: error.stack });
};

const sendErrorProd = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({ status: error.status, message: error.message });
  } else {
    res.status(500).json({ status: 'error', message: 'Something went very wrong' });
  }
};

const handleDuplicateError = error => {
  const field = Object.keys(error.keyValue)[0];
  const value = error.keyValue[field];
  const message = `${field}: "${value}" already exists, please use another value!`;
  return new AppError(message, 400);
};

const handleCastError = error => {
  const message = `Invalid ${error.path} : ${error.value}`;
  return new AppError(message, 400);
};

const handleValidationError = error => {
  const errosList = Object.values(error.errors).map(err => err.message);
  const message = `Invalid input data: ${errosList.join('. ')}`;
  return new AppError(message, 400);
};

export default (error, req, res, _next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(error, res);
  }

  if (process.env.NODE_ENV === 'production') {
    console.error(error);
    if (error.code === 11000) error = handleDuplicateError(error);
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);

    sendErrorProd(error, res);
  }
};
