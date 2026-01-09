import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('TasksController', () => {
  let controller: TasksController;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    completeTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    const fixedDate = new Date('2026-01-09T06:00:00.000Z');
    const mockTasks = [
      { id: 1, title: 'Task A', position: 0, createdAt: fixedDate },
      { id: 2, title: 'Task B', position: 1, createdAt: fixedDate },
    ];

    it('should return tasks from service', async () => {
      mockTasksService.findAll.mockResolvedValue(mockTasks);

      const result = await controller.findAll();

      expect(result).toEqual(mockTasks);
      expect(mockTasksService.findAll).toHaveBeenCalledWith();
    });

    it('should return empty array when no tasks exist', async () => {
      mockTasksService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      mockTasksService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
    });
  });

  describe('create', () => {
    const fixedDate = new Date('2026-01-09T06:00:00.000Z');
    const createTaskDto = { title: 'Test task' };
    const mockTask = {
      id: 1,
      title: 'Test task',
      position: 0,
      createdAt: fixedDate,
    };

    it('should create a task and return it', async () => {
      mockTasksService.create.mockResolvedValue(mockTask);

      const result = await controller.create(createTaskDto);

      expect(result).toEqual(mockTask);
      expect(mockTasksService.create).toHaveBeenCalledWith(createTaskDto);
    });

    it('should pass the DTO to the service', async () => {
      mockTasksService.create.mockResolvedValue(mockTask);

      await controller.create(createTaskDto);

      expect(mockTasksService.create).toHaveBeenCalledWith(createTaskDto);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Service error');
      mockTasksService.create.mockRejectedValue(error);

      await expect(controller.create(createTaskDto)).rejects.toThrow(error);
    });
  });

  describe('complete', () => {
    it('should call service.completeTask with parsed id', async () => {
      mockTasksService.completeTask.mockResolvedValue(undefined);

      await controller.complete(1);

      expect(mockTasksService.completeTask).toHaveBeenCalledWith(1);
    });

    it('should return 204 No Content on success', async () => {
      mockTasksService.completeTask.mockResolvedValue(undefined);

      const result = await controller.complete(1);

      expect(result).toBeUndefined();
    });

    it('should handle 404 when service throws NotFoundException', async () => {
      mockTasksService.completeTask.mockRejectedValue(
        new NotFoundException('Task not found'),
      );

      await expect(controller.complete(999)).rejects.toThrow(NotFoundException);
    });

    it('should propagate InternalServerErrorException from service', async () => {
      const error = new InternalServerErrorException('Failed to complete task');
      mockTasksService.completeTask.mockRejectedValue(error);

      await expect(controller.complete(1)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
