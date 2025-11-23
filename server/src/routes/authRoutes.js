import { Router } from 'express';
import { register, login, refresh, logout, me, verifyRequest, verifyEmail, forgotPassword, resetPassword, setRole } from '../controllers/authController.js';
import { requireAuth, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.post('/verify-request', requireAuth, verifyRequest);
router.post('/verify', verifyEmail);
router.post('/forgot', forgotPassword);
router.post('/reset', resetPassword);

router.get('/admin/summary', requireAuth, requireRole('admin'), async (req, res) => {
  res.json({ status: 'ok', user: req.user });
});
router.post('/admin/role', requireAuth, requireRole('admin'), setRole);

export default router;
