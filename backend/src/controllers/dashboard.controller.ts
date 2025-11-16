import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { TaskLogService } from '../services/taskLog.service';
import { TaskStatus } from '../models/Task.entity';

const taskService = new TaskService();
const logService = new TaskLogService();

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      // Get all tasks (without pagination)
      const allTasks = await taskService.getAllTasks({ limit: 1000 });
      
      // Calculate stats
      const totalTasks = allTasks.total;
      const activeTasks = allTasks.tasks.filter(
        (t) => t.status === TaskStatus.ACTIVE && t.is_enabled
      ).length;
      const pausedTasks = allTasks.tasks.filter(
        (t) => t.status === TaskStatus.PAUSED || !t.is_enabled
      ).length;

      // Get failed executions in last 24 hours
      const failedExecutions24h = await logService.getFailedLogsLast24Hours();

      // Get recent logs
      const recentLogs = await logService.getRecentLogs(10);

      // Calculate success rate (simplified)
      const successRate = totalTasks > 0 ? 
        Math.round(((totalTasks - failedExecutions24h) / totalTasks) * 100) : 
        100;

      res.json({
        success: true,
        data: {
          total_tasks: totalTasks,
          active_tasks: activeTasks,
          paused_tasks: pausedTasks,
          failed_executions_24h: failedExecutions24h,
          success_rate: successRate,
          recent_logs: recentLogs,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { message: error.message, code: 'FETCH_FAILED' },
      });
    }
  }
}

