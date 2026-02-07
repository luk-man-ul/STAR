import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Helper function to render App with routing
const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

describe('App Routing', () => {
  it('renders HomePage on root path', () => {
    renderWithRouter(['/']);
    expect(screen.getByText('Welcome to Our Stitching Center')).toBeInTheDocument();
  });

  it('renders LoginPage on /login path', () => {
    renderWithRouter(['/login']);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  });

  it('renders MyOrdersPage on /my-orders path', () => {
    renderWithRouter(['/my-orders']);
    expect(screen.getByText('My Orders')).toBeInTheDocument();
  });

  it('renders BookingPage on /book path', () => {
    renderWithRouter(['/book']);
    expect(screen.getByText('Book Appointment')).toBeInTheDocument();
  });

  it('renders AccountPage on /account path', () => {
    renderWithRouter(['/account']);
    expect(screen.getByRole('heading', { name: 'Account' })).toBeInTheDocument();
  });

  it('renders AdminDashboardPage on /admin/dashboard path', () => {
    renderWithRouter(['/admin/dashboard']);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('renders AdminOrdersPage on /admin/orders path', () => {
    renderWithRouter(['/admin/orders']);
    expect(screen.getByText('All Orders')).toBeInTheDocument();
  });

  it('renders CustomersPage on /admin/customers path', () => {
    renderWithRouter(['/admin/customers']);
    expect(screen.getByText('Customers')).toBeInTheDocument();
  });

  it('renders ServicesPage on /admin/services path', () => {
    renderWithRouter(['/admin/services']);
    expect(screen.getByText('Services')).toBeInTheDocument();
  });

  it('renders CallUsPage on /call-us path', () => {
    renderWithRouter(['/call-us']);
    expect(screen.getByRole('heading', { name: 'Call Us' })).toBeInTheDocument();
  });

  it('renders ChatPage on /chat path', () => {
    renderWithRouter(['/chat']);
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  it('renders NotFoundPage for invalid routes', () => {
    renderWithRouter(['/invalid-route']);
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
    expect(screen.getByText("The page you're looking for doesn't exist.")).toBeInTheDocument();
  });

  it('includes AppLayout wrapper with role context', () => {
    renderWithRouter(['/']);
    // Check that the main content area exists (from AppLayout)
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('pb-20');
  });

  it('includes development role switcher in development mode', () => {
    // Mock NODE_ENV for this test
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    renderWithRouter(['/']);
    expect(screen.getByText('Dev Role Switcher')).toBeInTheDocument();
    
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });
});