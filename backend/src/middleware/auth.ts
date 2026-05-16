import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUserPayload, UserRole } from '../types';
import { sendError } from '../utils/response';

export interface AuthRequest extends Request {
  user?: IUserPayload;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 'Access denied. No token provided.', 401);
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');

    const decoded = jwt.verify(token, secret) as IUserPayload;
    req.user = decoded;
    next();
  } catch {
    sendError(res, 'Invalid or expired token.', 401);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Unauthorized.', 401);
      return;
    }

    if (!roles.includes(req.user.role)) {
      sendError(res, 'Forbidden. Insufficient permissions.', 403);
      return;
    }

    next();
  };
};
