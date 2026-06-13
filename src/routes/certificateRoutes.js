import express from 'express';
import { index, adminIndex, show, store, update, destroy } from '../controllers/certificateController.js';
import { certificateStoreValidator, certificateUpdateValidator } from '../validators/certificateValidator.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// Public routes
router.get('/', index);
router.get('/:id', show);

// Admin routes (will be protected by the parent router)
router.get('/', adminIndex);
router.post('/', certificateStoreValidator, validateRequest, store);
router.put('/:id', certificateUpdateValidator, validateRequest, update);
router.delete('/:id', destroy);

export default router;
