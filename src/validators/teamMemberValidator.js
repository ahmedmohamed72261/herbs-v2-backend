import { body, param } from 'express-validator';
import mongoose from 'mongoose';

export const teamMemberStoreValidator = [
    body('name_en').trim().notEmpty().withMessage('Name (EN) is required'),
    body('name_ar').trim().notEmpty().withMessage('Name (AR) is required'),
    body('position_en').trim().notEmpty().withMessage('Position (EN) is required'),
    body('position_ar').trim().notEmpty().withMessage('Position (AR) is required'),
    body('bio_en').optional().trim(),
    body('bio_ar').optional().trim(),
    body('image').optional().trim(),
    body('linkedin').optional().trim(),
    body('email').optional().trim().isEmail(),
    body('phone').optional().trim(),
    body('is_active').optional().isBoolean(),
    body('order').optional().isInt(),
];

export const teamMemberUpdateValidator = [
    param('id').custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid team member ID'),
    body('name_en').optional().trim().notEmpty(),
    body('name_ar').optional().trim().notEmpty(),
    body('position_en').optional().trim().notEmpty(),
    body('position_ar').optional().trim().notEmpty(),
    body('bio_en').optional().trim(),
    body('bio_ar').optional().trim(),
    body('image').optional().trim(),
    body('linkedin').optional().trim(),
    body('email').optional().trim().isEmail(),
    body('phone').optional().trim(),
    body('is_active').optional().isBoolean(),
    body('order').optional().isInt(),
];
