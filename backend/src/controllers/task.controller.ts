import { Request, Response } from 'express';
import { TaskService } from '../services/task.service';
import { TaskExecutionService } from '../services/taskExecution.service';
import { schedulerInstance } from '../server';

const taskService = new TaskService();
const executionService = new TaskExecutionService();

export class TaskController {
  async createTask(req: Request, res: Response) {
    try {
      const task = await taskService.createTask(req.body);
      
      // Auto-register with scheduler if enabled
      if (schedulerInstance && task.is_enabled) {
        schedulerInstance.scheduleTask(task.id, task.schedule);
        console.log(`✅ Auto-registered new task with scheduler: ${task.name} (${task.id})`);
      }
      
      res.status(201).json({ success: true, data: task });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: { message: error.message, code: 'CREATE_FAILED' },
      });
    }
  }

  async getTasks(req: Request, res: Response) {
    try {
      const { tasks, total } = await taskService.getAllTasks(req.query);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      res.json({
        success: true,
        data: { tasks, total, page, limit },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { message: error.message, code: 'FETCH_FAILED' },
      });
    }
  }

  async getTask(req: Request, res: Response) {
    try {
      const task = await taskService.getTaskById(req.params.id);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: { message: 'Task not found', code: 'NOT_FOUND' },
        });
      }
      res.json({ success: true, data: task });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { message: error.message, code: 'FETCH_FAILED' },
      });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      
      // Update scheduler if schedule or enabled status changed
      if (schedulerInstance) {
        if (task.is_enabled) {
          // Reschedule with new cron expression
          schedulerInstance.rescheduleTask(task.id, task.schedule);
          console.log(`🔄 Rescheduled task: ${task.name} (${task.id})`);
        } else {
          // Unschedule if disabled
          schedulerInstance.unscheduleTask(task.id);
          console.log(`⏸️  Unscheduled disabled task: ${task.name} (${task.id})`);
        }
      }
      
      res.json({ success: true, data: task });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: { message: error.message, code: 'UPDATE_FAILED' },
      });
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      await taskService.deleteTask(req.params.id);
      
      // Unschedule deleted task
      if (schedulerInstance) {
        schedulerInstance.unscheduleTask(req.params.id);
        console.log(`🗑️  Unscheduled deleted task: ${req.params.id}`);
      }
      
      res.json({
        success: true,
        data: { message: 'Task deleted successfully' },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: { message: error.message, code: 'DELETE_FAILED' },
      });
    }
  }

  async toggleTask(req: Request, res: Response) {
    try {
      const task = await taskService.toggleTask(req.params.id);
      
      // Update scheduler based on new enabled status
      if (schedulerInstance) {
        if (task.is_enabled) {
          // Re-schedule the task
          schedulerInstance.scheduleTask(task.id, task.schedule);
          console.log(`▶️  Enabled and scheduled task: ${task.name} (${task.id})`);
        } else {
          // Unschedule the task
          schedulerInstance.unscheduleTask(task.id);
          console.log(`⏸️  Disabled and unscheduled task: ${task.name} (${task.id})`);
        }
      }
      
      res.json({
        success: true,
        data: { id: task.id, is_enabled: task.is_enabled },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: { message: error.message, code: 'TOGGLE_FAILED' },
      });
    }
  }

  async executeTask(req: Request, res: Response) {
    try {
      const result = await executionService.executeTask(req.params.id);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { message: error.message, code: 'EXECUTION_FAILED' },
      });
    }
  }
}

