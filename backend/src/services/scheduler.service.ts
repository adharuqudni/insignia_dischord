import cron from 'node-cron';
import { TaskService } from './task.service';
import { TaskExecutionService } from './taskExecution.service';

export class SchedulerService {
  private taskService = new TaskService();
  private executionService = new TaskExecutionService();
  private scheduledJobs: Map<string, cron.ScheduledTask> = new Map();

  /**
   * Start the scheduler and load all active tasks
   */
  async start(): Promise<void> {
    console.log('🔄 Starting task scheduler...');
    
    // Load active tasks from database
    const tasks = await this.taskService.getActiveTasks();
    
    console.log(`📋 Found ${tasks.length} active tasks`);

    // Schedule each task
    for (const task of tasks) {
      this.scheduleTask(task.id, task.schedule);
    }

    console.log('✅ Task scheduler started successfully');
  }

  /**
   * Schedule a single task
   */
  scheduleTask(taskId: string, cronExpression: string): void {
    try {
      // Remove existing job if it exists
      this.unscheduleTask(taskId);

      // Create new cron job
      const job = cron.schedule(cronExpression, async () => {
        console.log(`⏰ Triggered scheduled task: ${taskId}`);
        await this.executionService.executeTask(taskId);
      });

      this.scheduledJobs.set(taskId, job);
      console.log(`📅 Scheduled task ${taskId} with cron: ${cronExpression}`);
    } catch (error: any) {
      console.error(`Failed to schedule task ${taskId}:`, error.message);
    }
  }

  /**
   * Unschedule a task
   */
  unscheduleTask(taskId: string): void {
    const job = this.scheduledJobs.get(taskId);
    if (job) {
      job.stop();
      this.scheduledJobs.delete(taskId);
      console.log(`🛑 Unscheduled task: ${taskId}`);
    }
  }

  /**
   * Reschedule a task (when it's updated)
   */
  async rescheduleTask(taskId: string, newCronExpression: string): Promise<void> {
    this.unscheduleTask(taskId);
    this.scheduleTask(taskId, newCronExpression);
  }

  /**
   * Stop all scheduled jobs
   */
  stopAll(): void {
    console.log('🛑 Stopping all scheduled tasks...');
    
    for (const [taskId, job] of this.scheduledJobs.entries()) {
      job.stop();
    }
    
    this.scheduledJobs.clear();
    console.log('✅ All scheduled tasks stopped');
  }

  /**
   * Get count of scheduled jobs
   */
  getScheduledCount(): number {
    return this.scheduledJobs.size;
  }
}

