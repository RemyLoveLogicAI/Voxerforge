/**
 * User preferences API routes
 */

import { Router } from 'express';
import { prisma } from '../db/client.js';
import { requireAuth, AuthRequest } from './middleware/auth.js';

export const preferencesRouter = Router();
preferencesRouter.use(requireAuth);

// Get preferences
preferencesRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const preferences = await prisma.userPreference.findUnique({
      where: { userId: req.user!.userId },
    });
    res.json(preferences);
  } catch (error) {
    next(error);
  }
});

// Update preferences
preferencesRouter.patch('/', async (req: AuthRequest, res, next) => {
  try {
    const preferences = await prisma.userPreference.upsert({
      where: { userId: req.user!.userId },
      update: req.body,
      create: {
        userId: req.user!.userId,
        ...req.body,
      },
    });
    res.json(preferences);
  } catch (error) {
    next(error);
  }
});
