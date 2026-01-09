import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTaskDto } from './create-task.dto';

describe('CreateTaskDto', () => {
  const createDto = (data: Record<string, unknown>): CreateTaskDto => {
    return plainToInstance(CreateTaskDto, data);
  };

  it('should pass validation with valid title', async () => {
    const dto = createDto({ title: 'Valid task title' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation with minimum length title', async () => {
    const dto = createDto({ title: 'A' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass validation with maximum length title', async () => {
    const dto = createDto({ title: 'A'.repeat(500) });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with empty title', async () => {
    const dto = createDto({ title: '' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail validation with title over 500 characters', async () => {
    const dto = createDto({ title: 'A'.repeat(501) });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail validation with non-string title', async () => {
    const dto = createDto({ title: 123 });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail validation with null title', async () => {
    const dto = createDto({ title: null });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });

  it('should fail validation with undefined title', async () => {
    const dto = createDto({});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('title');
  });
});
