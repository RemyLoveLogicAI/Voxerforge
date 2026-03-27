/**
 * API Routes setup
 */

import { Express } from 'express';
import { authRouter } from './auth.js';
import { projectsRouter } from './projects.js';
import { aiRouter } from './ai.js';
import { sessionsRouter } from './sessions.js';
import { preferencesRouter } from './preferences.js';

export function setupRoutes(app: Express) {
  // API version prefix
  const apiPrefix = '/api/v1';

  // Auth routes
  app.use(`${apiPrefix}/auth`, authRouter);

  // Protected routes
  app.use(`${apiPrefix}/projects`, projectsRouter);
  app.use(`${apiPrefix}/ai`, aiRouter);
  app.use(`${apiPrefix}/sessions`, sessionsRouter);
  app.use(`${apiPrefix}/preferences`, preferencesRouter);
}
