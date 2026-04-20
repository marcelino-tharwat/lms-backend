import mongoose from 'mongoose';
import Course from './courseModel.js';

const lessonShema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A lesson must have a title'],
    unique: true,
    trim: true,
    maxlength: [80, 'A lesson name must have less or equal then 80 characters'],
    minlength: [3, 'A lesson name must have more or equal then 3 characters'],
  },
  description: {
    type: String,
    trim: true,
  },
  videoURL: {
    type: String,
    required: [true, 'A lesson must have a videoURL'],
    trim: true,
  },

  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'Lesson must belong to a course'],
  },
});

lessonShema.statics.calcLessonsCount = async function (courseId) {
  const stats = await this.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: '$course',
        nRating: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      lessonsCount: stats[0].nRating,
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      lessonsCount: 0,
    });
  }
};

lessonShema.post('save', function () {
  this.constructor.calcLessonsCount(this.course);
});

// Befor DB
lessonShema.pre(/^findOneAnd/, async function () {
  // get review by id before arrive DB
  this.r = await this.findOne();
});

lessonShema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calcLessonsCount(this.r.course);
  }
});

lessonShema.post('deleteOne', { document: true, query: false }, async function () {
  await this.constructor.calcLessonsCount(this.course);
});

const Lesson = mongoose.model('Lesson', lessonShema);
export default Lesson;
