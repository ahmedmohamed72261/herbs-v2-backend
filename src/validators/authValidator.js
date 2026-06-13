import { body } from 'express-validator';

export const loginValidator = [
    body('email').trim().isEmail().withMessage('Email is required and must be valid'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password is required and must be at least 6 characters'),
];

export const registerValidator = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Email is required and must be valid'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),
];

export const updateProfileValidator = [
    body('name').optional().trim().notEmpty(),
    body('email').optional().trim().isEmail(),
    body('avatar').optional().trim(),
    body('current_password').optional().trim().isLength({ min: 6 }),
    body('new_password').optional().trim().isLength({ min: 6 }),
    body('new_password_confirmation').custom((value, { req }) => {
        if (req.body.new_password && value !== req.body.new_password) {
            throw new Error('New password confirmation does not match');
        }
        return true;
    }),
];
