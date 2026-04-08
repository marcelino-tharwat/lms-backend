import JWT from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import { promisify } from 'util';

const signToken = id => {
  return JWT.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const creatSendToken = (user, res, status) => {
  const token = signToken(user._id);

  const cookieExpiresIn = Number(process.env.JWT_COOKIE_EXPIRES_IN);
  const options = {
    expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') options.secure = true;
  user.password = undefined;
  user.active = undefined;

  res.cookie('token', token, options);

  res.status(status).json({ status: 'success', token: token, data: user });
};

export const signup = catchAsync(async (req, res, _next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  creatSendToken(newUser, res, 201);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Please provide email and password!', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect password or email', 401));
  }
  creatSendToken(user, res, 200);
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('you are not logged in! please log in to get access', 401));
  }

  // cehck token is verify
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  // check if user still exist
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist', 401));
  }

  // check if user change password
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! please log in again.', 401));
  }

  req.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

export const updatePassword = catchAsync(async (req, res, next) => {
  // find user
  const currentUser = await User.findById(req.user._id).select('+password');

  // if password correct
  const isCorrect = await currentUser.correctPassword(
    req.body.currentPassword,
    currentUser.password
  );

  if (!isCorrect) {
    return next(new AppError('Your current password is wrong', 401));
  }
  currentUser.password = req.body.newPassword;
  currentUser.passwordConfirm = req.body.newPasswordConfirm;
  await currentUser.save();

  creatSendToken(currentUser, res, 200);
});
