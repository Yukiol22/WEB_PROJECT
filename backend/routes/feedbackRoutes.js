import express from 'express';
import { authenticate, requireCustomer } from '../middleware/authMiddleware.js';
import { submitFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/', authenticate, requireCustomer, submitFeedback);

export default router;
