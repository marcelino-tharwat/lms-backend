import LessonProgress from '../models/lessonProgressModel.js';
import Course from '../models/courseModel.js';
import Enrollment from '../models/enrollmentModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as handellerFactory from './handellerFactory.js';
import AppError from '../utils/appError.js';
import mongoose from 'mongoose';

export const setProgressDataToBody = (req, res, next) => {
  req.body.user = req.user._id;
  req.body.lesson = req.lesson._id;
  req.body.course = req.course;

  next();
};

export const getProgressCourse = catchAsync(async (req, res, next) => {
  const completedLessons = await LessonProgress.find({
    user: req.user._id,
    course: req.params.courseId,
    completed: true,
  });

  const completedLessonIds = completedLessons.map(LId => LId._id);

  const course = await Course.findById(req.params.courseId);
  if (!course) next(new AppError('Not found Course', 404));

  const totalLessons = course.lessonsCount;

  const progressPercentage =
    totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);

  console.log(completedLessons);

  res.status(200).json({
    courseId: req.params.course,
    completedLessons: completedLessons.length,
    totalLessons,
    progressPercentage,
    completedLessonIds,
  });
});

export const getAllStudentEnrolledInCourse = catchAsync(async (req, res, _next) => {
  const totalLessons = req.course.lessonsCount;

  const studentsProgress = await Enrollment.aggregate([
    {
      $match: {
        course: new mongoose.Types.ObjectId(req.params.courseId),
      },
    },

    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'student',
      },
    },

    {
      $unwind: '$student',
    },

    {
      $lookup: {
        from: 'lessonprogresses',
        let: {
          studentId: '$user',
          courseId: '$course',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user', '$$studentId'] },
                  { $eq: ['$course', '$$courseId'] },
                  { $eq: ['$completed', true] },
                ],
              },
            },
          },
        ],
        as: 'progressRecords',
      },
    },

    {
      $addFields: {
        completedLessons: { $size: '$progressRecords' },
        totalLessons,
      },
    },

    {
      $addFields: {
        progressPercentage: {
          $cond: [
            { $eq: [totalLessons, 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: ['$completedLessons', totalLessons],
                    },
                    100,
                  ],
                },
                0,
              ],
            },
          ],
        },
      },
    },

    {
      $project: {
        student: {
          _id: '$student._id',
          name: '$student.name',
          email: '$student.email',
          photo: '$student.photo',
        },
        completedLessons: 1,
        totalLessons: 1,
        progressPercentage: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: studentsProgress.length,
    data: studentsProgress,
  });
});

export const getInstructorDashboard = async (req, res, _next) => {
  const dashboard = await Course.aggregate([
    {
      $match: {
        instructor: req.user._id,
      },
    },

    {
      $lookup: {
        from: 'enrollments',
        localField: '_id',
        foreignField: 'course',
        as: 'enrollments',
      },
    },

    {
      $lookup: {
        from: 'lessonprogresses',
        localField: '_id',
        foreignField: 'course',
        as: 'progressRecords',
      },
    },

    {
      $addFields: {
        studentsCount: { $size: '$enrollments' },

        completedProgressCount: {
          $size: {
            $filter: {
              input: '$progressRecords',
              as: 'progress',
              cond: { $eq: ['$$progress.completed', true] },
            },
          },
        },
      },
    },

    {
      $addFields: {
        averageProgress: {
          $cond: [
            {
              $or: [{ $eq: ['$studentsCount', 0] }, { $eq: ['$lessonsCount', 0] }],
            },
            0,
            {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        '$completedProgressCount',
                        {
                          $multiply: ['$studentsCount', '$lessonsCount'],
                        },
                      ],
                    },
                    100,
                  ],
                },
                0,
              ],
            },
          ],
        },
      },
    },

    {
      $project: {
        title: 1,
        lessonsCount: 1,
        studentsCount: 1,
        averageProgress: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: dashboard,
  });
};

export const createLessonProgres = handellerFactory.createOne(LessonProgress);
export const getLessonProgres = handellerFactory.getOne(LessonProgress);
export const updateLessonProgres = handellerFactory.updateOne(LessonProgress);
export const deleteLessonProgres = handellerFactory.deleteOne(LessonProgress);
export const getAllLessonProgres = handellerFactory.getAll(LessonProgress);
