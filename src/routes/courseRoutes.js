import express from 'express';
import * as courseController from './../controllers/courseController.js';
import * as authController from './../controllers/authController.js';
import { createCourseValidator, updateCourseValidator } from '../validators/courseValidator.js';
import { idParamValidator } from '../validators/idParamValidator.js';
import reivewRouter from './reviewRoutes.js';
import { checkInstructorOwnsCourse } from '../middleware/checkInstructorOwnsCourse.js';
import { uploadCourseImage } from '../middleware/uploadCoverCourse.js';
const courseRouter = express.Router();

courseRouter.use('/:courseId/review', reivewRouter);

courseRouter
  .route('/')
  .get(courseController.getAllcourses)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'instructor'),
    uploadCourseImage,
    createCourseValidator,
    courseController.createCourse
  );

courseRouter
  .route('/:id')
  .get(courseController.getCourse)
  .patch(
    authController.protect,
    authController.restrictTo('instructor'),
    idParamValidator(),
    checkInstructorOwnsCourse,
    updateCourseValidator,
    courseController.filterCourseBody,
    courseController.updateCourse
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'instructor'),
    ...idParamValidator(),
    checkInstructorOwnsCourse,
    courseController.deleteCourse
  );

export default courseRouter;
