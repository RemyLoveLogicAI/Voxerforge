# Production Deployment Guide for VoxForge IDE

## Prerequisites

- Docker and Docker Compose
- PostgreSQL 16+
- Redis 7+
- Node.js 20+
- (Optional) Ollama for local AI models
- (Optional) Kubernetes cluster for scaled deployment

## Deployment Options

### Option 1: Docker Compose (Recommended for Small-Medium Deployments)

1. **Clone and Configure**
   ```bash
   git clone https://github.com/RemyLoveLogicAI/Voxerforge.git
   cd Voxerforge
   cp apps/server/.env.example apps/server/.env
   ```

2. **Edit Environment Variables**
   ```bash
   nano apps/server/.env
   # Update DATABASE_URL, JWT_SECRET, and API keys
   ```

3. **Start Services**
   ```bash
   docker-compose up -d
   ```

4. **Run Migrations**
   ```bash
   docker-compose exec server npx prisma migrate deploy
   ```

5. **Verify**
   ```bash
   curl http://localhost:4000/health
   ```

### Option 2: Kubernetes (Production-Scale)

1. **Create Namespace and Secrets**
   ```bash
   kubectl apply -f k8s/deployment.yaml
   kubectl create secret generic voxforge-secrets \
     --from-literal=DATABASE_URL=postgresql://... \
     --from-literal=JWT_SECRET=... \
     -n voxforge
   ```

2. **Deploy Application**
   ```bash
   kubectl apply -f k8s/deployment.yaml
   ```

3. **Monitor Deployment**
   ```bash
   kubectl get pods -n voxforge
   kubectl logs -f deployment/voxforge-server -n voxforge
   ```

### Option 3: Manual Deployment

1. **Database Setup**
   ```bash
   createdb voxforge
   psql voxforge < apps/server/prisma/schema.sql
   ```

2. **Install Dependencies**
   ```bash
   npm install
   npm run build
   ```

3. **Run Migrations**
   ```bash
   cd apps/server
   npx prisma migrate deploy
   ```

4. **Start Server**
   ```bash
   npm start
   ```

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT tokens | Yes |
| `REDIS_URL` | Redis connection string | No |
| `OPENAI_API_KEY` | OpenAI API key | No |
| `ANTHROPIC_API_KEY` | Anthropic API key | No |
| `OLLAMA_BASE_URL` | Ollama server URL | No |
| `PORT` | Server port (default: 4000) | No |
| `NODE_ENV` | Environment (production/development) | No |

### Ollama Setup (Local AI)

1. **Install Ollama**
   ```bash
   curl https://ollama.ai/install.sh | sh
   ```

2. **Pull Models**
   ```bash
   ollama pull llama3.1
   ollama pull qwen2.5-coder
   ollama pull codellama:7b
   ```

3. **Configure VoxForge**
   ```yaml
   # config/default.yaml
   models:
     profiles:
       - name: local
         fastDraft:
           provider: ollama
           modelId: llama3.1
   ```

## Monitoring

### Health Checks

```bash
# Server health
curl http://localhost:4000/health

# Database connection
docker-compose exec server npx prisma db pull

# Redis connection
redis-cli ping
```

### Logs

```bash
# Docker Compose
docker-compose logs -f server

# Kubernetes
kubectl logs -f deployment/voxforge-server -n voxforge

# Direct
tail -f logs/combined.log
```

### Metrics

Access Prometheus metrics at `/metrics` endpoint (if enabled).

## Scaling

### Horizontal Scaling

```bash
# Docker Compose
docker-compose up -d --scale server=3

# Kubernetes (automatic with HPA)
kubectl autoscale deployment voxforge-server \
  --cpu-percent=70 \
  --min=3 \
  --max=10 \
  -n voxforge
```

### Vertical Scaling

Update resource limits in `docker-compose.yml` or `k8s/deployment.yaml`.

## Backup

### Database Backup

```bash
# Automated daily backup
docker-compose exec postgres pg_dump -U voxforge voxforge > backup.sql

# Restore
docker-compose exec -T postgres psql -U voxforge voxforge < backup.sql
```

### Redis Backup

```bash
docker-compose exec redis redis-cli SAVE
cp ./redis_data/dump.rdb ./backups/redis-$(date +%Y%m%d).rdb
```

## Security

### SSL/TLS

Use a reverse proxy (Nginx, Traefik) for SSL termination:

```nginx
server {
    listen 443 ssl http2;
    server_name voxforge.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Firewall Rules

```bash
# Allow only necessary ports
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 4000/tcp  # Block direct access
```

## Troubleshooting

### Server Won't Start

1. Check logs: `docker-compose logs server`
2. Verify environment variables
3. Ensure database is accessible
4. Check port conflicts

### Database Connection Issues

1. Verify DATABASE_URL format
2. Check network connectivity
3. Ensure Prisma client is generated

### Ollama Connection Failed

1. Verify Ollama is running: `ollama list`
2. Check OLLAMA_BASE_URL
3. Test connection: `curl http://localhost:11434/api/tags`

## Performance Tuning

### Database

```sql
-- Add indexes for common queries
CREATE INDEX idx_projects_user_updated ON "Project"("userId", "updatedAt");
CREATE INDEX idx_sessions_active ON "Session"("isActive", "lastActivityAt");
```

### Redis Caching

```typescript
// Cache frequently accessed data
await redis.set(`project:${id}`, JSON.stringify(project), 'EX', 3600);
```

### Node.js

```bash
# Increase memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm start
```

## Maintenance

### Updates

```bash
# Pull latest code
git pull origin main

# Rebuild
docker-compose build server

# Restart
docker-compose up -d server
```

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name add_feature

# Deploy migration
npx prisma migrate deploy
```

## Support

- GitHub Issues: https://github.com/RemyLoveLogicAI/Voxerforge/issues
- Documentation: https://voxforge.dev/docs
- Discord: https://discord.gg/voxforge
