/**
 * WebSocket server for real-time features
 */

import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { authService } from '../auth/service.js';
import { logger } from '../services/logger.js';

interface WebSocketClient extends WebSocket {
  userId?: string;
  sessionId?: string;
  isAlive?: boolean;
}

const clients = new Map<string, Set<WebSocketClient>>();

export function setupWebSocket(wss: WebSocketServer) {
  wss.on('connection', async (ws: WebSocketClient, req: IncomingMessage) => {
    logger.info('WebSocket connection attempt');

    // Authenticate
    const token = new URL(req.url!, `ws://${req.headers.host}`).searchParams.get('token');
    if (!token) {
      ws.close(1008, 'Authentication required');
      return;
    }

    try {
      const payload = authService.verifyToken(token);
      ws.userId = payload.userId;
      ws.isAlive = true;

      // Add to clients
      if (!clients.has(payload.userId)) {
        clients.set(payload.userId, new Set());
      }
      clients.get(payload.userId)!.add(ws);

      logger.info(`WebSocket connected: ${payload.userId}`);

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        userId: payload.userId,
        timestamp: new Date().toISOString(),
      }));

      // Handle messages
      ws.on('message', (data: Buffer) => {
        handleMessage(ws, data);
      });

      // Handle pong
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      // Handle close
      ws.on('close', () => {
        logger.info(`WebSocket disconnected: ${payload.userId}`);
        clients.get(payload.userId)?.delete(ws);
        if (clients.get(payload.userId)?.size === 0) {
          clients.delete(payload.userId);
        }
      });
    } catch (error) {
      logger.error('WebSocket auth failed:', error);
      ws.close(1008, 'Invalid token');
    }
  });

  // Heartbeat to detect dead connections
  const interval = setInterval(() => {
    wss.clients.forEach((ws: WebSocket) => {
      const client = ws as WebSocketClient;
      if (client.isAlive === false) {
        return client.terminate();
      }
      client.isAlive = false;
      client.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });
}

function handleMessage(ws: WebSocketClient, data: Buffer) {
  try {
    const message = JSON.parse(data.toString());
    logger.debug('WebSocket message:', message);

    switch (message.type) {
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        break;

      case 'session.start':
        ws.sessionId = message.sessionId;
        break;

      case 'code.execute':
        // Handle code execution request
        broadcast(ws.userId!, {
          type: 'code.execution.started',
          sessionId: ws.sessionId,
          timestamp: new Date().toISOString(),
        });
        break;

      case 'voice.transcript':
        // Handle voice transcript
        broadcast(ws.userId!, {
          type: 'voice.transcript',
          transcript: message.transcript,
          sessionId: ws.sessionId,
          timestamp: new Date().toISOString(),
        });
        break;

      default:
        logger.warn('Unknown message type:', message.type);
    }
  } catch (error) {
    logger.error('Error handling WebSocket message:', error);
  }
}

/**
 * Broadcast message to all clients of a user
 */
export function broadcast(userId: string, message: any) {
  const userClients = clients.get(userId);
  if (userClients) {
    const data = JSON.stringify(message);
    userClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}

/**
 * Send message to specific session
 */
export function sendToSession(sessionId: string, message: any) {
  const data = JSON.stringify(message);
  clients.forEach(userClients => {
    userClients.forEach(client => {
      if (client.sessionId === sessionId && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
}
