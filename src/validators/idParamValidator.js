import { param } from 'express-validator';
import validatorMiddleware from '../middleware/validatorMiddleware.js';

export const idParamValidator = [
  param('id').notEmpty().withMessage('missing param').isMongoId().withMessage('Invalid ID format'),
  validatorMiddleware,
];
