import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 'User with this email already exists.', 409);
      return;
    }

    const user = await User.create({ name, email, password, role: role || 'sales' });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    sendSuccess(
      res,
      {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      },
      'Registration successful.',
      201
    );
  } catch (err) {
    sendError(res, 'Registration failed. Please try again.', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendError(res, 'Invalid email or password.', 401);
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 'Invalid email or password.', 401);
      return;
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    sendSuccess(res, {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    }, 'Login successful.');
  } catch {
    sendError(res, 'Login failed. Please try again.', 500);
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      sendError(res, 'User not found.', 404);
      return;
    }
    sendSuccess(res, { id: user.id, name: user.name, email: user.email, role: user.role });
  } catch {
    sendError(res, 'Failed to fetch user.', 500);
  }
};
