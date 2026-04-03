import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });
const { default: app } = await import('./app.js');

const db = process.env.MONGODB.replace('<PASSWORD>', process.env.MONGODB_PASSWORD);

mongoose.connect(db).then(() => {
  console.log('DB connection successful');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
