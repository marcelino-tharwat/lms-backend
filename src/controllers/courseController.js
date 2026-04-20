import Course from '../models/courseModel.js';
import * as handellerFactory from '../controllers/handellerFactory.js';
import catchAsync from '../utils/catchAsync.js';
// import ApiFeature from '../utils/apiFeature.js';

// export const filterCourseBody = (req, res, next) => {
//   const allowedFields = [
//     'title',
//     'description',
//     'price',
//     'category',
//     'level',
//     'imageCover',
//     'duration',
//     'instructor',
//   ];

//   const filteredBody = {};

//   Object.keys(req.body).forEach(el => {
//     if (allowedFields.includes(el)) {
//       filteredBody[el] = req.body[el];
//     }
//   });

//   req.body = filteredBody;
//   next();
// };

export const filterCourseBody = (req, res, next) => {
  const allowedFields = [
    'title',
    'description',
    'price',
    'category',
    'level',
    'duration',
    'instructor',
  ];

  const filteredBody = {};

  Object.keys(req.body).forEach(el => {
    // ❌ امنع imageCover من body
    if (allowedFields.includes(el) && el !== 'imageCover') {
      filteredBody[el] = req.body[el];
    }
  });

  // ✅ الصورة تيجي بس من multer
  if (req.file) {
    filteredBody.imageCover = req.file.filename;
  }

  req.body = filteredBody;
  next();
};

export const getAllcourses = handellerFactory.getAll(Course);
export const getCourse = handellerFactory.getOne(Course, { path: 'lessons reviews' });
export const createCourse = catchAsync(async (req, res, _next) => {
  if (req.file) {
    req.body.imageCover = req.file.filename;
  }
  console.log('Body: ', req.body);
  console.log('File: ', req.file);
  const doc = await Course.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { data: doc },
  });
});
export const updateCourse = handellerFactory.updateOne(Course);
export const deleteCourse = handellerFactory.deleteOne(Course);
