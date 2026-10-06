import express from 'express';

import {
  getAllOrders,
  getReports,
  updateOrderStatus,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/adminController.js';
import { getCustomerFeedback } from '../controllers/feedbackController.js';

import {
  authenticate,
  requireAdmin,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/orders', getAllOrders);
router.get('/reports', getReports);
router.get('/feedback', getCustomerFeedback);

router.patch('/orders/:id/status', updateOrderStatus);

router.post('/menu', createMenuItem);
router.patch('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

export default router;
