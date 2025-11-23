import User from '../models/User.js';
import { registerUser, validateLogin, issueTokens, verifyRefreshToken, rotateRefreshToken, revokeRefreshToken, setVerificationToken, verifyEmailToken, setResetOTP, resetPasswordWithOTP } from '../services/authService.js';

function sendRefreshCookie(res, token) {
  if (process.env.REFRESH_TOKEN_IN_COOKIE === 'true') {
    const secure = process.env.COOKIE_SECURE === 'true';
    res.cookie('refresh_token', token, { httpOnly: true, secure, sameSite: 'lax', path: '/api/auth', maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
}

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await registerUser({ email, password });
    const tokens = await issueTokens(user, { userAgent: req.headers['user-agent'], ip: req.ip });
    sendRefreshCookie(res, tokens.refreshToken);
    res.status(201).json({ user: { id: user._id, email: user.email, roles: user.roles, isVerified: user.isVerified }, tokens: { accessToken: tokens.accessToken } });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await validateLogin({ email, password });
    const tokens = await issueTokens(user, { userAgent: req.headers['user-agent'], ip: req.ip });
    sendRefreshCookie(res, tokens.refreshToken);
    res.json({ user: { id: user._id, email: user.email, roles: user.roles, isVerified: user.isVerified }, tokens: { accessToken: tokens.accessToken } });
  } catch (e) { next(e); }
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user: { id: user._id, email: user.email, roles: user.roles, isVerified: user.isVerified } });
};

export const refresh = async (req, res, next) => {
  try {
    const raw = req.cookies?.refresh_token || req.body?.refreshToken;
    if (!raw) return res.status(400).json({ message: 'Refresh token required' });
    const user = await verifyRefreshToken(raw);
    const rotated = await rotateRefreshToken(raw, user, { userAgent: req.headers['user-agent'], ip: req.ip });
    sendRefreshCookie(res, rotated.refreshToken);
    res.json({ tokens: { accessToken: rotated.accessToken } });
  } catch (e) { next(e); }
};

export const logout = async (req, res, next) => {
  try {
    const raw = req.cookies?.refresh_token || req.body?.refreshToken;
    if (raw) await revokeRefreshToken(raw);
    res.clearCookie('refresh_token');
    res.json({ message: 'Logged out' });
  } catch (e) { next(e); }
};

export const verifyRequest = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { token } = await setVerificationToken(user);
    res.json({ token });
  } catch (e) { next(e); }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token required' });
    const user = await verifyEmailToken(token);
    res.json({ user: { id: user._id, email: user.email, isVerified: user.isVerified } });
  } catch (e) { next(e); }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { otp } = await setResetOTP(user);
    res.json({ otp });
  } catch (e) { next(e); }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    await resetPasswordWithOTP({ email, otp, newPassword });
    res.json({ message: 'Password reset' });
  } catch (e) { next(e); }
};

export const setRole = async (req, res, next) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) return res.status(400).json({ message: 'Email and role required' });
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.roles.includes(role)) user.roles.push(role);
    await user.save();
    res.json({ user: { id: user._id, email: user.email, roles: user.roles } });
  } catch (e) { next(e); }
};