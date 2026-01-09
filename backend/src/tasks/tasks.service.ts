import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    try {
      return await this.prisma.task.findMany({
        orderBy: { position: 'asc' },
      });
    } catch (error) {
      this.logger.error('Failed to retrieve tasks', error);
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      // Use transaction to prevent race condition on position assignment
      // The position index ensures efficient max() query
      return await this.prisma.$transaction(async (tx) => {
        const maxPosition = await tx.task.aggregate({
          _max: { position: true },
        });
        const newPosition = (maxPosition._max.position ?? -1) + 1;

        return tx.task.create({
          data: {
            title: createTaskDto.title,
            position: newPosition,
          },
        });
      });
    } catch (error) {
      this.logger.error('Failed to create task', error);
      throw new InternalServerErrorException('Failed to create task');
    }
  }

  async completeTask(id: number): Promise<void> {
    try {
      await this.prisma.task.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Task with ID ${id} not found`);
      }
      this.logger.error(`Failed to complete task ${id}`, error);
      throw new InternalServerErrorException('Failed to complete task');
    }
  }
}
