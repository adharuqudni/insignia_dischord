import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { TaskLogController } from '../controllers/taskLog.controller';
import { DashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Controller instances
const taskController = new TaskController();
const logController = new TaskLogController();
const dashboardController = new DashboardController();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Task routes
router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getTasks);
router.get('/tasks/:id', taskController.getTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.patch('/tasks/:id/toggle', taskController.toggleTask);
router.post('/tasks/:id/execute', taskController.executeTask);

// Task log routes
router.get('/tasks/:taskId/logs', logController.getTaskLogs);
router.get('/logs', logController.getAllLogs);
router.get('/logs/:id', logController.getLog);

// Dashboard routes
router.get('/dashboard/stats', dashboardController.getStats);

export default router;

