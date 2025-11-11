/**
 * AI API routes
 */

import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from './middleware/auth.js';
import { validateRequest } from './middleware/validate.js';
import { AIAction } from '@voxforge/core';
import { ModelRouter } from '@voxforge/ai-orchestrator';
import { CodeOperationsExecutor } from '@voxforge/code-ops';
import { prisma } from '../db/client.js';

export const aiRouter = Router();

// All routes require authentication
aiRouter.use(requireAuth);

const executeActionSchema = z.object({
  action: z.nativeEnum(AIAction),
  input: z.string(),
  language: z.string().optional(),
  framework: z.string().optional(),
  targetLanguage: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// Execute AI action
aiRouter.post('/execute', validateRequest(executeActionSchema), async (req: AuthRequest, res, next) => {
  try {
    const startTime = Date.now();

    // Get user preferences for model config
    const preferences = await prisma.userPreference.findUnique({
      where: { userId: req.user!.userId },
    });

    // Initialize model router (in production, this would be cached)
    const modelRouter = new ModelRouter(
      preferences?.modelConfig ? [preferences.modelConfig as any] : [],
      preferences?.defaultProfile || 'default'
    );

    // Initialize code operations executor
    const codeOps = new CodeOperationsExecutor(
      modelRouter,
      `/tmp/checkpoints/${req.user!.userId}`
    );
    await codeOps.initialize();

    // Execute action
    const result = await codeOps.executeAction(req.body);

    const duration = Date.now() - startTime;

    // Track activity
    await prisma.activity.create({
      data: {
        sessionId: req.headers['x-session-id'] as string || 'default',
        type: 'AI_ACTION',
        action: req.body.action,
        input: req.body.input.substring(0, 1000), // Truncate for storage
        output: result.output?.substring(0, 1000),
        success: result.success,
        duration,
      },
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// Stream AI action (Server-Sent Events)
aiRouter.post('/execute/stream', validateRequest(executeActionSchema), async (req: AuthRequest, res, next) => {
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send plan
    res.write(`data: ${JSON.stringify({ type: 'plan', content: 'Analyzing request...' })}\n\n`);

    // TODO: Implement streaming execution
    
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    next(error);
  }
});

// List available models
aiRouter.get('/models', async (req: AuthRequest, res, next) => {
  try {
    // TODO: Query available Ollama models and cloud models
    res.json({
      ollama: ['llama3.1', 'qwen2.5-coder', 'codellama:7b'],
      cloud: ['gpt-4-turbo-preview', 'claude-3-opus-20240229'],
    });
  } catch (error) {
    next(error);
  }
});
