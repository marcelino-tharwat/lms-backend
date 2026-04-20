import mongoose from 'mongoose';
import Lesson from './lessonModel.js';
import Enrollment from './enrollmentModel.js';
const courseShema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A course must have a title'],
      unique: true,
      trim: true,
      maxlength: [50, 'A course name must have less or equal then 50 characters'],
      minlength: [10, 'A course name must have more or equal then 10 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    lessonsCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Course must belong to a category'],
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Course must belong to an instructor'],
    },
    level: {
      type: String,
      required: [true, 'A course must have a level'],
      enum: {
        values: ['beginner', 'intermediate', 'advanced', 'all'],
        message: 'Level is either: beginner, intermediate, advanced and all',
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

courseShema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'course',
});

courseShema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'course',
});

courseShema.pre(/^find/, function () {
  this.select('-__v').populate({ path: 'category', select: '-__v ' });
});

courseShema.pre('deleteOne', { document: true, query: false }, async function () {
  await Lesson.deleteMany({ course: this._id });
  await Enrollment.deleteMany({ course: this._id });
});

courseShema.pre(/^find/, function () {
  this.select('-__v').populate({ path: 'instructor', select: '-role -email' });
});

const Course = mongoose.model('Course', courseShema);

export default Course;
