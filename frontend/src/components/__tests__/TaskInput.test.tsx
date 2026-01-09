import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskInput from '../TaskInput';

describe('TaskInput', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders input with placeholder', () => {
    render(<TaskInput onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Add a task...');
    expect(input).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<TaskInput onSubmit={mockOnSubmit} />);

    const input = screen.getByLabelText('Add a task');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('name', 'task-input');
  });

  it('auto-focuses on mount', () => {
    render(<TaskInput onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Add a task...');
    expect(input).toHaveFocus();
  });

  it('updates value on change', async () => {
    const user = userEvent.setup();
    render(<TaskInput onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Add a task...');
    await user.type(input, 'New task');

    expect(input).toHaveValue('New task');
  });

  it('calls onSubmit with trimmed value on Enter', async () => {
    const user = userEvent.setup();
    render(<TaskInput onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Add a task...');
    await user.type(input, '  Test task  {Enter}');

    expect(mockOnSubmit).toHaveBeenCalledWith('Test task');
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('clears input after successful submit', async () => {
    const user = userEvent.setup();
    render(<TaskInput onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Add a task...');
    await user.type(input, 'Test task{Enter}');

    expect(input).toHaveValue('');
  });

  it('does not call onSubmit if input is empty', async () => {
    const user = userEvent.setup();
    render(<TaskInput onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Add a task...');
    await user.type(input, '{Enter}');

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('does not call onSubmit if input is only whitespace', async () => {
    const user = userEvent.setup();
    render(<TaskInput onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Add a task...');
    await user.type(input, '   {Enter}');

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('clears input on Escape key', async () => {
    const user = userEvent.setup();
    render(<TaskInput onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Add a task...');
    await user.type(input, 'Test task');
    expect(input).toHaveValue('Test task');

    await user.keyboard('{Escape}');
    expect(input).toHaveValue('');
  });

  it('does not clear input on other keys', async () => {
    const user = userEvent.setup();
    render(<TaskInput onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText('Add a task...');
    await user.type(input, 'Test');

    expect(input).toHaveValue('Test');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
