import { body } from 'express-validator';
import validatorMiddleware from '../middleware/validatorMiddleware.js';
import mongoose from 'mongoose';

export const createCourseValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('A course must have a title')
    .isLength({ min: 10, max: 50 })
    .withMessage('Course title must be between 10 and 50 characters')
    .escape(),

  body('description').optional().trim().escape(),

  body('level')
    .notEmpty()
    .withMessage('A course must have a level')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be: beginner, intermediate, or advanced'),

  body('price')
    .notEmpty()
    .withMessage('A course must have a price')
    .isNumeric()
    .withMessage('Price must be a number'),

  body('category')
    .notEmpty()
    .withMessage('Course must belong to a category')
    .isMongoId()
    .withMessage('Invalid Category ID format')
    .custom(async categoryId => {
      const category = await mongoose.model('Category').findById(categoryId);
      if (!category) throw new Error(`No category found with ID: ${categoryId}`);
      return true;
    }),
  body('duration')
    .optional()
    .matches(/^[0-9]+(\.[0-9]{1,2})? (hours|days|weeks)$/)
    .withMessage('Duration must be in format: "10 hours", "2.5 days", etc.'),

  body('imageCover').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('A course must have a cover image');
    }
    return true; // كدا هو اتأكد إن فيه ملف اترفع فعلاً
  }),
  validatorMiddleware,
];

export const updateCourseValidator = [
  body('title').optional().trim().isLength({ min: 10, max: 50 }).escape(),
  body('category').optional().isMongoId().withMessage('Invalid Category ID format'),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
  body('price').optional().isNumeric(),
  validatorMiddleware,
];
