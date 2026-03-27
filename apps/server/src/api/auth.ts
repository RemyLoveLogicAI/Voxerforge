/**
 * Authentication routes
 */

import { Router } from 'express';
import { z } from 'zod';
import { authService } from '../auth/service.js';
import { validateRequest } from './middleware/validate.js';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
  fullName: z.string().optional(),
});

const loginSchema = z.object({
  emailOrUsername: z.string(),
  password: z.string(),
});

// Register
authRouter.post('/register', validateRequest(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.register(
      req.body.email,
      req.body.username,
      req.body.password,
      req.body.fullName
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Login
authRouter.post('/login', validateRequest(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.login(
      req.body.emailOrUsername,
      req.body.password
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Verify token
authRouter.get('/verify', (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const payload = authService.verifyToken(token);
    res.json({ valid: true, payload });
  } catch (error) {
    next(error);
  }
});
