import express from 'express';
import * as lessonController from '../controllers/lessonController.js';

const lessonRouter = express.Router();

lessonRouter.route('/').get(lessonController.getAllLesson).post(lessonController.createLesson);

lessonRouter
  .route('/:id')
  .get(lessonController.getLesson)
  .patch(lessonController.updateLesson)
  .delete(lessonController.deleteLesson);

export default lessonRouter;
