import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    res.status(400).json({ success: false, message: 'Validation error', errors });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    sendError(res, 'Invalid ID format.', 400);
    return;
  }

  if ((err as NodeJS.ErrnoException).code === '11000') {
    sendError(res, 'Duplicate key error. Resource already exists.', 409);
    return;
  }

  sendError(res, 'Internal server error.', 500);
};

export const notFound = (_req: Request, res: Response): void => {
  sendError(res, 'Route not found.', 404);
};
