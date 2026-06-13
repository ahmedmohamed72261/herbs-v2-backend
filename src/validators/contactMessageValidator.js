import { body, param } from 'express-validator';
import mongoose from 'mongoose';

export const contactMessageStoreValidator = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim(),
    body('subject').optional().trim(),
    body('message').trim().notEmpty().withMessage('Message is required'),
];

export const contactMessageUpdateValidator = [
    param('id').custom((value) => mongoose.Types.ObjectId.isValid(value)).withMessage('Invalid message ID'),
    body('is_read').optional().isBoolean(),
    body('replied_at').optional().isISO8601(),
];
