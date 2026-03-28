import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
const app = express();

console.log('NODE_ENV =', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') app.use(morgan());

app.use(cors());
app.use(express.json());

export default app;
