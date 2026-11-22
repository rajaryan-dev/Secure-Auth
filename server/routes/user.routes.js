import { Router } from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import * as users from '../controllers/user.controller.js';

const router = Router();
router.use(requireAuth);
router.get('/profile', users.getProfile);
router.patch('/profile', body('fullName').optional().trim().isLength({ min: 2, max: 100 }), users.updateProfile);
export default router;
