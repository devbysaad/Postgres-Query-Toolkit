import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tokenHash: { type: String, required: true, index: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date },
    userAgent: { type: String },
    ipAddress: { type: String },
  },
  { versionKey: false }
);

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);
export default RefreshToken;