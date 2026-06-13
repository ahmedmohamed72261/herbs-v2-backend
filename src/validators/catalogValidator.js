import { body, param } from 'express-validator';
import mongoose from 'mongoose';

export const catalogStoreValidator = [
    body('title_en').trim().notEmpty().withMessage('Title (EN) is required'),
    body('title_ar').trim().notEmpty().withMessage('Title (AR) is required'),
    body('description_en').optional().trim(),
    body('description_ar').optional().trim(),
    body('file').optional().trim(),
    body('image').optional().trim(),
    body('version').optional().trim(),
    body('is_active').optional().isBoolean(),
    body('order').optional().isInt(),
];

export const catalogUpdateValidator = [
    param('id').custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid catalog ID'),
    body('title_en').optional().trim().notEmpty(),
    body('title_ar').optional().trim().notEmpty(),
    body('description_en').optional().trim(),
    body('description_ar').optional().trim(),
    body('file').optional().trim(),
    body('image').optional().trim(),
    body('version').optional().trim(),
    body('is_active').optional().isBoolean(),
    body('order').optional().isInt(),
];
