import { body, param } from 'express-validator';
import mongoose from 'mongoose';

export const exportCountryStoreValidator = [
    body('name_en').trim().notEmpty().withMessage('Name (EN) is required'),
    body('name_ar').trim().notEmpty().withMessage('Name (AR) is required'),
    body('code').trim().notEmpty().withMessage('Code is required'),
    body('flag').optional().trim(),
    body('cover_image').optional().trim(),
    body('description').optional().trim(),
    body('display_order').optional().isInt(),
    body('is_active').optional().isBoolean(),
];

export const exportCountryUpdateValidator = [
    param('id').custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid export country ID'),
    body('name_en').optional().trim().notEmpty(),
    body('name_ar').optional().trim().notEmpty(),
    body('code').optional().trim().notEmpty(),
    body('flag').optional().trim(),
    body('cover_image').optional().trim(),
    body('description').optional().trim(),
    body('display_order').optional().isInt(),
    body('is_active').optional().isBoolean(),
];