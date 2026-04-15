import Lesson from '../models/lessonModel.js';
import Enrollment from '../models/enrollmentModel.js';
import AppError from '../utils/appError.js';

export const checkExistingLesson = async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.lessonId);
  if (!lesson) {
    return next(new AppError('Lesson not found', 404));
  }
  req.lesson = lesson;
  req.course = lesson.course;
  next();
};

export const checkStudentEnrolled = async (req, res, next) => {
  const existing = await Enrollment.findOne({
    user: req.user._id,
    course: req.course,
  });
  if (!existing) {
    return next(new AppError("You don't enrolled in this course", 400));
  }

  next();
};
