import express from 'express';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { deleteStaff, getStaff, updateStaff } from '../controllers/staffController.js';

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get('/', getStaff);
router.patch('/:id', updateStaff);
router.delete('/:id', deleteStaff);

export default router;
