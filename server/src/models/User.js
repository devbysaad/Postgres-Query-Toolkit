import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    roles: { type: [String], default: ['user'] },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationExpires: { type: Date },
    resetOTP: { type: String },
    resetOTPExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const User = mongoose.model('User', UserSchema);
export default User;
