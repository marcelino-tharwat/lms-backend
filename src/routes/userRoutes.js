import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';
import {
  signupValidator,
  loginValidator,
  updateMeValidator,
  updatePasswordValidator,
} from '../validators/userValidator.js';
import { idParamValidator } from '../validators/idParamValidator.js';

const userRouter = express.Router();

userRouter.route('/signup').post(signupValidator, authController.signup);
userRouter.route('/login').post(loginValidator, authController.login);

userRouter.route('/forgotPassword').post(authController.forgotPassword);
userRouter.route('/verifyPassResetCode').post(authController.verifyPassResetCode);
userRouter.route('/resetPassword').post(authController.resetPassword);

userRouter.use(authController.protect);

userRouter.route('/updateMyPassword').patch(updatePasswordValidator, authController.updatePassword);

userRouter.route('/updateMy').patch(updateMeValidator, userController.updateMy);

userRouter.route('/deleteMe').delete(userController.deleteMe);

userRouter.use(authController.restrictTo('admin'));

userRouter.route('/').get(userController.getAllUser).post(userController.createUser);

userRouter
  .route('/:id')
  .get(idParamValidator, userController.getUser)
  .patch(idParamValidator, userController.updateUser)
  .delete(idParamValidator, userController.deleteUser);

export default userRouter;
