import User from '../models/userModel.js';
import * as handellerFactory from './handellerFactory.js';

export const createUser = handellerFactory.createOne(User);
export const getUser = handellerFactory.getOne(User);
export const updateUser = handellerFactory.updateOne(User);
export const deleteUser = handellerFactory.deleteOne(User);
export const getAllUser = handellerFactory.getAll(User);
