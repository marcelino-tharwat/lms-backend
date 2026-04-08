import { body } from 'express-validator';
import mongoose from 'mongoose';
import validatorMiddleware from '../middleware/validatorMiddleware.js';

export const createLessonValidator = [
  body('title')
    .notEmpty()
    .withMessage('Lesson title is required')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Title must be between 3 and 20 characters')
    .escape(),

  body('description').optional().trim().escape(),

  body('videoURL')
    .notEmpty()
    .withMessage('Video URL is required')
    .isURL()
    .withMessage('Please provide a valid URL (e.g., YouTube or Drive link)'),

  body('course')
    .notEmpty()
    .withMessage('Lesson must belong to a course')
    .isMongoId()
    .withMessage('Invalid Course ID format')
    .custom(async courseId => {
      const course = await mongoose.model('Course').findById(courseId);

      if (!course) {
        throw new Error(`No course found with ID: ${courseId}`);
      }

      return true;
    }),
  validatorMiddleware,
];

export const updateLessonValidator = [
  body('title').optional().trim().isLength({ min: 3, max: 20 }).escape(),
  body('videoURL').optional().isURL().withMessage('Invalid URL format'),
  body('course').optional().isMongoId().withMessage('Invalid Course ID format'),
  validatorMiddleware,
];
