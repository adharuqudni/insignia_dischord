import apiClient from './client';

export interface Task {
  id: string;
  name: string;
  description?: string;
  schedule: string;
  webhook_url: string;
  payload: any;
  max_retry: number;
  status: 'active' | 'paused' | 'deleted';
  is_enabled: boolean;
  last_execution?: string;
  next_execution?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskLog {
  id: string;
  task_id: string;
  execution_time: string;
  status: 'success' | 'failed' | 'retrying';
  retry_count: number;
  response_status?: number;
  response_body?: string;
  error_message?: string;
  created_at: string;
}

export interface DashboardStats {
  total_tasks: number;
  active_tasks: number;
  paused_tasks: number;
  failed_executions_24h: number;
  success_rate: number;
  recent_logs: TaskLog[];
}

export const taskApi = {
  // Create task
  createTask: async (data: Partial<Task>) => {
    const response = await apiClient.post('/api/tasks', data);
    return response.data;
  },

  // Get all tasks
  getTasks: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    const response = await apiClient.get('/api/tasks', { params });
    return response.data;
  },

  // Get single task
  getTask: async (id: string) => {
    const response = await apiClient.get(`/api/tasks/${id}`);
    return response.data;
  },

  // Update task
  updateTask: async (id: string, data: Partial<Task>) => {
    const response = await apiClient.put(`/api/tasks/${id}`, data);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string) => {
    const response = await apiClient.delete(`/api/tasks/${id}`);
    return response.data;
  },

  // Toggle task
  toggleTask: async (id: string) => {
    const response = await apiClient.patch(`/api/tasks/${id}/toggle`);
    return response.data;
  },

  // Execute task manually
  executeTask: async (id: string) => {
    const response = await apiClient.post(`/api/tasks/${id}/execute`);
    return response.data;
  },

  // Get task logs
  getTaskLogs: async (taskId: string, params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get(`/api/tasks/${taskId}/logs`, { params });
    return response.data;
  },

  // Get all logs
  getLogs: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    task_id?: string;
  }) => {
    const response = await apiClient.get('/api/logs', { params });
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await apiClient.get('/api/dashboard/stats');
    return response.data;
  },
};

