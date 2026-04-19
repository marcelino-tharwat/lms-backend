import { Router } from 'express';
import {
  getAllReivew,
  getReivew,
  createReivew,
  updateReivew,
  deleteReivew,
  setUserCourseId,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import { checkReviewOwner } from '../middleware/checkReviewOwner.js';
import { checkDuplicateReview } from '../middleware/checkDuplicateReview.js';

const reivewRouter = Router({ mergeParams: true });

reivewRouter
  .route('/')
  .get(getAllReivew)
  .post(protect, restrictTo('user'), setUserCourseId, createReivew);

reivewRouter
  .route('/:id')
  .get(getReivew)
  .patch(protect, restrictTo('user'), checkReviewOwner, checkDuplicateReview, updateReivew)
  .delete(protect, restrictTo('user', 'admin'), checkReviewOwner, deleteReivew);

export default reivewRouter;
