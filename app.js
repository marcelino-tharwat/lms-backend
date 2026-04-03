import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import courseRouter from './routes/courseRoutes.js';
const app = express();

console.log('NODE_ENV =', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// app.use(cors());
app.use(express.json());

// routes
app.use('/api/courses', courseRouter);

export default app;
