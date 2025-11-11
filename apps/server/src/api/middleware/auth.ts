/**
 * Authentication middleware
 */

import { Request, Response, NextFunction } from 'express';
import { authService } from '../../auth/service.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const apiKey = req.headers['x-api-key'] as string;

    if (token) {
      const payload = authService.verifyToken(token);
      req.user = payload;
      return next();
    }

    if (apiKey) {
      authService.verifyApiKey(apiKey).then(user => {
        req.user = user;
        next();
      }).catch(() => {
        res.status(401).json({ error: 'Invalid API key' });
      });
      return;
    }

    res.status(401).json({ error: 'Authentication required' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication' });
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
