import mongoose from 'mongoose';
import validator from 'validator';

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
    enum: ['user', 'guide', 'lead guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'please provide password!'],
    minlength: 8,
    select: false,
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
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const User = mongoose.model('User', userSchema);
export default User;
