import Category from '../models/categoryModel.js';
import * as handellerFactory from '../controllers/handellerFactory.js';

export const createCategory = handellerFactory.createOne(Category);
export const getCategory = handellerFactory.getOne(Category);
export const getAllCategory = handellerFactory.getAll(Category);
export const updateCategory = handellerFactory.updateOne(Category);
export const deleteCategory = handellerFactory.deleteOne(Category);
