import express from 'express';
import { index, show, store, update, destroy, markAsRead } from '../controllers/contactMessageController.js';
import { contactMessageStoreValidator, contactMessageUpdateValidator } from '../validators/contactMessageValidator.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// Public route
router.post('/', contactMessageStoreValidator, validateRequest, store);

// Admin routes (will be protected by the parent router)
router.get('/', index);
router.get('/:id', show);
router.put('/:id', contactMessageUpdateValidator, validateRequest, update);
router.delete('/:id', destroy);
router.post('/:id/read', markAsRead);

export default router;
