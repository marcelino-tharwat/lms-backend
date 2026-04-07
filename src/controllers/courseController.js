import Course from '../models/courseModel.js';
import * as handellerFactory from '../controllers/handellerFactory.js';

export const filterCourseBody = (req, res, next) => {
  const allowedFields = [
    'title',
    'description',
    'price',
    'category',
    'level',
    'imageCover',
    'duration',
  ];

  const filteredBody = {};

  Object.keys(req.body).forEach(el => {
    if (allowedFields.includes(el)) {
      filteredBody[el] = req.body[el];
    }
  });

  req.body = filteredBody;
  next();
};

export const getAllcourses = handellerFactory.getAll(Course);
export const getCourse = handellerFactory.getOne(Course, { path: 'lessons' });
export const createCourse = handellerFactory.createOne(Course);
export const updateCourse = handellerFactory.updateOne(Course);
export const deleteCourse = handellerFactory.deleteOne(Course);
