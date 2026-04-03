import express from 'express';
import * as courseController from './../controllers/courseController.js';
const courseRouter = express.Router();

courseRouter.route('/').get(courseController.getAllcourses).post();

courseRouter.route('/:id').get().patch().delete();

export default courseRouter;
