import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import * as handellerFactory from './handellerFactory.js';

const filterBody = (objBody, ...allowedeProp) => {
  let newObj = {};
  Object.keys(objBody).forEach(prop => {
    if (allowedeProp.includes(prop)) newObj[prop] = objBody[prop];
  });
  return newObj;
};

export const getLoggedUser = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const updateMy = catchAsync(async (req, res, next) => {
  if (
    req.body.password ||
    req.body.passwordConfirm ||
    req.body.newPassword ||
    req.body.currentPassword
  ) {
    return next(new AppError('Not pass password ', 400));
  }

  // filter req body
  const filteredBody = filterBody(req.body, 'name', 'email');

  // if (req.file) filterBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

export const deleteMe = catchAsync(async (req, res, _next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({ status: 'success', data: null });
});

export const createUser = handellerFactory.createOne(User);
export const getUser = handellerFactory.getOne(User);
export const updateUser = handellerFactory.updateOne(User);
export const deleteUser = handellerFactory.deleteOne(User);
export const getAllUser = handellerFactory.getAll(User);
