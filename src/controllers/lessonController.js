import Lesson from '../models/lessonModel.js';
import * as handellerFactory from './handellerFactory.js';

export const createLesson = handellerFactory.createOne(Lesson);
export const getLesson = handellerFactory.getOne(Lesson);
export const updateLesson = handellerFactory.updateOne(Lesson);
export const deleteLesson = handellerFactory.deleteOne(Lesson);
export const getAllLesson = handellerFactory.getAll(Lesson);
