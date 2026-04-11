import mongoose from 'mongoose';

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
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Course must belong to a category'],
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
  this.select('-__v').populate({ path: 'category', select: '-__v -_id' });
});

const Course = mongoose.model('Course', courseShema);

export default Course;
