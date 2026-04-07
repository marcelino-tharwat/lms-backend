import express from 'express';
import * as userController from '../controllers/lessonController.js';

const userRouter = express.Router();

userRouter.route('/').get(userController.getAllLesson).post(userController.createLesson);

userRouter
  .route('/:id')
  .get(userController.getLesson)
  .patch(userController.updateLesson)
  .delete(userController.deleteLesson);

export default userRouter;
