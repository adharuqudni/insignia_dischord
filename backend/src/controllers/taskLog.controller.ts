import { Request, Response } from 'express';
import { TaskLogService } from '../services/taskLog.service';

const logService = new TaskLogService();

export class TaskLogController {
  async getTaskLogs(req: Request, res: Response) {
    try {
      const taskId = req.params.taskId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { logs, total } = await logService.getLogsByTaskId(taskId, page, limit);

      res.json({
        success: true,
        data: { logs, total, page, limit },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { message: error.message, code: 'FETCH_FAILED' },
      });
    }
  }

  async getAllLogs(req: Request, res: Response) {
    try {
      const { logs, total } = await logService.getAllLogs(req.query);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      res.json({
        success: true,
        data: { logs, total, page, limit },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { message: error.message, code: 'FETCH_FAILED' },
      });
    }
  }

  async getLog(req: Request, res: Response) {
    try {
      const log = await logService.getLogById(req.params.id);
      if (!log) {
        return res.status(404).json({
          success: false,
          error: { message: 'Log not found', code: 'NOT_FOUND' },
        });
      }
      res.json({ success: true, data: log });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { message: error.message, code: 'FETCH_FAILED' },
      });
    }
  }
}

