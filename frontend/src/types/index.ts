export type { Task, TaskLog, DashboardStats } from '@/lib/api/tasks';

export type TaskStatus = 'active' | 'paused' | 'deleted';
export type LogStatus = 'success' | 'failed' | 'retrying';

