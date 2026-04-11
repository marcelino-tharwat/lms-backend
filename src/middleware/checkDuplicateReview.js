import Review from '../models/reviewModel.js';
import AppError from '../utils/appError.js';

export const checkDuplicateReview = async (req, res, next) => {
  const existing = await Review.findOne({
    user: req.user._id,
    course: req.body.course,
  });

  if (existing) {
    return next(new AppError('You already reviewed this course', 400));
  }

  next();
};
