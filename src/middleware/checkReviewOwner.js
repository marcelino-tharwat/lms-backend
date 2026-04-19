import Review from '../models/reviewModel.js';
import AppError from '../utils/appError.js';

export const checkReviewOwner = async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('Review not found', 404));
  }

  const reviewUserId = review.user._id.toString();
  const currentUserId = req.user.id;

  if (reviewUserId !== currentUserId) {
    return next(new AppError('Not allowed', 403));
  }

  req.review = review;
  next();
};
