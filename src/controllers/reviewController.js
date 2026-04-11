import Review from '../models/reviewModel.js';
import * as handellerFactory from '../controllers/handellerFactory.js';

export const setUserCourseId = (req, res, next) => {
  if (!req.body.course) req.body.course = req.params.courseId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export const createReivew = handellerFactory.createOne(Review);
export const getReivew = handellerFactory.getOne(Review);
export const updateReivew = handellerFactory.updateOne(Review);
export const deleteReivew = handellerFactory.deleteOne(Review);
export const getAllReivew = handellerFactory.getAll(Review);
