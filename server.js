import mongoose from 'mongoose';
import dotenv from 'dotenv';

import app from './app.js';
dotenv.config({ path: './config.env' });

const db = process.env.MONGODB.replace('<PASSWORD>', process.env.MONGODB_PASSWORD);

mongoose.connect(db).then(() => {
  console.log('DB connection successful');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
