import { AppDataSource } from '../config/data-source';
import { Task, TaskStatus } from '../models/Task.entity';
import { calculateNextExecution, isValidCronExpression } from '../utils/cronUtils';

export class TaskService {
  private taskRepository = AppDataSource.getRepository(Task);

  async createTask(data: Partial<Task>): Promise<Task> {
    // Validate cron expression
    if (!data.schedule || !isValidCronExpression(data.schedule)) {
      throw new Error('Invalid cron expression');
    }

    const nextExecution = calculateNextExecution(data.schedule);
    
    const task = this.taskRepository.create({
      ...data,
      next_execution: nextExecution || undefined,
      status: TaskStatus.ACTIVE,
    });

    return await this.taskRepository.save(task);
  }

  async getAllTasks(filters: any = {}): Promise<{ tasks: Task[]; total: number }> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .where('task.status != :status', { status: TaskStatus.DELETED });

    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }

    if (filters.is_enabled !== undefined) {
      query.andWhere('task.is_enabled = :is_enabled', {
        is_enabled: filters.is_enabled,
      });
    }

    if (filters.search) {
      query.andWhere('task.name ILIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    query.skip(skip).take(limit).orderBy('task.created_at', 'DESC');

    const [tasks, total] = await query.getManyAndCount();

    return { tasks, total };
  }

  async getTaskById(id: string): Promise<Task | null> {
    return await this.taskRepository.findOne({
      where: { id },
      relations: ['logs'],
    });
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const task = await this.getTaskById(id);
    if (!task || task.status === TaskStatus.DELETED) {
      throw new Error('Task not found');
    }

    // Validate cron if it's being updated
    if (data.schedule && data.schedule !== task.schedule) {
      if (!isValidCronExpression(data.schedule)) {
        throw new Error('Invalid cron expression');
      }
      data.next_execution = calculateNextExecution(data.schedule) || undefined;
    }

    Object.assign(task, data);
    return await this.taskRepository.save(task);
  }

  async deleteTask(id: string): Promise<void> {
    const task = await this.getTaskById(id);
    if (!task) throw new Error('Task not found');

    task.status = TaskStatus.DELETED;
    task.is_enabled = false;
    await this.taskRepository.save(task);
  }

  async toggleTask(id: string): Promise<Task> {
    const task = await this.getTaskById(id);
    if (!task || task.status === TaskStatus.DELETED) {
      throw new Error('Task not found');
    }

    task.is_enabled = !task.is_enabled;
    return await this.taskRepository.save(task);
  }

  async getActiveTasks(): Promise<Task[]> {
    return await this.taskRepository.find({
      where: {
        status: TaskStatus.ACTIVE,
        is_enabled: true,
      },
    });
  }

  async updateLastExecution(id: string, nextExecution: Date): Promise<void> {
    await this.taskRepository.update(id, {
      last_execution: new Date(),
      next_execution: nextExecution,
    });
  }
}

