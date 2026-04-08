import express from 'express';
import * as courseController from './../controllers/courseController.js';
import * as authController from './../controllers/authController.js';
import { createCourseValidator, updateCourseValidator } from '../validators/courseValidator.js';
import { idParamValidator } from '../validators/idParamValidator.js';

const courseRouter = express.Router();

courseRouter
  .route('/')
  .get(courseController.getAllcourses)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'instructor'),
    createCourseValidator,
    courseController.createCourse
  );

courseRouter
  .route('/:id')
  .get(idParamValidator, courseController.getCourse)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'instructor'),
    idParamValidator,
    updateCourseValidator,
    courseController.filterCourseBody,
    courseController.updateCourse
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'instructor'),
    idParamValidator,
    courseController.deleteCourse
  );

export default courseRouter;
