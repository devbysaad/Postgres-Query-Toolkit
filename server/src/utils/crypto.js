import crypto from 'crypto';

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function randomOTP(length = 6) {
  let s = '';
  for (let i = 0; i < length; i++) s += Math.floor(Math.random() * 10).toString();
  return s;
}