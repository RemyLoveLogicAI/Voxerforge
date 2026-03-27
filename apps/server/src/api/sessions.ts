/**
 * Sessions API routes
 */

import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/client.js';
import { requireAuth, AuthRequest } from './middleware/auth.js';
import { validateRequest } from './middleware/validate.js';

export const sessionsRouter = Router();
sessionsRouter.use(requireAuth);

const createSessionSchema = z.object({
  deviceType: z.string(),
  deviceId: z.string(),
  projectId: z.string().optional(),
});

// Create session
sessionsRouter.post('/', validateRequest(createSessionSchema), async (req: AuthRequest, res, next) => {
  try {
    const session = await prisma.session.create({
      data: {
        userId: req.user!.userId,
        deviceType: req.body.deviceType,
        deviceId: req.body.deviceId,
        projectId: req.body.projectId,
      },
    });
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

// Get active sessions
sessionsRouter.get('/active', async (req: AuthRequest, res, next) => {
  try {
    const sessions = await prisma.session.findMany({
      where: {
        userId: req.user!.userId,
        isActive: true,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { lastActivityAt: 'desc' },
    });
    res.json(sessions);
  } catch (error) {
    next(error);
  }
});

// Update session activity
sessionsRouter.patch('/:id/activity', async (req: AuthRequest, res, next) => {
  try {
    await prisma.session.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
      data: {
        lastActivityAt: new Date(),
      },
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// End session
sessionsRouter.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    await prisma.session.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
      data: {
        isActive: false,
        endedAt: new Date(),
      },
    });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});
