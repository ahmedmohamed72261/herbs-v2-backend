import { body, param } from 'express-validator';
import mongoose from 'mongoose';

export const categoryStoreValidator = [
    body('name_en').trim().notEmpty().withMessage('Name (EN) is required'),
    body('name_ar').trim().notEmpty().withMessage('Name (AR) is required'),
    body('slug').trim().notEmpty().withMessage('Slug is required'),
    body('description_en').optional().trim(),
    body('description_ar').optional().trim(),
    body('image').optional().trim(),
    body('is_active').optional().isBoolean(),
    body('order').optional().isInt(),
];

export const categoryUpdateValidator = [
    param('id').custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid category ID'),
    body('name_en').optional().trim().notEmpty(),
    body('name_ar').optional().trim().notEmpty(),
    body('slug').optional().trim().notEmpty(),
    body('description_en').optional().trim(),
    body('description_ar').optional().trim(),
    body('image').optional().trim(),
    body('is_active').optional().isBoolean(),
    body('order').optional().isInt(),
];
