import mongoose from 'mongoose';

const lessonProgressSchema = new mongoose.Schema(
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

    lesson: {
      type: mongoose.Schema.ObjectId,
      ref: 'Lesson',
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: Date,
  },
  { timestamps: true }
);

lessonProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });

lessonProgressSchema.pre(/^find/, function () {
  this.select('-__v');
});
export default mongoose.model('LessonProgress', lessonProgressSchema);
