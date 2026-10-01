import express from 'express';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { createStaff, deleteStaff, getStaff, getStaffById, updateStaff } from '../controllers/staffController.js';

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get('/', getStaff);
router.post('/', createStaff);
router.get('/:id', getStaffById);
router.patch('/:id', updateStaff);
router.delete('/:id', deleteStaff);

export default router;
