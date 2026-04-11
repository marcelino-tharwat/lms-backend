import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const refreshToken = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

refreshToken.pre('save', async function () {
  if (!this.isModified('token')) return;
  this.token = await bcrypt.hash(this.token, 12);
});

refreshToken.methods.compareToken = async function (reqToken) {
  return await bcrypt.compare(reqToken, this.token);
};
const RefreshToken = mongoose.model('RefreshToken', refreshToken);
export default RefreshToken;
