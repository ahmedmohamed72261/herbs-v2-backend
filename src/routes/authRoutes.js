import express from 'express';
import { login, register, me, updateProfile, logout, refresh } from '../controllers/authController.js';
import { loginValidator, registerValidator, updateProfileValidator } from '../validators/authValidator.js';
import validateRequest from '../middleware/validateRequest.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', loginValidator, validateRequest, login);
router.post('/register', registerValidator, validateRequest, register);

router.use(auth);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', me);
router.put('/profile', updateProfileValidator, validateRequest, updateProfile);

export default router;
