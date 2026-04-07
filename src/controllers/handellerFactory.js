import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import { ApiFeature } from '../utils/apiFeature.js';

export const createOne = Model => {
  return catchAsync(async (req, res, _next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ status: 'success', data: { data: doc } });
  });
};

export const getOne = (Model, popOption) => {
  return catchAsync(async (req, res, next) => {
    let query = await Model.findById(req.params.id);
    if (popOption) query = query.populate(popOption);
    const doc = await query;
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc: doc,
      },
    });
  });
};

export const getAll = Model => {
  return catchAsync(async (req, res, _next) => {
    const feature = new ApiFeature(Model.find(), req.query);
    await feature.filter();
    feature.sort().fields().pagination();
    const doc = await feature.query;

    res.status(200).json({ status: 'success', results: doc.length, data: { doc: doc } });
  });
};

export const updateOne = Model => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc: doc,
      },
    });
  });
};

export const deleteOne = Model => {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(204).json({ status: 'Success', data: { tour: null } });
  });
};
