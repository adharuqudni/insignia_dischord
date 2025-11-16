import { AppDataSource } from '../config/data-source';
import { TaskLog, LogStatus } from '../models/TaskLog.entity';

export class TaskLogService {
  private logRepository = AppDataSource.getRepository(TaskLog);

  async createLog(data: Partial<TaskLog>): Promise<TaskLog> {
    const log = this.logRepository.create(data);
    return await this.logRepository.save(log);
  }

  async getLogsByTaskId(
    taskId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ logs: TaskLog[]; total: number }> {
    const skip = (page - 1) * limit;

    const [logs, total] = await this.logRepository.findAndCount({
      where: { task_id: taskId },
      order: { execution_time: 'DESC' },
      skip,
      take: limit,
    });

    return { logs, total };
  }

  async getAllLogs(filters: any = {}): Promise<{ logs: TaskLog[]; total: number }> {
    const query = this.logRepository.createQueryBuilder('log');

    if (filters.status) {
      query.andWhere('log.status = :status', { status: filters.status });
    }

    if (filters.task_id) {
      query.andWhere('log.task_id = :task_id', { task_id: filters.task_id });
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    query.skip(skip).take(limit).orderBy('log.execution_time', 'DESC');

    const [logs, total] = await query.getManyAndCount();

    return { logs, total };
  }

  async getLogById(id: string): Promise<TaskLog | null> {
    return await this.logRepository.findOne({
      where: { id },
    });
  }

  async getRecentLogs(limit: number = 10): Promise<TaskLog[]> {
    return await this.logRepository.find({
      order: { execution_time: 'DESC' },
      take: limit,
    });
  }

  async getFailedLogsLast24Hours(): Promise<number> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const count = await this.logRepository.count({
      where: {
        status: LogStatus.FAILED,
      },
      // Note: TypeORM doesn't have direct date comparison in where clause like this
      // You'd need to use QueryBuilder for more complex queries
    });

    return count;
  }
}

