import express from 'express';
import { uploadFile, upload } from '../controllers/uploadController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);
router.post('/', upload.single('file'), uploadFile);

export default router;
