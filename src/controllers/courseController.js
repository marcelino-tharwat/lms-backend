import Course from '../models/courseModel.js';

export const getAllcourses = async (req, res) => {
  const course = await Course.find();
  res.status(200).json({ message: 'success', data: course });
};
