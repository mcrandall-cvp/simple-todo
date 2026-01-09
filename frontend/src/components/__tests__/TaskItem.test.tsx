import { render, screen } from '@testing-library/react';
import TaskItem from '../TaskItem';
import { Task } from '@/lib/types';

describe('TaskItem', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    position: 0,
    createdAt: new Date('2026-01-09T12:00:00Z'),
  };

  it('renders task title', () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('has correct listitem role', () => {
    render(<TaskItem task={mockTask} />);

    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('renders completion circle', () => {
    const { container } = render(<TaskItem task={mockTask} />);

    const circle = container.querySelector('[aria-hidden="true"]');
    expect(circle).toBeInTheDocument();
    expect(circle).toHaveClass('rounded-full');
  });

  it('renders with long title', () => {
    const longTitleTask: Task = {
      ...mockTask,
      title: 'This is a very long task title that should be displayed correctly',
    };

    render(<TaskItem task={longTitleTask} />);

    expect(
      screen.getByText(
        'This is a very long task title that should be displayed correctly'
      )
    ).toBeInTheDocument();
  });

  it('has truncate class for long text overflow', () => {
    const { container } = render(<TaskItem task={mockTask} />);

    const titleSpan = container.querySelector('.truncate');
    expect(titleSpan).toBeInTheDocument();
  });

  it('accepts onComplete prop without error', () => {
    const mockOnComplete = jest.fn();

    // Should render without throwing, even though onComplete is not used yet
    expect(() =>
      render(<TaskItem task={mockTask} onComplete={mockOnComplete} />)
    ).not.toThrow();
  });

  it('renders different task ids correctly', () => {
    const task1: Task = { ...mockTask, id: 1, title: 'Task 1' };
    const task2: Task = { ...mockTask, id: 2, title: 'Task 2' };

    const { rerender } = render(<TaskItem task={task1} />);
    expect(screen.getByText('Task 1')).toBeInTheDocument();

    rerender(<TaskItem task={task2} />);
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
});
