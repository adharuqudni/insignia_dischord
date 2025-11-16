# Discord Task Scheduler

A full-stack web application for creating, managing, and monitoring scheduled tasks that send messages to Discord channels using webhooks.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Local Development](#local-development)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [AI Tool Usage](#ai-tool-usage)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Functionality
- ✅ **Task Management**: Create, read, update, and delete scheduled tasks
- ✅ **Cron Scheduling**: Flexible task scheduling using cron expressions
- ✅ **Discord Integration**: Send rich messages and embeds to Discord webhooks
- ✅ **Retry Logic**: Automatic retry with exponential backoff for failed tasks
- ✅ **Execution Logging**: Complete audit trail of all task executions
- ✅ **Dashboard**: Real-time statistics and monitoring
- ✅ **API Authentication**: Secure API endpoints with bearer token authentication

### Technical Features
- ✅ TypeScript for type safety
- ✅ PostgreSQL with TypeORM migrations
- ✅ RESTful API design
- ✅ Docker containerization
- ✅ Comprehensive unit tests (>70% coverage)
- ✅ Error handling and logging
- ✅ Graceful shutdown handling

---

## 🛠 Tech Stack

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: TypeORM (with migrations)
- **Task Scheduler**: node-cron
- **HTTP Client**: Axios
- **Testing**: Jest + Supertest

### Frontend *(Handled by separate agent)*
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: React Query
- **Form Handling**: react-hook-form + zod

### DevOps
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL (Docker container)

---

## 📁 Project Structure

```
discord-task-scheduler/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Route controllers
│   │   ├── middlewares/       # Auth, error handling
│   │   ├── models/            # TypeORM entities
│   │   ├── services/          # Business logic
│   │   │   ├── task.service.ts
│   │   │   ├── taskExecution.service.ts
│   │   │   ├── scheduler.service.ts
│   │   │   ├── discord.service.ts
│   │   │   └── taskLog.service.ts
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Helper functions
│   │   ├── migrations/        # Database migrations
│   │   └── server.ts          # Entry point
│   ├── tests/                 # Unit tests
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Next.js application (separate agent)
│   └── (managed by frontend agent)
│
├── docker-compose.yml          # Docker orchestration
├── env.example                 # Environment variables template
└── README.md                   # This file
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** 20.10+ and **Docker Compose** 2.0+
- **Node.js** 18+ (for local development)
- **PostgreSQL** 15+ (for local development without Docker)
- **npm** or **yarn**

---

## 🚀 Quick Start with Docker

The easiest way to run the entire application is using Docker Compose:

### 1. Clone the repository

```bash
git clone <repository-url>
cd discord-task-scheduler
```

### 2. Create environment file

```bash
cp env.example .env
```

Edit `.env` and set your API key:
```env
API_KEY=your-secret-api-key-here
```

### 3. Start all services

```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on `localhost:5432`
- Backend API on `http://localhost:3001`
- Frontend (when ready) on `http://localhost:3000`

### 4. Verify the services

**Backend API:**
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### 5. Test API with authentication

```bash
curl -H "Authorization: Bearer your-secret-api-key-here" \
     http://localhost:3001/api/dashboard/stats
```

### 6. Stop the services

```bash
docker-compose down
```

To remove all data:
```bash
docker-compose down -v
```

---

## 💻 Local Development

### Backend Setup

#### 1. Navigate to backend directory

```bash
cd backend
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Create environment file

```bash
cp env.example .env
```

Configure your `.env`:
```env
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=discord_scheduler
DB_USER=admin
DB_PASSWORD=password

# Authentication
API_KEY=your-secret-api-key-here

# Scheduler
SCHEDULER_ENABLED=true
```

#### 4. Start PostgreSQL

Using Docker:
```bash
docker run --name postgres-scheduler \
  -e POSTGRES_DB=discord_scheduler \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

Or install PostgreSQL locally and create the database.

#### 5. Run migrations

```bash
npm run migration:run
```

#### 6. Start development server

```bash
npm run dev
```

Backend will be available at `http://localhost:3001`

#### 7. Run tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 📚 API Documentation

### Base URL

```
http://localhost:3001/api
```

### Authentication

All API endpoints require authentication using a Bearer token:

```
Authorization: Bearer <API_KEY>
```

### Endpoints

#### Tasks

**Create Task**
```http
POST /api/tasks
Content-Type: application/json
Authorization: Bearer <API_KEY>

{
  "name": "Daily Report",
  "description": "Send daily report to Discord",
  "schedule": "0 9 * * *",
  "webhook_url": "https://discord.com/api/webhooks/YOUR_WEBHOOK",
  "payload": {
    "content": "Daily report!",
    "username": "Task Bot",
    "embeds": [{
      "title": "Report",
      "description": "Today's summary",
      "color": 3066993
    }]
  },
  "max_retry": 3
}
```

**List Tasks**
```http
GET /api/tasks?page=1&limit=10&status=active&search=daily
Authorization: Bearer <API_KEY>
```

**Get Task**
```http
GET /api/tasks/:id
Authorization: Bearer <API_KEY>
```

**Update Task**
```http
PUT /api/tasks/:id
Content-Type: application/json
Authorization: Bearer <API_KEY>

{
  "name": "Updated Task Name",
  "is_enabled": true
}
```

**Delete Task**
```http
DELETE /api/tasks/:id
Authorization: Bearer <API_KEY>
```

**Toggle Task**
```http
PATCH /api/tasks/:id/toggle
Authorization: Bearer <API_KEY>
```

**Execute Task Manually**
```http
POST /api/tasks/:id/execute
Authorization: Bearer <API_KEY>
```

#### Logs

**Get Task Logs**
```http
GET /api/tasks/:taskId/logs?page=1&limit=10
Authorization: Bearer <API_KEY>
```

**Get All Logs**
```http
GET /api/logs?page=1&limit=10&status=failed
Authorization: Bearer <API_KEY>
```

**Get Specific Log**
```http
GET /api/logs/:id
Authorization: Bearer <API_KEY>
```

#### Dashboard

**Get Statistics**
```http
GET /api/dashboard/stats
Authorization: Bearer <API_KEY>
```

Response:
```json
{
  "success": true,
  "data": {
    "total_tasks": 10,
    "active_tasks": 8,
    "paused_tasks": 2,
    "failed_executions_24h": 3,
    "success_rate": 95,
    "recent_logs": [...]
  }
}
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

---

## 🧪 Testing

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Coverage

The project includes comprehensive unit tests covering:

- ✅ **CRUD Operations**: Task creation, reading, updating, deletion
- ✅ **Scheduler Logic**: Cron expression parsing, task execution
- ✅ **Retry Mechanism**: Exponential backoff, max retry limits
- ✅ **Authentication**: Valid/invalid API keys, authorization
- ✅ **Discord Webhook**: Payload validation, error handling

**Current Coverage: >70%**

### Test Files

```
backend/tests/
├── auth.middleware.test.ts      # Authentication tests
├── task.service.test.ts         # CRUD operation tests
├── discord.service.test.ts      # Webhook handling tests
└── cronUtils.test.ts            # Retry logic & cron tests
```

---

## 🤖 AI Tool Usage

This project extensively used AI-powered development tools to accelerate development and improve code quality.

### Instance 1: Project Structure Generation

**Tool Used:** Claude Code CLI  
**Purpose:** Generated initial project structure and boilerplate code

**Command:**
```bash
claude-code "Generate Express.js TypeScript project structure with TypeORM"
```

**Output:** Created complete folder structure, configuration files, and base setup

**Impact:** Saved ~2 hours of manual setup time

### Instance 2: Database Schema Design

**Tool Used:** Claude Code CLI  
**Purpose:** Designed optimal database schema with proper indexes and relationships

**Prompt:**
```
Design PostgreSQL schema for task scheduler with:
- Tasks table with cron schedule
- Task logs with execution history
- Proper indexes for performance
- TypeORM entity definitions
```

**Generated:** 
- `Task.entity.ts` with all required fields
- `TaskLog.entity.ts` with relationships
- Optimized indexes for common queries

**Impact:** Ensured best practices from the start

### Instance 3: Unit Test Generation

**Tool Used:** Claude Code CLI  
**Purpose:** Generated comprehensive test suites

**Command:**
```bash
claude-code "Generate Jest unit tests for Task service CRUD operations"
```

**Generated:** Complete test files with:
- Mock setup
- Test cases for all CRUD operations
- Edge case handling
- Assertion patterns

**Impact:** Achieved >70% coverage quickly

### Instance 4: Docker Configuration

**Tool Used:** AI-assisted configuration  
**Purpose:** Optimized Docker setup for production

**Result:**
- Multi-stage Dockerfile for smaller images
- Health checks for reliability
- Proper dependency ordering
- Network isolation

---

## 🔐 Environment Variables

### Backend Environment Variables

Create `backend/.env` file:

```env
# Server Configuration
NODE_ENV=development|production
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=discord_scheduler
DB_USER=admin
DB_PASSWORD=password

# Authentication
API_KEY=your-secret-api-key-change-in-production

# Scheduler
SCHEDULER_ENABLED=true
```

### Docker Compose Environment

Create `.env` file in root:

```env
API_KEY=your-secret-api-key-change-in-production
POSTGRES_DB=discord_scheduler
POSTGRES_USER=admin
POSTGRES_PASSWORD=password
```

---

## 🗄 Database Migrations

### Generate New Migration

```bash
cd backend
npm run migration:generate -- src/migrations/MigrationName
```

### Create Empty Migration

```bash
npm run migration:create -- src/migrations/MigrationName
```

### Run Migrations

```bash
npm run migration:run
```

### Revert Last Migration

```bash
npm run migration:revert
```

### Database Schema

**Tasks Table:**
```sql
- id: UUID (primary key)
- name: VARCHAR(255)
- description: TEXT
- schedule: VARCHAR(50) -- Cron expression
- webhook_url: TEXT
- payload: JSONB
- max_retry: INTEGER (default: 3)
- status: ENUM (active, paused, deleted)
- is_enabled: BOOLEAN (default: true)
- last_execution: TIMESTAMP
- next_execution: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

**Task Logs Table:**
```sql
- id: UUID (primary key)
- task_id: UUID (foreign key)
- execution_time: TIMESTAMP
- status: ENUM (success, failed, retrying)
- retry_count: INTEGER
- response_status: INTEGER
- response_body: TEXT
- error_message: TEXT
- created_at: TIMESTAMP
```

---

## 🚢 Deployment

### Production Deployment with Docker

1. **Build production images:**
```bash
docker-compose build --no-cache
```

2. **Start services:**
```bash
docker-compose up -d
```

3. **View logs:**
```bash
docker-compose logs -f backend
```

4. **Check status:**
```bash
docker-compose ps
```

### Environment Checklist

Before deploying to production:

- [ ] Change `API_KEY` to a strong, random value
- [ ] Update database credentials
- [ ] Set `NODE_ENV=production`
- [ ] Review and update CORS settings if needed
- [ ] Enable SSL/TLS for PostgreSQL
- [ ] Set up backup strategy for database
- [ ] Configure log rotation
- [ ] Set up monitoring and alerts

### Health Checks

**Backend Health:**
```bash
curl https://your-domain.com/health
```

**Database Connection:**
```bash
docker-compose exec postgres pg_isready -U admin
```

---

## 📝 Discord Webhook Setup

### 1. Create Discord Webhook

1. Open Discord and go to your server
2. Go to Server Settings → Integrations → Webhooks
3. Click "New Webhook"
4. Name it (e.g., "Task Scheduler Bot")
5. Select the channel
6. Copy the webhook URL

### 2. Test Webhook

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test message from Task Scheduler!",
    "username": "Task Bot"
  }'
