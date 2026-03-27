# VoxForge API Documentation

Base URL: `http://localhost:4000/api/v1`

## Authentication

All protected endpoints require authentication via:

1. **JWT Token** (recommended for web/mobile apps)
   ```
   Authorization: Bearer <token>
   ```

2. **API Key** (for programmatic access)
   ```
   X-API-Key: <your-api-key>
   ```

## Authentication Endpoints

### Register User

```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "secure_password",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": "John Doe",
    "role": "USER",
    "plan": "FREE",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### Login

```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "emailOrUsername": "johndoe",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": "John Doe",
    "role": "USER",
    "plan": "FREE"
  },
  "token": "jwt_token_here"
}
```

### Verify Token

```http
GET /api/v1/auth/verify
Authorization: Bearer <token>
```

**Response:**
```json
{
  "valid": true,
  "payload": {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

## Project Endpoints

### List Projects

```http
GET /api/v1/projects
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "My Project",
    "description": "Project description",
    "language": "typescript",
    "framework": "react",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "lastAccessedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Project

```http
POST /api/v1/projects
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My New Project",
  "description": "Optional description",
  "path": "/path/to/project",
  "language": "typescript",
  "framework": "react",
  "config": {
    "models": {
      "defaultProfile": "local"
    }
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "My New Project",
  ...
}
```

### Get Project

```http
GET /api/v1/projects/:id
Authorization: Bearer <token>
```

### Update Project

```http
PATCH /api/v1/projects/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "description": "Updated description",
  "config": {
    ...
  }
}
```

### Delete Project

```http
DELETE /api/v1/projects/:id
Authorization: Bearer <token>
```

### Get Project Checkpoints

```http
GET /api/v1/projects/:id/checkpoints
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "description": "Before refactoring",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## AI Endpoints

### Execute AI Action

```http
POST /api/v1/ai/execute
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "action": "REFACTOR",
  "input": "function code here...",
  "language": "typescript",
  "framework": "react",
  "metadata": {
    "filePath": "/path/to/file.ts"
  }
}
```

**Response:**
```json
{
  "success": true,
  "output": "refactored code...",
  "plan": "1. Extract helper function\n2. Use async/await\n3. Add error handling",
  "diff": {
    "filePath": "/path/to/file.ts",
    "oldContent": "...",
    "newContent": "...",
    "hunks": [...]
  }
}
```

### Stream AI Action (Server-Sent Events)

```http
POST /api/v1/ai/execute/stream
Authorization: Bearer <token>
Content-Type: application/json
Accept: text/event-stream
```

**Response Stream:**
```
data: {"type":"plan","content":"Analyzing request..."}

data: {"type":"progress","content":"Generating code..."}

data: {"type":"result","output":"..."}

data: {"type":"done"}
```

### List Available Models

```http
GET /api/v1/ai/models
Authorization: Bearer <token>
```

**Response:**
```json
{
  "ollama": ["llama3.1", "qwen2.5-coder", "codellama:7b"],
  "cloud": ["gpt-4-turbo-preview", "claude-3-opus-20240229"]
}
```

## Session Endpoints

### Create Session

```http
POST /api/v1/sessions
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "deviceType": "web",
  "deviceId": "browser-uuid",
  "projectId": "project-uuid"
}
```

**Response:**
```json
{
  "id": "session-uuid",
  "userId": "user-uuid",
  "deviceType": "web",
  "deviceId": "browser-uuid",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Get Active Sessions

```http
GET /api/v1/sessions/active
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "session-uuid",
    "deviceType": "web",
    "deviceId": "browser-uuid",
    "project": {
      "id": "project-uuid",
      "name": "My Project"
    },
    "lastActivityAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Update Session Activity

```http
PATCH /api/v1/sessions/:id/activity
Authorization: Bearer <token>
```

### End Session

```http
DELETE /api/v1/sessions/:id
Authorization: Bearer <token>
```

## Preferences Endpoints

### Get User Preferences

```http
GET /api/v1/preferences
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "voiceEnabled": true,
  "voiceLanguage": "en-US",
  "wakeWord": "hey vox",
  "pushToTalk": false,
  "defaultProfile": "default",
  "modelConfig": {...},
  "theme": "dark",
  "fontSize": 14,
  "keymap": "vscode",
  "defaultShell": "bash"
}
```

### Update Preferences

```http
PATCH /api/v1/preferences
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "theme": "light",
  "fontSize": 16,
  "voiceLanguage": "es-ES"
}
```

## WebSocket API

Connect to WebSocket for real-time features:

```javascript
const ws = new WebSocket('ws://localhost:4000?token=<jwt-token>');

ws.onopen = () => {
  console.log('Connected');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};

// Send message
ws.send(JSON.stringify({
  type: 'session.start',
  sessionId: 'session-uuid'
}));
```

### WebSocket Message Types

#### Client → Server

**Ping**
```json
{
  "type": "ping"
}
```

**Start Session**
```json
{
  "type": "session.start",
  "sessionId": "session-uuid"
}
```

**Execute Code**
```json
{
  "type": "code.execute",
  "code": "console.log('hello')",
  "language": "javascript"
}
```

**Voice Transcript**
```json
{
  "type": "voice.transcript",
  "transcript": "refactor this function",
  "confidence": 0.95
}
```

#### Server → Client

**Connected**
```json
{
  "type": "connected",
  "userId": "user-uuid",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Pong**
```json
{
  "type": "pong",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Code Execution Started**
```json
{
  "type": "code.execution.started",
  "sessionId": "session-uuid",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Voice Transcript Echo**
```json
{
  "type": "voice.transcript",
  "transcript": "refactor this function",
  "sessionId": "session-uuid",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Responses

All endpoints may return these error responses:

**400 Bad Request**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**401 Unauthorized**
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden**
```json
{
  "error": "Admin access required"
}
```

**404 Not Found**
```json
{
  "error": "Project not found"
}
```

**429 Too Many Requests**
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "stack": "..." // Only in development
}
```

## Rate Limiting

- **General Endpoints**: 100 requests per 15 minutes
- **AI Endpoints**: 10 requests per 15 minutes (strict)
- **WebSocket**: No limit, but connection throttling applies

Headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```

## Pagination

List endpoints support pagination:

```http
GET /api/v1/projects?page=1&limit=20
```

Response includes pagination metadata:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

## Filtering & Sorting

```http
GET /api/v1/projects?language=typescript&sort=-updatedAt
```

Supported operators:
- `-field`: Descending sort
- `field`: Ascending sort

## Webhooks (Coming Soon)

Configure webhooks to receive notifications:

```json
{
  "url": "https://your-server.com/webhook",
  "events": ["project.created", "session.ended", "ai.action.completed"],
  "secret": "webhook-secret"
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
import { VoxForgeClient } from '@voxforge/sdk';

const client = new VoxForgeClient({
  baseUrl: 'http://localhost:4000',
  token: 'your-jwt-token'
});

// Create project
const project = await client.projects.create({
  name: 'My Project',
  language: 'typescript'
});

// Execute AI action
const result = await client.ai.execute({
  action: 'REFACTOR',
  input: code,
  language: 'typescript'
});

// Stream AI action
for await (const chunk of client.ai.executeStream({...})) {
  console.log(chunk);
}
```

### Python

```python
from voxforge import VoxForgeClient

client = VoxForgeClient(
    base_url='http://localhost:4000',
    token='your-jwt-token'
)

# Create project
project = client.projects.create(
    name='My Project',
    language='python'
)

# Execute AI action
result = client.ai.execute(
    action='REFACTOR',
    input=code,
    language='python'
)
```

### cURL

```bash
# Register
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","username":"user","password":"pass"}'

# Execute AI action
curl -X POST http://localhost:4000/api/v1/ai/execute \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{"action":"EXPLAIN","input":"function hello() {}"}'
```

## Testing

Test API endpoints:

```bash
# Health check
curl http://localhost:4000/health

# Register and get token
TOKEN=$(curl -s -X POST http://localhost:4000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","username":"testuser","password":"testpass"}' \
  | jq -r '.token')

# Use token
curl http://localhost:4000/api/v1/projects \
  -H "Authorization: Bearer $TOKEN"
```
