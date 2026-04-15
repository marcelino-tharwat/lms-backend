import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController.js';
import {
  createLessonProgres,
  setProgressDataToBody,
  getProgressCourse,
  getAllStudentEnrolledInCourse,
  getInstructorDashboard,
} from '../controllers/lessonProgressController.js';
import { checkExistingLesson, checkStudentEnrolled } from '../middleware/checkExistingLesson.js';
import { checkInstructorOwnsCourse } from '../middleware/checkInstructorOwnsCourse.js';
import { idParamValidator } from '../validators/idParamValidator.js';

const lessonProgress = Router();

lessonProgress
  .route('/:lessonId/complete')
  .post(
    protect,
    idParamValidator('lessonId'),
    checkExistingLesson,
    checkStudentEnrolled,
    setProgressDataToBody,
    createLessonProgres
  );

lessonProgress
  .route('/course/:courseId')
  .get(protect, idParamValidator('courseId'), getProgressCourse);

lessonProgress
  .route('/course/:courseId/students')
  .get(
    protect,
    restrictTo('instructor', 'admin'),
    idParamValidator('courseId'),
    checkInstructorOwnsCourse,
    getAllStudentEnrolledInCourse
  );

lessonProgress
  .route('/instructor/dashboard')
  .get(protect, restrictTo('instructor', 'admin'), getInstructorDashboard);

export default lessonProgress;
