import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: String,
});

const Category = mongoose.model('Category', categorySchema);
F
export default Category;
