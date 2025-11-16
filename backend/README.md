# Discord Task Scheduler - Backend

Backend API for Discord Task Scheduler built with Express.js, TypeScript, and PostgreSQL.

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from example:
```bash
cp env.example .env
```

3. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=discord_scheduler
DB_USER=admin
DB_PASSWORD=password
API_KEY=your-secret-api-key
SCHEDULER_ENABLED=true
```

4. Start PostgreSQL (or use Docker):
```bash
docker run --name postgres-scheduler \
  -e POSTGRES_DB=discord_scheduler \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

5. Run migrations:
```bash
npm run migration:run
```

6. Start development server:
```bash
npm run dev
```

Server will run on `http://localhost:3001`

## API Endpoints

All endpoints require authentication header:
```
Authorization: Bearer <API_KEY>
```

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - List all tasks
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task enable/disable
- `POST /api/tasks/:id/execute` - Execute task manually

### Logs
- `GET /api/tasks/:taskId/logs` - Get logs for specific task
- `GET /api/logs` - Get all logs
- `GET /api/logs/:id` - Get specific log

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Development

### Build
```bash
npm run build
```

### Run tests
```bash
npm test
npm run test:coverage
```

### Generate migration
```bash
npm run migration:generate -- src/migrations/MigrationName
```

## Project Structure
```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Auth, error handling
│   ├── models/          # TypeORM entities
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── migrations/      # Database migrations
│   └── server.ts        # Entry point
├── tests/               # Unit tests
└── package.json
```

