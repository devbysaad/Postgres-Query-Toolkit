import bcrypt from 'bcrypt';
import RefreshToken from '../models/RefreshToken.js';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';
import { hashToken } from '../utils/crypto.js';

function refreshExpiryDays() {
  const days = parseInt(process.env.REFRESH_DAYS || '7', 10);
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export async function registerUser({ email, password }) {
  const e = email.trim().toLowerCase();
  const existing = await User.findOne({ email: e });
  if (existing) throw new Error('Email already registered');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email: e, passwordHash, isVerified: false });
  return user;
}

export async function validateLogin({ email, password }) {
  const e = email.trim().toLowerCase();
  const user = await User.findOne({ email: e });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');
  return user;
}

export async function issueTokens(user, context = {}) {
  const accessToken = signAccessToken({ sub: user._id.toString(), email: user.email, roles: user.roles });
  const refreshRaw = signRefreshToken({ sub: user._id.toString() });
  const refreshHash = hashToken(refreshRaw);
  const expiresAt = refreshExpiryDays();
  await RefreshToken.create({ userId: user._id, tokenHash: refreshHash, expiresAt, userAgent: context.userAgent || null, ipAddress: context.ip || null });
  return { accessToken, refreshToken: refreshRaw, expiresAt };
}

export async function rotateRefreshToken(raw, user, context = {}) {
  const hash = hashToken(raw);
  await RefreshToken.updateMany({ userId: user._id, tokenHash: hash }, { $set: { revokedAt: new Date() } });
  return issueTokens(user, context);
}

export async function verifyRefreshToken(raw) {
  const hash = hashToken(raw);
  const rt = await RefreshToken.findOne({ tokenHash: hash });
  if (!rt) throw new Error('Refresh token not found');
  if (rt.revokedAt) throw new Error('Refresh token revoked');
  if (rt.expiresAt < new Date()) throw new Error('Refresh token expired');
  const user = await User.findById(rt.userId);
  if (!user) throw new Error('User not found');
  return user;
}

export async function revokeRefreshToken(raw) {
  const hash = hashToken(raw);
  await RefreshToken.updateMany({ tokenHash: hash }, { $set: { revokedAt: new Date() } });
}

export async function setVerificationToken(user) {
  const token = (Math.random().toString(36).slice(2)) + (Math.random().toString(36).slice(2));
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  user.verificationToken = token;
  user.verificationExpires = expires;
  await user.save();
  return { token };
}

export async function verifyEmailToken(token) {
  const user = await User.findOne({ verificationToken: token });
  if (!user) throw new Error('Invalid token');
  if (user.verificationExpires && user.verificationExpires < new Date()) throw new Error('Token expired');
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpires = undefined;
  await user.save();
  return user;
}

export async function setResetOTP(user) {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + 10 * 60 * 1000);
  user.resetOTP = otp;
  user.resetOTPExpires = expires;
  await user.save();
  return { otp };
}

export async function resetPasswordWithOTP({ email, otp, newPassword }) {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) throw new Error('User not found');
  if (!user.resetOTP || !user.resetOTPExpires) throw new Error('No OTP set');
  if (user.resetOTP !== otp) throw new Error('Invalid OTP');
  if (user.resetOTPExpires < new Date()) throw new Error('OTP expired');
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetOTP = undefined;
  user.resetOTPExpires = undefined;
  await user.save();
  return user;
}