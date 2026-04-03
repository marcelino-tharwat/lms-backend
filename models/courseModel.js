import mongoose from 'mongoose';

const courseShema = new mongoose.Schema({
  title: {
    type: String,
    reqiured: [true, 'A course must have a title'],
    unique: true,
    trim: true,
    maxlength: [40, 'A course name must have less or equal then 40 characters'],
    minlength: [10, 'A course name must have more or equal then 10 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Category must belong to a course'],
  },
  level: {
    type: String,
    required: [true, 'A course must have a level'],
    enum: {
      values: ['beginner', 'intermediate', 'advanced'],
      message: 'Level is either: beginner, intermediate, advanced',
    },
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  imageCover: {
    type: String,
    required: [true, 'A course must have a cover image'],
  },
  duration: String,
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Course = mongoose.model('Course', courseShema);

export default Course;
