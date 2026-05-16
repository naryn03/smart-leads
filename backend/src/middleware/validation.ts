import { body, query, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: (e as { path: string }).path, message: e.msg })),
    });
    return;
  }
  next();
};

export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'sales']).withMessage('Role must be admin or sales'),
  handleValidationErrors,
];

export const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

export const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  body('source').notEmpty().withMessage('Source is required').isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes max 500 characters'),
  handleValidationErrors,
];

export const leadQueryValidation = [
  query('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status filter'),
  query('source').optional().isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source filter'),
  query('sort').optional().isIn(['latest', 'oldest']).withMessage('Sort must be latest or oldest'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  handleValidationErrors,
];

export const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors,
];
