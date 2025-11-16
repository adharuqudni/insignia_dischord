import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { AppDataSource } from './config/data-source';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { SchedulerService } from './services/scheduler.service';

config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API routes
app.use('/api', routes);

// Error handler
app.use(errorHandler);

// Global scheduler instance
export let schedulerInstance: SchedulerService | null = null;

// Initialize database and start server
AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Database connected');

    // Run migrations automatically
    try {
      await AppDataSource.runMigrations();
      console.log('✅ Migrations executed');
    } catch (error) {
      console.log('ℹ️  No pending migrations or migrations already run');
    }

    // Start scheduler
    if (process.env.SCHEDULER_ENABLED === 'true') {
      schedulerInstance = new SchedulerService();
      await schedulerInstance.start();
      console.log('✅ Task scheduler started');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
      console.log(`🏥 Health check at http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (schedulerInstance) {
    schedulerInstance.stopAll();
  }
  await AppDataSource.destroy();
  process.exit(0);
});

export default app;

