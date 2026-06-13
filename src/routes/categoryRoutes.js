import express from 'express';
import { index, adminIndex, show, store, update, destroy } from '../controllers/categoryController.js';
import { categoryStoreValidator, categoryUpdateValidator } from '../validators/categoryValidator.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// Public routes
router.get('/', index);
router.get('/:id', show);

// Admin routes (will be protected by the parent router)
router.get('/', adminIndex);
router.post('/', categoryStoreValidator, validateRequest, store);
router.put('/:id', categoryUpdateValidator, validateRequest, update);
router.delete('/:id', destroy);

export default router;
