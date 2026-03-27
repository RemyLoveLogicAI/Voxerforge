/**
 * VoxForge Server - Production-grade backend
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { logger } from './services/logger.js';
import { setupRoutes } from './api/routes.js';
import { setupWebSocket } from './websocket/server.js';
import { initDatabase } from './db/client.js';
import { errorHandler } from './api/middleware/error-handler.js';
import { rateLimiter } from './api/middleware/rate-limiter.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
setupRoutes(app);

// Error handling
app.use(errorHandler);

// Create HTTP server
const httpServer = createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server: httpServer });
setupWebSocket(wss);

// Start server
async function start() {
  try {
    // Initialize database
    await initDatabase();
    logger.info('Database connected');

    // Start listening
    httpServer.listen(PORT, HOST, () => {
      logger.info(`🚀 VoxForge Server running at http://${HOST}:${PORT}`);
      logger.info(`📊 Health check: http://${HOST}:${PORT}/health`);
      logger.info(`🔌 WebSocket: ws://${HOST}:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

start();
