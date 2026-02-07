import { render, screen, cleanup, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import userEvent from '@testing-library/user-event';
import StarChatbot from './StarChatbot';

// Mock useNavigate to track navigation calls
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('StarChatbot Property Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    // Ensure clean DOM state before each test
    cleanup();
  });

  afterEach(() => {
    cleanup();
  });

  // Property test for chatbot modal interaction
  // Feature: dress-stitching-website, Property 6: Star chatbot modal interaction
  it('clicking star chatbot button opens bottom-sheet modal', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (shouldRender) => {
        // Ensure clean state for each iteration
        cleanup();
        
        const user = userEvent.setup();
        
        render(
          <MemoryRouter>
            <StarChatbot testId="test-star-chatbot" />
          </MemoryRouter>
        );
        
        // Wait for component to mount and initialize
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 0));
        });
        
        // Initially, modal should not be visible
        expect(screen.queryByText('How can we help you?')).not.toBeInTheDocument();
        
        // Find and click the star chatbot button using testId
        const starButton = screen.getByTestId('test-star-chatbot-button');
        expect(starButton).toBeInTheDocument();
        
        // Wrap user interaction in act
        await act(async () => {
          await user.click(starButton);
        });
        
        // After clicking, modal should be visible
        expect(screen.getByText('How can we help you?')).toBeInTheDocument();
        expect(screen.getByText('Book Now')).toBeInTheDocument();
        expect(screen.getByText('Price Inquiry')).toBeInTheDocument();
        expect(screen.getByText('Talk to Tailor')).toBeInTheDocument();
        
        // Clean up after this iteration
        cleanup();
      }),
      { numRuns: 10 }
    );
  });

  // Property test for chatbot navigation behavior
  // Feature: dress-stitching-website, Property 7: Chatbot navigation behavior
  it('clicking "Book Now" in chatbot modal navigates to booking form', async () => {
    await fc.assert(
      fc.asyncProperty(fc.boolean(), async (shouldRender) => {
        // Ensure clean state for each iteration
        cleanup();
        
        const user = userEvent.setup();
        
        render(
          <MemoryRouter>
            <StarChatbot testId="test-star-chatbot-nav" />
          </MemoryRouter>
        );
        
        // Wait for component to mount and initialize
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 0));
        });
        
        // Open the modal first
        const starButton = screen.getByTestId('test-star-chatbot-nav-button');
        await act(async () => {
          await user.click(starButton);
        });
        
        // Find and click the "Book Now" button
        const bookNowButton = screen.getByTestId('test-star-chatbot-nav-book-now');
        expect(bookNowButton).toBeInTheDocument();
        
        await act(async () => {
          await user.click(bookNowButton);
        });
        
        // Verify navigation was called with '/book'
        expect(mockNavigate).toHaveBeenCalledWith('/book');
        
        // Modal should close after clicking
        expect(screen.queryByText('How can we help you?')).not.toBeInTheDocument();
        
        // Clean up after this iteration
        cleanup();
      }),
      { numRuns: 10 }
    );
  });

  // Property test for chatbot global accessibility
  // Feature: dress-stitching-website, Property 8: Star chatbot global accessibility
  it('star chatbot button is present and accessible on all routes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('/', '/login', '/call-us', '/my-orders', '/book', '/chat', '/account', '/admin/dashboard', '/admin/orders', '/admin/customers', '/admin/services'),
        (route: string) => {
          // Clean up before each iteration to ensure clean DOM state
          cleanup();
          
          render(
            <MemoryRouter initialEntries={[route]}>
              <StarChatbot testId={`test-star-chatbot-${route.replace(/\//g, '-')}`} />
            </MemoryRouter>
          );
          
          // Star chatbot button should be present on all routes using testId
          const starButton = screen.getByTestId(`test-star-chatbot-${route.replace(/\//g, '-')}-button`);
          expect(starButton).toBeInTheDocument();
          expect(starButton).toBeVisible();
          
          // Button should have proper styling for global accessibility
          expect(starButton).toHaveClass('fixed');
          expect(starButton).toHaveClass('z-50');
        }
      ),
      { numRuns: 10 }
    );
  });
});