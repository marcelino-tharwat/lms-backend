import JWT from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import { promisify } from 'util';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import RefreshToken from '../models/refreshTokenModel.js';

const signAccessToken = id => {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signRefreshToken = id => {
  return JWT.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
};

const creatSendToken = (user, res, status) => {
  const token = signAccessToken(user._id);

  const cookieExpiresIn = Number(process.env.JWT_COOKIE_EXPIRES_IN);
  const options = {
    expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') options.secure = true;
  user.password = undefined;
  user.active = undefined;

  // res.cookie('refreshToken', token, options);

  res.status(status).json({ status: 'success', token: token, data: user });
};

export const signup = catchAsync(async (req, res, _next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.file ? req.file.filename : '',
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
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    token: accessToken,
    data: user,
  });
});

export const refresh = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return next(new AppError('Refresh token required', 400));

  let payload;
  try {
    payload = JWT.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    return next(new AppError('Invalid or expired refresh token', 401));
  }

  const userTokens = await RefreshToken.find({ user: payload.id });

  const comparosons = await Promise.all(userTokens.map(t => t.compareToken(refreshToken)));
  const matchToken = comparosons.findIndex(match => match === true);

  if (matchToken === -1) return next(new AppError('Refresh Token not found', 401));

  const user = await User.findById(payload.id);
  if (!user) return next(new AppError('User no longer exists', 401));

  const accessToken = signAccessToken(user._id);
  const createdRefreshToken = signRefreshToken(user._id);

  await RefreshToken.findByIdAndDelete(userTokens[matchToken]._id);

  await RefreshToken.create({
    token: createdRefreshToken,
    user: user._id,
    expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie('refreshToken', createdRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 'success',
    token: accessToken,
  });
});

export const logout = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return next(new AppError('Refresh token required', 400));

  let payload;
  try {
    payload = JWT.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    return next(new AppError('Invalid or expired refresh token', 401));
  }

  const userTokens = await RefreshToken.find({ user: payload.id });

  const comparosons = await Promise.all(userTokens.map(t => t.compareToken(refreshToken)));
  const matchToken = comparosons.findIndex(match => match === true);

  if (matchToken === -1) return next(new AppError('Refresh Token not found', 401));

  await RefreshToken.findByIdAndDelete(userTokens[matchToken]._id);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
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

// @desc    Forgot password
// @route   POST /api/user/forgotPassword
// @access  Public
export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(`There is no user with that email ${req.body.email}`, 404));
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto.createHash('sha256').update(resetCode).digest('hex');

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save({ validateBeforeSave: false });

  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your LMS Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The LMS Team`;
  try {
    const html = `
<div style="background-color: #f3f2ef; padding: 20px; font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Fira Sans', Ubuntu, Oxygen, 'Oxygen Sans', Cantarell, 'Droid Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Lucida Grande', Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
        <div style="padding: 24px;">
            <h2 style="color: #000000; font-size: 24px; font-weight: 600; margin-bottom: 16px;">LMS Account</h2>
            <p style="font-size: 16px; color: rgba(0,0,0,0.9); line-height: 1.5;">Hi ${user.name},</p>
            <p style="font-size: 16px; color: rgba(0,0,0,0.9); line-height: 1.5;">We received a request to reset the password on your account. Use the code below to complete the process:</p>
            
            <div style="text-align: center; margin: 32px 0;">
                <div style="display: inline-block; background-color: #f8faff; border: 1px dashed #0a66c2; padding: 16px 32px; border-radius: 4px;">
                    <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0a66c2;">${resetCode}</span>
                </div>
                <p style="font-size: 14px; color: rgba(0,0,0,0.6); margin-top: 12px;">This code is valid for 10 minutes.</p>
            </div>

            <p style="font-size: 16px; color: rgba(0,0,0,0.9); line-height: 1.5;">If you didn't request this, you can safely ignore this email.</p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
            
            <p style="font-size: 14px; color: rgba(0,0,0,0.6);">Thanks for helping us keep your account secure.<br><strong>The LMS Team</strong></p>
        </div>
    </div>
    <div style="text-align: center; padding: 16px; font-size: 12px; color: rgba(0,0,0,0.6);">
        © 2026 LMS App, Assiut, Egypt.
    </div>
</div>
`;

    await sendEmail({
      email: user.email,
      subject: 'Your password reset code (valid for 10 min)',
      message,
      html,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save({ validateBeforeSave: false });
    // 'There is an error in sending email'
    return next(new AppError(err, 500));
  }

  res.status(200).json({ status: 'Success', message: 'Reset code sent to email' });
});

// @desc    Verify password reset code
// @route   POST /api/user/verifyResetCode
// @access  Public
export const verifyPassResetCode = catchAsync(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto.createHash('sha256').update(req.body.resetCode).digest('hex');

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Reset code invalid or expired'));
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'Success',
  });
});

// @desc    Reset password
// @route   POST /api/user/resetPassword
// @access  Public
export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(`There is no user with email ${req.body.email}`, 404));
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new AppError('Reset code not verified', 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save({ validateBeforeSave: false });

  // 3) if everything is ok, generate token
  creatSendToken(user._id, res, 200);
});
