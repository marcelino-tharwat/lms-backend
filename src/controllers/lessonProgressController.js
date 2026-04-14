import lessonProgress from '../models/lessonProgressModel.js';
import * as handellerFactory from './handellerFactory.js';

export const createLessonProgres = handellerFactory.createOne(lessonProgress);
export const getLessonProgres = handellerFactory.getOne(lessonProgress);
export const updateLessonProgres = handellerFactory.updateOne(lessonProgress);
export const deleteLessonProgres = handellerFactory.deleteOne(lessonProgress);
export const getAllLessonProgres = handellerFactory.getAll(lessonProgress);
