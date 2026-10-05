import express from 'express';

import {
    createOrder,
    getMyOrders,
    getOrder,
    getKitchenOrders,
    updateKitchenOrderStatus,
} from '../controllers/orderController.js';

import { authenticate, requireStaff } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/my', getMyOrders); 
router.get('/kitchen', requireStaff, getKitchenOrders);
router.patch('/kitchen/:id/status', requireStaff, updateKitchenOrderStatus);
router.get('/:id', getOrder);

export default router;
