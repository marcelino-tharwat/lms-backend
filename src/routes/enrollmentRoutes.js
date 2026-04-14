import { Router } from 'express';
import { checkExistingEnrollment } from '../middleware/checkExistingEnrollment.js';
import { checkInstructorOwnsCourse } from '../middleware/checkInstructorOwnsCourse.js';
import { protect, restrictTo } from '../controllers/authController.js';
import {
  createEnrollment,
  getEnrollment,
  deleteEnrollment,
  updateEnrollment,
  getMyEnrollments,
  getStudentsByCourse,
  setUserToBody,
} from '../controllers/enrollmentController.js';

const enrollmentRouter = Router();

enrollmentRouter.use(protect);
enrollmentRouter.route('/my-courses').get(getMyEnrollments);

enrollmentRouter.get(
  '/course/:courseId/students',
  protect,
  restrictTo('instructor', 'admin'),
  checkInstructorOwnsCourse,
  getStudentsByCourse
);

enrollmentRouter.route('/').post(setUserToBody, checkExistingEnrollment, createEnrollment);

enrollmentRouter.route('/:id').get(getEnrollment).patch(updateEnrollment).delete(deleteEnrollment);

export default enrollmentRouter;