```

### 3. Example Payloads

**Simple Message:**
```json
{
  "content": "Task executed successfully!",
  "username": "Task Bot"
}
```

**Rich Embed:**
```json
{
  "username": "Task Scheduler",
  "embeds": [{
    "title": "Task Completed",
    "description": "Your scheduled task has been executed successfully",
    "color": 3066993,
    "fields": [
      {
        "name": "Task Name",
        "value": "Daily Report",
        "inline": true
      },
      {
        "name": "Execution Time",
        "value": "2025-01-13 10:00:00",
        "inline": true
      }
    ],
    "timestamp": "2025-01-13T10:00:00.000Z"
  }]
}
```

---

## 🎯 Cron Expression Examples

| Expression | Description |
|-----------|-------------|
| `* * * * *` | Every minute |
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour |
| `0 0 * * *` | Daily at midnight |
| `0 12 * * *` | Daily at noon |
| `0 9 * * 1-5` | Weekdays at 9 AM |
| `0 0 * * 0` | Weekly on Sunday |
| `0 0 1 * *` | Monthly on the 1st |

**Validate cron expressions:** https://crontab.guru/

---

## 🐛 Troubleshooting

### Backend won't start

1. Check if PostgreSQL is running:
```bash
docker ps | grep postgres
```

2. Check backend logs:
```bash
docker-compose logs backend
```

3. Verify environment variables:
```bash
docker-compose exec backend env | grep DB_
```

### Database connection failed

1. Ensure PostgreSQL is healthy:
```bash
docker-compose ps postgres
```

2. Try connecting manually:
```bash
docker-compose exec postgres psql -U admin -d discord_scheduler
```

### Migrations failed

1. Check migration status:
```bash
cd backend && npm run migration:show
```

2. Revert and retry:
```bash
npm run migration:revert
npm run migration:run
```

### Task not executing

1. Check if scheduler is enabled in `.env`:
```env
SCHEDULER_ENABLED=true
```

2. Verify task is enabled:
```bash
curl -H "Authorization: Bearer YOUR_KEY" \
  http://localhost:3001/api/tasks/TASK_ID
```

3. Check backend logs for scheduler activity

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Express.js, TypeScript, PostgreSQL, and Next.js**

