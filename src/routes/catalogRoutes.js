import express from 'express';
import { index, adminIndex, show, store, update, destroy } from '../controllers/catalogController.js';
import { catalogStoreValidator, catalogUpdateValidator } from '../validators/catalogValidator.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// Public routes
router.get('/', index);
router.get('/:id', show);

// Admin routes (will be protected by the parent router)
router.get('/', adminIndex);
router.post('/', catalogStoreValidator, validateRequest, store);
router.put('/:id', catalogUpdateValidator, validateRequest, update);
router.delete('/:id', destroy);

export default router;
