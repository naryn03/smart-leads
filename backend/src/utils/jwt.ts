import jwt from 'jsonwebtoken';
import { IUserPayload } from '../types';

export const generateToken = (payload: IUserPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '7d',
  });
};
