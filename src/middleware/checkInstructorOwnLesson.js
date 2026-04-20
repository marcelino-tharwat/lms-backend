import Course from '../models/courseModel.js';
import Lesson from '../models/lessonModel.js';
import AppError from '../utils/appError.js';

export const checkInstructorOwnsLesson = async (req, res, next) => {
  const id = req.params.lessonId || req.params.id;

  const lesson = await Lesson.findById(id);

  if (!lesson) {
    return next(new AppError('lesson not found', 404));
  }
  const course = await Course.findById(lesson.course);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  if (course.instructor._id.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized', 403));
  }

  req.lesson = lesson;
  next();
};
