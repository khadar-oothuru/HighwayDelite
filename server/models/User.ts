import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  // password: { type: String }, // removed password for OTP-only auth
  otp: { type: String }, // for OTP flow
  otpExpires: { type: Date },
  name: { type: String },
  dateOfBirth: { type: String }, // store as string for simplicity (e.g., '11 December 1997')
  avatar: { type: String },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
