import express from "express";

import {
    getMenu,
    getMenuItem,
} from '../controllers/menuController.js';

const router = express.Router();

router.get('/', getMenu);
router.get('/:id', getMenuItem);

export default router;