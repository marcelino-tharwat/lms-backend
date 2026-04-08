import { body } from 'express-validator';
import validatorMiddleware from '../middleware/validatorMiddleware.js';
import User from '../models/userModel.js';

export const signupValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3 })
    .withMessage('Too short name')
    .escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .custom(async val => {
      const user = await User.findOne({ email: val });
      if (user) {
        throw new Error('E-mail already in use');
      }
      return true;
    }),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  body('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),

  validatorMiddleware,
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validatorMiddleware,
];

export const updateMeValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters')
    .escape(),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      if (user && user._id.toString() !== req.user.id) {
        throw new Error('E-mail already in use');
      }
      return true;
    }),
  validatorMiddleware,
];

export const updatePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Please provide your current password'),
  body('newPassword')
    .notEmpty()
    .withMessage('Please provide your new password')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters'),
  body('newPasswordConfirm')
    .notEmpty()
    .withMessage('Please confirm your new password')
    .custom((val, { req }) => {
      if (val !== req.body.newPassword) {
        throw new Error('Password confirmation does not match');
      }
      return true;
    }),
  validatorMiddleware,
];
