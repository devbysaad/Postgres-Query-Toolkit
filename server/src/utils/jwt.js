import jwt from 'jsonwebtoken';

export function signAccessToken(payload) {
  const secret = process.env.JWT_ACCESS_SECRET || 'access_dev_secret';
  const expiresIn = process.env.JWT_ACCESS_EXPIRES || '15m';
  return jwt.sign(payload, secret, { expiresIn });
}

export function signRefreshToken(payload) {
  const secret = process.env.JWT_REFRESH_SECRET || 'refresh_dev_secret';
  const expiresIn = process.env.JWT_REFRESH_EXPIRES || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyAccess(token) {
  const secret = process.env.JWT_ACCESS_SECRET || 'access_dev_secret';
  return jwt.verify(token, secret);
}

export function verifyRefresh(token) {
  const secret = process.env.JWT_REFRESH_SECRET || 'refresh_dev_secret';
  return jwt.verify(token, secret);
}