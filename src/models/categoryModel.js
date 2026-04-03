import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category must have a name'],
    unique: true,
  },
});

categorySchema.pre(/^find/, function () {
  this.select('-__v');
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
