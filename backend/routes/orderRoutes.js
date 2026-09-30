import express from 'express';

import {
    createOrder,
    getMyOrders,
    getOrder,
} from '../controllers/orderController.js';

import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createOrder);
router.get('/my', getMyOrders); 
router.get('/:id', getOrder);

export default router;