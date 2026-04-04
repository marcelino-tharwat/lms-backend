import express from 'express';
import * as courseController from './../controllers/courseController.js';
const courseRouter = express.Router();

courseRouter.route('/').get(courseController.getAllcourses).post(courseController.createCourse);

courseRouter
  .route('/:id')
  .get(courseController.getCourse)
  .patch(courseController.filterCourseBody, courseController.updateCourse)
  .delete(courseController.deleteCourse);

export default courseRouter;
