/**
 * Projects API routes
 */

import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db/client.js';
import { requireAuth, AuthRequest } from './middleware/auth.js';
import { validateRequest } from './middleware/validate.js';

export const projectsRouter = Router();

// All routes require authentication
projectsRouter.use(requireAuth);

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  path: z.string(),
  language: z.string(),
  framework: z.string().optional(),
  config: z.record(z.any()).optional(),
});

// List projects
projectsRouter.get('/', async (req: AuthRequest, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user!.userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        language: true,
        framework: true,
        createdAt: true,
        updatedAt: true,
        lastAccessedAt: true,
      },
    });
    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// Create project
projectsRouter.post('/', validateRequest(createProjectSchema), async (req: AuthRequest, res, next) => {
  try {
    const project = await prisma.project.create({
      data: {
        ...req.body,
        userId: req.user!.userId,
      },
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

// Get project
projectsRouter.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update last accessed
    await prisma.project.update({
      where: { id: project.id },
      data: { lastAccessedAt: new Date() },
    });

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Update project
projectsRouter.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    const project = await prisma.project.updateMany({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
      data: req.body,
    });

    if (project.count === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Delete project
projectsRouter.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const project = await prisma.project.deleteMany({
      where: {
        id: req.params.id,
        userId: req.user!.userId,
      },
    });

    if (project.count === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Get project checkpoints
projectsRouter.get('/:id/checkpoints', async (req: AuthRequest, res, next) => {
  try {
    const checkpoints = await prisma.checkpoint.findMany({
      where: { projectId: req.params.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        description: true,
        createdAt: true,
      },
    });
    res.json(checkpoints);
  } catch (error) {
    next(error);
  }
});
