import {
    register,
    login,
    getProfile,
} from '../controllers/authController.js';

import { authenticate} from '../middleware/authMiddleware.js';

import express from 'express';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

export default router;