import { param } from 'express-validator';
import validatorMiddleware from '../middleware/validatorMiddleware.js';

export const idParamValidator = (paramName = 'id') => [
  param(paramName)
    .notEmpty()
    .withMessage(`missing ${paramName} param`)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`),
  validatorMiddleware,
];
