import express from 'express';
import { index, adminIndex, show, store, update, destroy } from '../controllers/teamMemberController.js';
import { teamMemberStoreValidator, teamMemberUpdateValidator } from '../validators/teamMemberValidator.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// Public routes
router.get('/', index);
router.get('/:id', show);

// Admin routes (will be protected by the parent router)
router.get('/', adminIndex);
router.post('/', teamMemberStoreValidator, validateRequest, store);
router.put('/:id', teamMemberUpdateValidator, validateRequest, update);
router.delete('/:id', destroy);

export default router;
