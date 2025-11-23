import { verifyAccess } from '../utils/jwt.js';

export const requireAuth = (req, res, next) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    const payload = verifyAccess(token);
    req.user = { id: payload.sub, email: payload.email, roles: payload.roles || ['user'] };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const requireRole = (role) => (req, res, next) => {
  const roles = req.user?.roles || [];
  if (!roles.includes(role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};