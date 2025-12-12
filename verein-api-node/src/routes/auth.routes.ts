/**
 * Authentication Routes
 */

import { Router } from 'express';
import { login, register, getCurrentUser, changePassword, refreshToken } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.post('/change-password', authenticate, changePassword);
router.post('/refresh', authenticate, refreshToken);

export default router;

