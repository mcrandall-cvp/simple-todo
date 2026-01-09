import { render, screen } from '@testing-library/react';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  // AC2: EmptyState Content - Heading
  it('renders heading "No tasks yet"', () => {
    render(<EmptyState />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'No tasks yet'
    );
  });

  // AC2: EmptyState Content - Body text
  it('renders body text "Add your first task below"', () => {
    render(<EmptyState />);

    expect(screen.getByText('Add your first task below')).toBeInTheDocument();
  });

  // AC4: Accessibility - aria-live="polite"
  it('has aria-live="polite" for screen reader announcements', () => {
    render(<EmptyState />);

    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-live', 'polite');
  });

  // AC4: Accessibility - role="status"
  it('has role="status" for status message region', () => {
    render(<EmptyState />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  // AC3: EmptyState Styling - Heading typography
  it('applies correct heading styles (text-lg, font-medium, text-gray-900)', () => {
    render(<EmptyState />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('text-lg');
    expect(heading).toHaveClass('font-medium');
    expect(heading).toHaveClass('text-gray-900');
  });

  // AC3: EmptyState Styling - Body typography
  it('applies correct body styles (text-base, text-gray-500)', () => {
    render(<EmptyState />);

    const body = screen.getByText('Add your first task below');
    expect(body).toHaveClass('text-base');
    expect(body).toHaveClass('text-gray-500');
  });

  // AC2: EmptyState Content - Centered text
  it('has text-center class for centered text alignment', () => {
    render(<EmptyState />);

    const container = screen.getByRole('status');
    expect(container).toHaveClass('text-center');
  });

  // Accessibility: motion-reduce preference
  it('has motion-reduce:transition-none for accessibility', () => {
    render(<EmptyState />);

    const container = screen.getByRole('status');
    expect(container).toHaveClass('motion-reduce:transition-none');
  });

  // AC3: Container max-width and centering
  it('has correct container classes (max-w-[512px], mx-auto, bg-white)', () => {
    render(<EmptyState />);

    const container = screen.getByRole('status');
    expect(container).toHaveClass('max-w-[512px]');
    expect(container).toHaveClass('mx-auto');
    expect(container).toHaveClass('bg-white');
  });

  // AC3: Vertical centering
  it('has flex centering classes for vertical alignment', () => {
    render(<EmptyState />);

    const container = screen.getByRole('status');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('flex-col');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('justify-center');
  });
});
