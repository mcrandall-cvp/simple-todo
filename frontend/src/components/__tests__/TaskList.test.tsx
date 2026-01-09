import { render, screen } from '@testing-library/react';
import TaskList from '../TaskList';
import { Task } from '@/lib/types';

describe('TaskList', () => {
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      position: 0,
      createdAt: new Date('2026-01-09T12:00:00Z'),
    },
    {
      id: 2,
      title: 'Task 2',
      position: 1,
      createdAt: new Date('2026-01-09T12:01:00Z'),
    },
    {
      id: 3,
      title: 'Task 3',
      position: 2,
      createdAt: new Date('2026-01-09T12:02:00Z'),
    },
  ];

  it('renders empty list when no tasks', () => {
    render(<TaskList tasks={[]} />);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('has correct list role', () => {
    render(<TaskList tasks={mockTasks} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<TaskList tasks={mockTasks} />);

    expect(screen.getByLabelText('Task list')).toBeInTheDocument();
  });

  it('renders all tasks', () => {
    render(<TaskList tasks={mockTasks} />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('renders correct number of list items', () => {
    render(<TaskList tasks={mockTasks} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('accepts onComplete prop without error', () => {
    const mockOnComplete = jest.fn();

    expect(() =>
      render(<TaskList tasks={mockTasks} onComplete={mockOnComplete} />)
    ).not.toThrow();
  });

  it('renders tasks in order', () => {
    render(<TaskList tasks={mockTasks} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveTextContent('Task 1');
    expect(listItems[1]).toHaveTextContent('Task 2');
    expect(listItems[2]).toHaveTextContent('Task 3');
  });

  it('renders single task correctly', () => {
    render(<TaskList tasks={[mockTasks[0]]} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('Task 1')).toBeInTheDocument();
  });
});
