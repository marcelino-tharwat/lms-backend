import Course from '../models/courseModel.js';
import AppError from '../utils/appError.js';

export const checkInstructorOwnsCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new AppError('Course not found', 404));
  }
  console.log(course);
  if (course.instructor.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized', 403));
  }

  next();
};
