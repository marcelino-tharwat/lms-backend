import Enrollment from '../models/enrollmentModel.js';
import * as handellerFactory from '../controllers/handellerFactory.js';

export const setUserToBody = (req, res, next) => {
  req.body.user = req.user._id;
  next();
};

export const createEnrollment = handellerFactory.createOne(Enrollment);
export const getEnrollment = handellerFactory.getOne(Enrollment);
export const getAllEnrollment = handellerFactory.getAll(Enrollment);
export const updateEnrollment = handellerFactory.updateOne(Enrollment);
export const deleteEnrollment = handellerFactory.deleteOne(Enrollment);

export const getMyEnrollments = async (req, res) => {
  const enrollments = await Enrollment.find({
    user: req.user._id,
  }).populate('course');

  res.status(200).json({
    status: 'success',
    data: enrollments,
  });
};

export const getStudentsByCourse = async (req, res) => {
  const enrollments = await Enrollment.find({ course: req.params.courseId }).populate(
    'user',
    'name email photo'
  );

  res.status(200).json({
    status: 'success',
    results: enrollments.length,
    data: enrollments,
  });
};
