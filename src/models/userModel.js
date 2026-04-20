import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
  name: { type: String, required: [true, 'please tell us your name!'] },
  email: {
    type: String,
    required: [true, 'please provide your email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: { type: String, default: '' },
  role: {
    type: String,
    enum: ['user', 'instructor', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'please provide password!'],
    minlength: 8,
    // select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password!'],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: 'password are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetCode: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre('save', function () {
  if (!this.isModified('password') || this.isNew) return;
  this.passwordChangedAt = Date.now() - 1000;
});

userSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});

// userSchema.pre(/^find/, function () {
//   this.select('-__v');
// });

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

    return JWTTimeStamp < changedTimeStamp;
  }
  // if user not changed password after init token
  return false;
};

const User = mongoose.model('User', userSchema);
export default User;
