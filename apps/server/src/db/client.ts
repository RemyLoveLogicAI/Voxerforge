/**
 * Database client initialization
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../services/logger.js';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

export async function initDatabase() {
  try {
    await prisma.$connect();
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
}

export async function closeDatabase() {
  await prisma.$disconnect();
  logger.info('Database connection closed');
}
