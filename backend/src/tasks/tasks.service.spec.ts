import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;

  const mockPrismaService = {
    $transaction: jest.fn(),
    task: {
      aggregate: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    const fixedDate = new Date('2026-01-09T06:00:00.000Z');
    const mockTasks = [
      { id: 1, title: 'Task A', position: 0, createdAt: fixedDate },
      { id: 2, title: 'Task B', position: 1, createdAt: fixedDate },
    ];

    it('should return tasks ordered by position', async () => {
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);

      const result = await service.findAll();

      expect(result).toEqual(mockTasks);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        orderBy: { position: 'asc' },
      });
    });

    it('should return empty array when no tasks exist', async () => {
      mockPrismaService.task.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockPrismaService.task.findMany.mockRejectedValue(new Error('DB error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
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

    it('should create a task with position 0 when no tasks exist', async () => {
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          task: {
            aggregate: jest.fn().mockResolvedValue({ _max: { position: null } }),
            create: jest.fn().mockResolvedValue(mockTask),
          },
        };
        return callback(tx);
      });

      const result = await service.create(createTaskDto);

      expect(result).toEqual(mockTask);
      expect(mockPrismaService.$transaction).toHaveBeenCalled();
    });

    it('should create a task with next position when tasks exist', async () => {
      const taskWithPosition1 = { ...mockTask, position: 1 };
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          task: {
            aggregate: jest.fn().mockResolvedValue({ _max: { position: 0 } }),
            create: jest.fn().mockResolvedValue(taskWithPosition1),
          },
        };
        return callback(tx);
      });

      const result = await service.create(createTaskDto);

      expect(result.position).toBe(1);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockPrismaService.$transaction.mockRejectedValue(new Error('DB error'));

      await expect(service.create(createTaskDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should use transaction to prevent race conditions', async () => {
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        const tx = {
          task: {
            aggregate: jest.fn().mockResolvedValue({ _max: { position: null } }),
            create: jest.fn().mockResolvedValue(mockTask),
          },
        };
        return callback(tx);
      });

      await service.create(createTaskDto);

      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
    });
  });
});
