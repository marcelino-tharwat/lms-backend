const sendErrorDev = (error, res) => {
  res
    .status(error.statusCode)
    .josn({ status: error.status, message: error.message, error, stack: error.stack });
};

const sendErrorProd = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).josn({ status: error.status, message: error.message });
  } else {
    res.status(500).josn({ status: 'error', message: 'Something went very wrong' });
  }
};

export default (error, req, res, _next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if ((process.env.NODE_ENV = 'development')) {
    sendErrorDev(error, res);
  }

  if ((process.env.NODE_ENV = 'production')) {
    sendErrorProd(error, res);
  }
};
