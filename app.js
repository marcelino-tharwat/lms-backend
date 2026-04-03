import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import courseRouter from './src/routes/courseRoutes.js';
import globalErrorHandeler from './src/controllers/errorController.js';
import AppError from './src/utils/appError.js';
const app = express();

console.log('NODE_ENV =', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// app.use(cors());
app.use(express.json());

// routes
app.use('/api/courses', courseRouter);
app.use(/(.*)/, (req, res, next) => {
  next(new AppError(`Cant not find ${req.originalUrl} on this server`, 404));
});

// global err MW
app.use(globalErrorHandeler);

export default app;
