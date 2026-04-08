import express from 'express';
// import cors from 'cors';
import morgan from 'morgan';
import courseRouter from './src/routes/courseRoutes.js';
import categoryRouter from './src/routes/categoryRoutes.js';
import lessonRouter from './src/routes/lessonRoutes.js';
import userRouter from './src/routes/userRoutes.js';
import globalErrorHandeler from './src/controllers/errorController.js';
import AppError from './src/utils/appError.js';
const app = express();

console.log('NODE_ENV =', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// app.use(cors());
// app.enable('trust proxy');
app.use(express.json());

// routes
app.use('/api/courses', courseRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/lessons', lessonRouter);
app.use('/api/users', userRouter);

app.use(/(.*)/, (req, res, next) => {
  next(new AppError(`Cant not find ${req.originalUrl} on this server`, 404));
});

// global err MW
app.use(globalErrorHandeler);

export default app;
