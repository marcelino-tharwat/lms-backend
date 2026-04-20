import Course from '../models/courseModel.js';
import AppError from '../utils/appError.js';

export const checkInstructorOwnsCourse = async (req, res, next) => {
  const id = req.params.courseId || req.params.id;
  console.log(id);
  const course = await Course.findById(id);
  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  if (course.instructor._id.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized', 403));
  }

  req.course = course;
  next();
};
