import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
const categoryRouter = express.Router();

categoryRouter
  .route('/')
  .get(categoryController.getAllCategory)
  .post(categoryController.createCategory);

categoryRouter
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

export default categoryRouter;
