import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from './ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText("We're sorry, but something unexpected happened.")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('resets error state when try again button is clicked', async () => {
    const user = userEvent.setup();
    
    // Create a component that can toggle between throwing and not throwing
    let shouldThrow = true;
    const ToggleError = () => {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>No error</div>;
    };
    
    const { rerender } = render(
      <ErrorBoundary>
        <ToggleError />
      </ErrorBoundary>
    );
    
    // Error UI should be visible
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Change the component to not throw
    shouldThrow = false;
    
    // Click try again button
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    
    // Re-render with the same component (now not throwing)
    rerender(
      <ErrorBoundary>
        <ToggleError />
      </ErrorBoundary>
    );
    
    // Should show normal content
    expect(screen.getByText('No error')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('applies correct styling to error UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    const container = screen.getByText('Something went wrong').closest('div');
    expect(container?.parentElement).toHaveClass('min-h-screen', 'bg-primary-50', 'flex', 'items-center', 'justify-center', 'p-4');
  });
});