import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { BottomNavigation, DesktopNavigation, AppLayout } from './index';
import { HomePage } from '../pages';

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe('Responsive Behavior Tests', () => {
  beforeEach(() => {
    // Reset matchMedia mock before each test
    delete (window as any).matchMedia;
  });

  describe('Bottom Navigation Responsive Behavior', () => {
    it('should render bottom navigation on mobile screens', () => {
      // Mock mobile screen (matches: false for md: breakpoint)
      mockMatchMedia(false);
      
      render(
        <TestWrapper>
          <BottomNavigation userRole="customer" />
        </TestWrapper>
      );

      // Bottom navigation should be present
      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('md:hidden');
    });

    it('should display correct navigation items for different user roles', () => {
      mockMatchMedia(false);
      
      const { rerender } = render(
        <TestWrapper>
          <BottomNavigation userRole="public" />
        </TestWrapper>
      );

      // Public user should see Home, Orders, Call Us, Account
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
      expect(screen.getByText('Call Us')).toBeInTheDocument();
      expect(screen.getByText('Account')).toBeInTheDocument();

      // Rerender with customer role
      rerender(
        <TestWrapper>
          <BottomNavigation userRole="customer" />
        </TestWrapper>
      );

      // Customer should see Home, My Orders, Book, Chat, Account
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('My Orders')).toBeInTheDocument();
      expect(screen.getByText('Book')).toBeInTheDocument();
      expect(screen.getByText('Chat')).toBeInTheDocument();
      expect(screen.getByText('Account')).toBeInTheDocument();

      // Rerender with admin role
      rerender(
        <TestWrapper>
          <BottomNavigation userRole="admin" />
        </TestWrapper>
      );

      // Admin should see Dashboard, Orders, Customers, Services
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
      expect(screen.getByText('Customers')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });
  });

  describe('Desktop Navigation Responsive Behavior', () => {
    it('should render desktop navigation with proper structure', () => {
      mockMatchMedia(true);
      
      render(
        <TestWrapper>
          <DesktopNavigation userRole="customer" />
        </TestWrapper>
      );

      // Desktop navigation should be present
      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();
      expect(nav).toHaveClass('hidden', 'md:block');

      // Should have brand/logo
      expect(screen.getByText('Stitching Center')).toBeInTheDocument();
    });

    it('should display navigation items horizontally for desktop', () => {
      mockMatchMedia(true);
      
      render(
        <TestWrapper>
          <DesktopNavigation userRole="customer" />
        </TestWrapper>
      );

      // Navigation items should be present
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('My Orders')).toBeInTheDocument();
      expect(screen.getByText('Book')).toBeInTheDocument();
      expect(screen.getByText('Chat')).toBeInTheDocument();
      expect(screen.getByText('Account')).toBeInTheDocument();
    });
  });

  describe('Homepage Responsive Layout', () => {
    it('should render homepage with responsive grid layout', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Hero section should be present
      expect(screen.getByText('Welcome to Our Stitching Center')).toBeInTheDocument();
      expect(screen.getByText('Book Appointment')).toBeInTheDocument();

      // How it Works section should be present
      expect(screen.getByText('How it Works')).toBeInTheDocument();
      expect(screen.getByText('Choose Style')).toBeInTheDocument();
      expect(screen.getByText('Get Measured')).toBeInTheDocument();
      expect(screen.getByText('Doorstep Delivery')).toBeInTheDocument();

      // Services section should be present
      expect(screen.getByText('Our Services')).toBeInTheDocument();
      expect(screen.getByText('Blouse Stitching')).toBeInTheDocument();
      expect(screen.getByText('Kurti Stitching')).toBeInTheDocument();
      expect(screen.getByText('Bridal Wear')).toBeInTheDocument();
    });

    it('should have proper responsive classes for different screen sizes', () => {
      const { container } = render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );

      // Check for responsive grid classes in services section
      const servicesGrid = container.querySelector('.grid');
      expect(servicesGrid).toHaveClass('grid-cols-1', 'md:grid-cols-3');

      // Check for responsive padding classes
      const sections = container.querySelectorAll('section');
      sections.forEach(section => {
        expect(section).toHaveClass('px-4');
      });
    });
  });

  describe('AppLayout Responsive Behavior', () => {
    it('should apply responsive container classes', () => {
      const { container } = render(
        <TestWrapper>
          <AppLayout>
            <div>Test Content</div>
          </AppLayout>
        </TestWrapper>
      );

      // Main content should have responsive max-width classes
      const main = container.querySelector('main');
      expect(main).toHaveClass('md:max-w-4xl', 'md:mx-auto', 'lg:max-w-6xl');

      // Should have responsive padding
      const contentDiv = main?.querySelector('div');
      expect(contentDiv).toHaveClass('md:px-6', 'lg:px-8');
    });

    it('should include both mobile and desktop navigation', () => {
      render(
        <TestWrapper>
          <AppLayout>
            <div>Test Content</div>
          </AppLayout>
        </TestWrapper>
      );

      // Should have both navigation types
      const navElements = screen.getAllByRole('navigation', { name: /main navigation/i });
      expect(navElements).toHaveLength(2); // Bottom nav + Desktop nav
    });
  });

  describe('Touch Interaction Support', () => {
    it('should have proper touch target sizes for interactive elements', () => {
      const { container } = render(
        <TestWrapper>
          <BottomNavigation userRole="customer" />
        </TestWrapper>
      );

      // All navigation buttons should have min-h-[48px] class
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('min-h-[48px]');
      });
    });

    it('should have focus states for keyboard navigation', () => {
      const { container } = render(
        <TestWrapper>
          <BottomNavigation userRole="customer" />
        </TestWrapper>
      );

      // Buttons should have focus styles
      const buttons = container.querySelectorAll('button');
      buttons.forEach(button => {
        const classes = button.className;
        // Should have transition classes for smooth focus states
        expect(classes).toContain('transition-colors');
      });
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA labels and roles', () => {
      render(
        <TestWrapper>
          <BottomNavigation userRole="customer" />
        </TestWrapper>
      );

      // Navigation should have proper role and aria-label
      const nav = screen.getByRole('navigation', { name: /main navigation/i });
      expect(nav).toBeInTheDocument();

      // Buttons should have aria-labels
      const homeButton = screen.getByLabelText('Home');
      expect(homeButton).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(
        <TestWrapper>
          <BottomNavigation userRole="customer" />
        </TestWrapper>
      );

      // All buttons should be focusable
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });
});