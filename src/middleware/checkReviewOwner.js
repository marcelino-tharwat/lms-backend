import Review from '../models/reviewModel.js';
import AppError from '../utils/appError.js';

export const checkReviewOwner = async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (review.user.toString() !== req.user._id.toString()) {
    return next(new AppError('Not allowed', 403));
  }

  next();
};
