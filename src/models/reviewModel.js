import mongoose from 'mongoose';
import Course from './courseModel.js';
const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: [true],
    },
    review: {
      type: String,
      required: [true, 'Review can not be embty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
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

reviewSchema.index({ user: 1, course: 1 }, { unique: true });

reviewSchema.pre(/^find/, function () {
  this.populate({ path: 'user', select: 'name photo' });
});

reviewSchema.pre(/^find/, function () {
  this.select('-__v');
});

reviewSchema.statics.calcAvrageRating = async function (courseId) {
  const stats = await this.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: '$course',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      ratingsQuantity: 0,
      ratingsAverage: 0,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAvrageRating(this.course);
});

// Befor DB
reviewSchema.pre(/^findOneAnd/, async function () {
  // get review by id before arrive DB
  // this.r = await this.findOne();
  this.r = await this.model.findOne(this.getQuery());
});

reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calcAvrageRating(this.r.course);
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
