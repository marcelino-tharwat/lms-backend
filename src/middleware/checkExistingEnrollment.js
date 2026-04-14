import Enrollment from '../models/enrollmentModel.js';
import AppError from '../utils/appError.js';
export const checkExistingEnrollment = async (req, res, next) => {
  const existing = await Enrollment.findOne({
    user: req.user._id,
    course: req.body.course,
  });
  if (existing) {
    return next(new AppError('You already enrolled this course', 400));
  }

  next();
};
