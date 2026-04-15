import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },

    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: true,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

enrollmentSchema.pre(/^find/, function () {
  this.select('-__v');
});

export default mongoose.model('Enrollment', enrollmentSchema);
