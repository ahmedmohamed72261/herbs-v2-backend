import { body, param } from 'express-validator';
import mongoose from 'mongoose';

export const certificateStoreValidator = [
    body('title_en').trim().notEmpty().withMessage('Title (EN) is required'),
    body('title_ar').trim().notEmpty().withMessage('Title (AR) is required'),
    body('description_en').optional().trim(),
    body('description_ar').optional().trim(),
    body('image').optional().trim(),
    body('file').optional().trim(),
    body('issued_date').optional().isISO8601(),
    body('expiry_date').optional().isISO8601(),
    body('issuer').optional().trim(),
    body('is_active').optional().isBoolean(),
    body('order').optional().isInt(),
];

export const certificateUpdateValidator = [
    param('id').custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid certificate ID'),
    body('title_en').optional().trim().notEmpty(),
    body('title_ar').optional().trim().notEmpty(),
    body('description_en').optional().trim(),
    body('description_ar').optional().trim(),
    body('image').optional().trim(),
    body('file').optional().trim(),
    body('issued_date').optional().isISO8601(),
    body('expiry_date').optional().isISO8601(),
    body('issuer').optional().trim(),
    body('is_active').optional().isBoolean(),
    body('order').optional().isInt(),
];
