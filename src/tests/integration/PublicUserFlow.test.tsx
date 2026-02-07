import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import App from '../../App';

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Public User Flow Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('Public user can browse homepage and view services', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Check homepage loads
    expect(screen.getByText('Welcome to Our Stitching Center')).toBeInTheDocument();
    expect(screen.getByText('How it Works')).toBeInTheDocument();
    expect(screen.getByText('Our Services')).toBeInTheDocument();

    // Check service cards are displayed
    expect(screen.getByText('Blouse Stitching')).toBeInTheDocument();
    expect(screen.getByText('Kurti Stitching')).toBeInTheDocument();
    expect(screen.getByText('Bridal Wear')).toBeInTheDocument();

    // Test service card accordion
    const viewPriceButton = screen.getAllByText('View Price')[0];
    fireEvent.click(viewPriceButton);
    
    // Should show pricing information
    await waitFor(() => {
      expect(screen.getByText('Simple Blouse')).toBeInTheDocument();
    });
  });

  test('Public user navigation shows correct items', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Check bottom navigation for public user (use getAllByLabelText to handle responsive design)
    expect(screen.getAllByLabelText('Home')).toHaveLength(2); // Desktop + Mobile
    expect(screen.getAllByLabelText('Orders')).toHaveLength(2); // Desktop + Mobile
    expect(screen.getAllByLabelText('Call Us')).toHaveLength(2); // Desktop + Mobile
    expect(screen.getAllByLabelText('Account')).toHaveLength(2); // Desktop + Mobile
  });

  test('Public user clicking Orders redirects to login', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Click on Orders in bottom navigation (use the mobile version which is more reliable)
    const ordersButtons = screen.getAllByLabelText('Orders');
    const mobileOrdersButton = ordersButtons.find(button => 
      button.className.includes('flex-col') // Mobile navigation has flex-col class
    ) || ordersButtons[0]; // Fallback to first button
    
    fireEvent.click(mobileOrdersButton);

    // Should redirect to login page
    await waitFor(() => {
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });
  });

  test('Public user can access Call Us page', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Click on Call Us in bottom navigation (use the mobile version)
    const callUsButtons = screen.getAllByLabelText('Call Us');
    const mobileCallUsButton = callUsButtons.find(button => 
      button.className.includes('flex-col') // Mobile navigation has flex-col class
    ) || callUsButtons[0]; // Fallback to first button
    
    fireEvent.click(mobileCallUsButton);

    // Should navigate to Call Us page
    await waitFor(() => {
      expect(screen.getByText('Get in Touch')).toBeInTheDocument();
      expect(screen.getAllByText('Call Us')).toHaveLength(3); // Navigation (desktop + mobile) + Page content
      expect(screen.getByText('WhatsApp')).toBeInTheDocument();
    });
  });

  test('Star chatbot is accessible and functional', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Find and click star chatbot button
    const starButton = screen.getByLabelText('Open chat options');
    expect(starButton).toBeInTheDocument();
    
    fireEvent.click(starButton);

    // Should open modal with options
    await waitFor(() => {
      expect(screen.getByText('How can we help you?')).toBeInTheDocument();
      expect(screen.getByText('Book Now')).toBeInTheDocument();
      expect(screen.getByText('Price Inquiry')).toBeInTheDocument();
      expect(screen.getByText('Talk to Tailor')).toBeInTheDocument();
    });
  });

  test('Complete login flow for customer', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Navigate to login page (use the mobile version)
    const accountButtons = screen.getAllByLabelText('Account');
    const mobileAccountButton = accountButtons.find(button => 
      button.className.includes('flex-col') // Mobile navigation has flex-col class
    ) || accountButtons[0]; // Fallback to first button
    
    fireEvent.click(mobileAccountButton);

    await waitFor(() => {
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    // Fill in login form
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'customer@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(signInButton);

    // Should redirect to homepage with customer navigation
    await waitFor(() => {
      // Customer navigation should now be visible (check for multiple elements)
      expect(screen.getAllByLabelText('My Orders')).toHaveLength(2); // Desktop + Mobile
      expect(screen.getAllByLabelText('Book')).toHaveLength(2); // Desktop + Mobile
      expect(screen.getAllByLabelText('Chat')).toHaveLength(2); // Desktop + Mobile
    });

    // Verify we're no longer on the login page
    expect(screen.queryByText('Welcome Back')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign in to your account')).not.toBeInTheDocument();
  });

  test('Complete login flow for admin', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Navigate to login page (use the mobile version)
    const accountButtons = screen.getAllByLabelText('Account');
    const mobileAccountButton = accountButtons.find(button => 
      button.className.includes('flex-col') // Mobile navigation has flex-col class
    ) || accountButtons[0]; // Fallback to first button
    
    fireEvent.click(mobileAccountButton);

    await waitFor(() => {
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    // Fill in login form with admin credentials
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(signInButton);

    // Should redirect to admin dashboard
    await waitFor(() => {
      // Admin navigation should be visible (check for multiple elements)
      expect(screen.getAllByLabelText('Dashboard')).toHaveLength(2); // Desktop + Mobile
      expect(screen.getAllByLabelText('Orders')).toHaveLength(2); // Desktop + Mobile
      expect(screen.getAllByLabelText('Customers')).toHaveLength(2); // Desktop + Mobile
      expect(screen.getAllByLabelText('Services')).toHaveLength(2); // Desktop + Mobile
    });
  });

  test('Invalid login shows error message', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Navigate to login page (use the mobile version)
    const accountButtons = screen.getAllByLabelText('Account');
    const mobileAccountButton = accountButtons.find(button => 
      button.className.includes('flex-col') // Mobile navigation has flex-col class
    ) || accountButtons[0]; // Fallback to first button
    
    fireEvent.click(mobileAccountButton);

    await waitFor(() => {
      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    // Fill in login form with invalid credentials
    const emailInput = screen.getByLabelText('Email Address');
    const passwordInput = screen.getByLabelText('Password');
    const signInButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(signInButton);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});