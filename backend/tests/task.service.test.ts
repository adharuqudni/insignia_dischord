import { TaskService } from '../src/services/task.service';
import { Task, TaskStatus } from '../src/models/Task.entity';

// Mock the AppDataSource
jest.mock('../src/config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe('Task Service - CRUD Operations', () => {
  let taskService: TaskService;
  let mockRepository: any;

  beforeEach(() => {
    // Create mock repository
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    // Mock createQueryBuilder chain
    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    };
    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    // Mock AppDataSource.getRepository
    const { AppDataSource } = require('../src/config/data-source');
    AppDataSource.getRepository.mockReturnValue(mockRepository);

    taskService = new TaskService();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskData = {
        name: 'Test Task',
        description: 'Test Description',
        schedule: '0 * * * *',
        webhook_url: 'https://discord.com/api/webhooks/test',
        payload: { content: 'Test' },
        max_retry: 3,
      };

      const createdTask = {
        id: '123',
        ...taskData,
        status: TaskStatus.ACTIVE,
        is_enabled: true,
        next_execution: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockRepository.create.mockReturnValue(createdTask);
      mockRepository.save.mockResolvedValue(createdTask);

      const result = await taskService.createTask(taskData);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...taskData,
          status: TaskStatus.ACTIVE,
        })
      );
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toEqual(createdTask);
    });

    it('should throw error for invalid cron expression', async () => {
      const taskData = {
        name: 'Test Task',
        schedule: 'invalid-cron',
        webhook_url: 'https://discord.com/api/webhooks/test',
        payload: { content: 'Test' },
      };

      await expect(taskService.createTask(taskData)).rejects.toThrow(
        'Invalid cron expression'
      );
    });
  });

  describe('getAllTasks', () => {
    it('should return paginated tasks', async () => {
      const mockTasks = [
        { id: '1', name: 'Task 1', status: TaskStatus.ACTIVE },
        { id: '2', name: 'Task 2', status: TaskStatus.ACTIVE },
      ];

      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockTasks, 2]);

      const result = await taskService.getAllTasks({ page: 1, limit: 10 });

      expect(result.tasks).toEqual(mockTasks);
      expect(result.total).toBe(2);
    });

    it('should filter tasks by status', async () => {
      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await taskService.getAllTasks({ status: 'active' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.status = :status',
        { status: 'active' }
      );
    });

    it('should search tasks by name', async () => {
      const mockQueryBuilder = mockRepository.createQueryBuilder();
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await taskService.getAllTasks({ search: 'test' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.name ILIKE :search',
        { search: '%test%' }
      );
    });
  });

  describe('getTaskById', () => {
    it('should return task by id', async () => {
      const mockTask = {
        id: '123',
        name: 'Test Task',
        status: TaskStatus.ACTIVE,
      };

      mockRepository.findOne.mockResolvedValue(mockTask);

      const result = await taskService.getTaskById('123');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123' },
        relations: ['logs'],
      });
      expect(result).toEqual(mockTask);
    });

    it('should return null if task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await taskService.getTaskById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const existingTask = {
        id: '123',
        name: 'Old Name',
        schedule: '0 * * * *',
        status: TaskStatus.ACTIVE,
      };

      const updateData = {
        name: 'New Name',
      };

      mockRepository.findOne.mockResolvedValue(existingTask);
      mockRepository.save.mockResolvedValue({ ...existingTask, ...updateData });

      const result = await taskService.updateTask('123', updateData);

      expect(result.name).toBe('New Name');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw error if task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        taskService.updateTask('nonexistent', { name: 'Test' })
      ).rejects.toThrow('Task not found');
    });
  });

  describe('deleteTask', () => {
    it('should soft delete task by setting status to DELETED', async () => {
      const existingTask = {
        id: '123',
        name: 'Test Task',
        status: TaskStatus.ACTIVE,
        is_enabled: true,
      };

      mockRepository.findOne.mockResolvedValue(existingTask);
      mockRepository.save.mockResolvedValue({
        ...existingTask,
        status: TaskStatus.DELETED,
        is_enabled: false,
      });

      await taskService.deleteTask('123');

      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: TaskStatus.DELETED,
          is_enabled: false,
        })
      );
    });

    it('should throw error if task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(taskService.deleteTask('nonexistent')).rejects.toThrow(
        'Task not found'
      );
    });
  });

  describe('toggleTask', () => {
    it('should toggle task from enabled to disabled', async () => {
      const existingTask = {
        id: '123',
        name: 'Test Task',
        is_enabled: true,
        status: TaskStatus.ACTIVE,
      };

      mockRepository.findOne.mockResolvedValue(existingTask);
      mockRepository.save.mockResolvedValue({
        ...existingTask,
        is_enabled: false,
      });

      const result = await taskService.toggleTask('123');

      expect(result.is_enabled).toBe(false);
    });

    it('should toggle task from disabled to enabled', async () => {
      const existingTask = {
        id: '123',
        name: 'Test Task',
        is_enabled: false,
        status: TaskStatus.ACTIVE,
      };

      mockRepository.findOne.mockResolvedValue(existingTask);
      mockRepository.save.mockResolvedValue({
        ...existingTask,
        is_enabled: true,
      });

      const result = await taskService.toggleTask('123');

      expect(result.is_enabled).toBe(true);
    });
  });

  describe('getActiveTasks', () => {
    it('should return only active and enabled tasks', async () => {
      const mockTasks = [
        { id: '1', name: 'Task 1', status: TaskStatus.ACTIVE, is_enabled: true },
        { id: '2', name: 'Task 2', status: TaskStatus.ACTIVE, is_enabled: true },
      ];

      mockRepository.find.mockResolvedValue(mockTasks);

      const result = await taskService.getActiveTasks();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          status: TaskStatus.ACTIVE,
          is_enabled: true,
        },
      });
      expect(result).toEqual(mockTasks);
    });
  });
});

