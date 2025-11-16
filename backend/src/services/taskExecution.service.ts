import { DiscordService } from './discord.service';
import { TaskService } from './task.service';
import { TaskLogService } from './taskLog.service';
import { LogStatus } from '../models/TaskLog.entity';
import { calculateBackoffDelay, calculateNextExecution } from '../utils/cronUtils';

export class TaskExecutionService {
  private discordService = new DiscordService();
  private taskService = new TaskService();
  private logService = new TaskLogService();

  /**
   * Execute a task and handle retries
   */
  async executeTask(taskId: string, retryCount: number = 0): Promise<any> {
    const task = await this.taskService.getTaskById(taskId);
    
    if (!task) {
      throw new Error('Task not found');
    }

    console.log(`Executing task: ${task.name} (ID: ${task.id})`);

    try {
      // Send to Discord webhook
      const response = await this.discordService.sendWebhook(
        task.webhook_url,
        task.payload
      );

      // Log success
      const log = await this.logService.createLog({
        task_id: task.id,
        execution_time: new Date(),
        status: LogStatus.SUCCESS,
        retry_count: retryCount,
        response_status: response.status,
        response_body: JSON.stringify(response.data),
      });

      // Update task's last execution
      const nextExecution = calculateNextExecution(task.schedule);
      if (nextExecution) {
        await this.taskService.updateLastExecution(task.id, nextExecution);
      }

      return {
        task_id: task.id,
        log_id: log.id,
        status: 'success',
        message: 'Task executed successfully',
      };
    } catch (error: any) {
      console.error(`Task execution failed: ${error.message}`);

      // Check if we should retry
      if (retryCount < task.max_retry) {
        // Log retry attempt
        await this.logService.createLog({
          task_id: task.id,
          execution_time: new Date(),
          status: LogStatus.RETRYING,
          retry_count: retryCount,
          error_message: error.message,
          response_status: error.response?.status,
        });

        // Schedule retry with exponential backoff
        const delay = calculateBackoffDelay(retryCount);
        console.log(`Retrying in ${delay}ms (attempt ${retryCount + 1}/${task.max_retry})`);
        
        setTimeout(() => {
          this.executeTask(taskId, retryCount + 1);
        }, delay);

        return {
          task_id: task.id,
          status: 'retrying',
          retry_count: retryCount + 1,
          message: `Task failed, retrying in ${delay}ms`,
        };
      } else {
        // Max retries reached, log final failure
        const log = await this.logService.createLog({
          task_id: task.id,
          execution_time: new Date(),
          status: LogStatus.FAILED,
          retry_count: retryCount,
          error_message: error.message,
          response_status: error.response?.status,
          response_body: error.response?.data ? JSON.stringify(error.response.data) : undefined,
        });

        return {
          task_id: task.id,
          log_id: log.id,
          status: 'failed',
          message: `Task failed after ${task.max_retry} retries`,
          error: error.message,
        };
      }
    }
  }
}

