import express from 'express';
import { login, register, logout, refresh, me, updateProfile } from '../controllers/authController.js';
import { index as categoryIndex, adminIndex as categoryAdminIndex, show as categoryShow, store as categoryStore, update as categoryUpdate, destroy as categoryDestroy } from '../controllers/categoryController.js';
import { index as productIndex, adminIndex as productAdminIndex, show as productShow, store as productStore, update as productUpdate, destroy as productDestroy } from '../controllers/productController.js';
import { index as certificateIndex, adminIndex as certificateAdminIndex, show as certificateShow, store as certificateStore, update as certificateUpdate, destroy as certificateDestroy } from '../controllers/certificateController.js';
import { index as catalogIndex, adminIndex as catalogAdminIndex, show as catalogShow, store as catalogStore, update as catalogUpdate, destroy as catalogDestroy } from '../controllers/catalogController.js';
import { index as contactIndex, show as contactShow, store as contactStore, update as contactUpdate, destroy as contactDestroy, markAsRead } from '../controllers/contactMessageController.js';
import { index as teamIndex, adminIndex as teamAdminIndex, show as teamShow, store as teamStore, update as teamUpdate, destroy as teamDestroy } from '../controllers/teamMemberController.js';
import { uploadFile, upload } from '../controllers/uploadController.js';
import { auth } from '../middleware/auth.js';
import validateRequest from '../middleware/validateRequest.js';
import { loginValidator, registerValidator, updateProfileValidator } from '../validators/authValidator.js';
import { categoryStoreValidator, categoryUpdateValidator } from '../validators/categoryValidator.js';
import { productStoreValidator, productUpdateValidator } from '../validators/productValidator.js';
import { certificateStoreValidator, certificateUpdateValidator } from '../validators/certificateValidator.js';
import { catalogStoreValidator, catalogUpdateValidator } from '../validators/catalogValidator.js';
import { contactMessageStoreValidator, contactMessageUpdateValidator } from '../validators/contactMessageValidator.js';
import { teamMemberStoreValidator, teamMemberUpdateValidator } from '../validators/teamMemberValidator.js';

const router = express.Router();

// Public auth routes
router.post('/auth/login', loginValidator, validateRequest, login);
router.post('/auth/register', registerValidator, validateRequest, register);

// Public resource routes
router.get('/categories', categoryIndex);
router.get('/categories/:id', categoryShow);
router.get('/products', productIndex);
router.get('/products/:id', productShow);
router.get('/certificates', certificateIndex);
router.get('/certificates/:id', certificateShow);
router.get('/catalogs', catalogIndex);
router.get('/catalogs/:id', catalogShow);
router.get('/team-members', teamIndex);
router.get('/team-members/:id', teamShow);
router.post('/contact-messages', contactMessageStoreValidator, validateRequest, contactStore);

// Protected admin routes
router.use(auth);
router.post('/upload', upload.single('file'), uploadFile);
router.post('/auth/logout', logout);
router.post('/auth/refresh', refresh);
router.get('/auth/me', me);
router.put('/auth/profile', updateProfileValidator, validateRequest, updateProfile);

router.get('/admin/categories', categoryAdminIndex);
router.post('/admin/categories', categoryStoreValidator, validateRequest, categoryStore);
router.put('/admin/categories/:id', categoryUpdateValidator, validateRequest, categoryUpdate);
router.delete('/admin/categories/:id', categoryDestroy);

router.get('/admin/products', productAdminIndex);
router.post('/admin/products', productStoreValidator, validateRequest, productStore);
router.put('/admin/products/:id', productUpdateValidator, validateRequest, productUpdate);
router.delete('/admin/products/:id', productDestroy);

router.get('/admin/certificates', certificateAdminIndex);
router.post('/admin/certificates', certificateStoreValidator, validateRequest, certificateStore);
router.put('/admin/certificates/:id', certificateUpdateValidator, validateRequest, certificateUpdate);
router.delete('/admin/certificates/:id', certificateDestroy);

router.get('/admin/catalogs', catalogAdminIndex);
router.post('/admin/catalogs', catalogStoreValidator, validateRequest, catalogStore);
router.put('/admin/catalogs/:id', catalogUpdateValidator, validateRequest, catalogUpdate);
router.delete('/admin/catalogs/:id', catalogDestroy);

router.get('/admin/contact-messages', contactIndex);
router.get('/admin/contact-messages/:id', contactShow);
router.put('/admin/contact-messages/:id', contactMessageUpdateValidator, validateRequest, contactUpdate);
router.delete('/admin/contact-messages/:id', contactDestroy);
router.post('/admin/contact-messages/:id/read', markAsRead);

router.get('/admin/team-members', teamAdminIndex);
router.post('/admin/team-members', teamMemberStoreValidator, validateRequest, teamStore);
router.put('/admin/team-members/:id', teamMemberUpdateValidator, validateRequest, teamUpdate);
router.delete('/admin/team-members/:id', teamDestroy);

export default router;
