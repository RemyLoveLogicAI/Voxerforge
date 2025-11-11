# VoxForge Server Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json turbo.json ./
COPY packages/core/package.json ./packages/core/
COPY packages/ai-orchestrator/package.json ./packages/ai-orchestrator/
COPY packages/code-ops/package.json ./packages/code-ops/
COPY packages/rag-engine/package.json ./packages/rag-engine/
COPY packages/plugin-system/package.json ./packages/plugin-system/
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate --schema=./apps/server/prisma/schema.prisma

# Build
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 voxforge

# Copy built application
COPY --from=builder --chown=voxforge:nodejs /app/apps/server/dist ./dist
COPY --from=builder --chown=voxforge:nodejs /app/apps/server/prisma ./prisma
COPY --from=builder --chown=voxforge:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=voxforge:nodejs /app/apps/server/package.json ./package.json

USER voxforge

EXPOSE 4000

ENV PORT 4000

CMD ["node", "dist/index.js"]
