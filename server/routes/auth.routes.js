import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import * as auth from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Too many attempts. Please try again later.' } });
const passwordRules = body('password').isLength({ min: 8 }).matches(/[A-Z]/).matches(/[a-z]/).matches(/[0-9]/);

router.post('/register', authLimiter, body('fullName').trim().isLength({ min: 2, max: 100 }), body('email').isEmail().normalizeEmail(), passwordRules, body('terms').isBoolean(), auth.register);
router.post('/login', authLimiter, body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 1 }), auth.login);
router.post('/logout', requireAuth, auth.logout);
router.get('/me', requireAuth, auth.me);
router.post('/forgot-password', authLimiter, body('email').isEmail().normalizeEmail(), auth.forgotPassword);
router.post('/reset-password', authLimiter, body('token').isLength({ min: 20 }), passwordRules, auth.resetPassword);
router.post('/verify-email', authLimiter, body('token').isLength({ min: 20 }), auth.verifyEmail);
router.post('/resend-verification', authLimiter, requireAuth, auth.resendVerification);
router.post('/change-password', requireAuth, body('currentPassword').isLength({ min: 1 }), passwordRules, auth.changePassword);

export default router;
