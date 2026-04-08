import express from 'express';
import * as lessonController from '../controllers/lessonController.js';
import * as authController from '../controllers/authController.js';
import { createLessonValidator, updateLessonValidator } from '../validators/lessonValidator.js';
import { idParamValidator } from '../validators/idParamValidator.js';

const lessonRouter = express.Router();

lessonRouter
  .route('/')
  .get(lessonController.getAllLesson)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'instructor'),
    createLessonValidator,
    lessonController.createLesson
  );

lessonRouter
  .route('/:id')
  .get(idParamValidator, lessonController.getLesson)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'instructor'),
    idParamValidator,
    updateLessonValidator,
    lessonController.updateLesson
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'instructor'),
    idParamValidator,
    lessonController.deleteLesson
  );

export default lessonRouter;
