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

// Helper function to login as customer
const loginAsCustomer = async () => {
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

  // Wait for login to complete
  await waitFor(() => {
    expect(screen.getAllByLabelText('My Orders')).toHaveLength(2); // Desktop + Mobile
  });
};

describe('Customer Flow Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('Customer can complete booking flow from homepage', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Login as customer
    await loginAsCustomer();

    // Click Book Appointment button on homepage (use aria-label)
    const bookButton = screen.getByLabelText('Book an appointment for dress stitching');
    fireEvent.click(bookButton);

    // Should navigate to booking page
    await waitFor(() => {
      expect(screen.getByText('Book Appointment')).toBeInTheDocument();
      expect(screen.getByText('Step 1 of 2')).toBeInTheDocument();
    });

    // Fill in Step 1 - Service and Date
    const serviceSelect = screen.getByLabelText('Select Service *');
    const dateInput = screen.getByLabelText('Appointment Date *');
    
    fireEvent.change(serviceSelect, { target: { value: '1' } });
    
    // Set appointment date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    fireEvent.change(dateInput, { target: { value: tomorrowString } });

    // Click Next
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    // Should move to Step 2
    await waitFor(() => {
      expect(screen.getByText('Step 2 of 2')).toBeInTheDocument();
      expect(screen.getByText('Measurement Option *')).toBeInTheDocument();
    });

    // Select "Measure at Shop"
    const measureAtShopButton = screen.getByText('Measure at Shop');
    fireEvent.click(measureAtShopButton);

    // Submit booking
    const submitButton = screen.getByText('Submit Booking');
    fireEvent.click(submitButton);

    // Should show success message
    await waitFor(() => {
      // Note: This would typically show a success message or redirect
      // For now, we'll check that the form was submitted
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('Customer can complete booking with custom measurements', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Login as customer
    await loginAsCustomer();

    // Navigate to booking page via bottom navigation (use the mobile version)
    const bookButtons = screen.getAllByLabelText('Book');
    const mobileBookButton = bookButtons.find(button => 
      button.className.includes('flex-col') // Mobile navigation has flex-col class
    ) || bookButtons[0]; // Fallback to first button
    
    fireEvent.click(mobileBookButton);

    await waitFor(() => {
      expect(screen.getByText('Book Appointment')).toBeInTheDocument();
    });

    // Fill in Step 1
    const serviceSelect = screen.getByLabelText('Select Service *');
    const dateInput = screen.getByLabelText('Appointment Date *');
    
    fireEvent.change(serviceSelect, { target: { value: '2' } }); // Kurti
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    fireEvent.change(dateInput, { target: { value: tomorrowString } });

    // Click Next
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Step 2 of 2')).toBeInTheDocument();
    });

    // Select "Enter My Own"
    const enterMyOwnButton = screen.getByText('Enter My Own');
    fireEvent.click(enterMyOwnButton);

    // Fill in measurements
    await waitFor(() => {
      expect(screen.getByText('Enter Your Measurements')).toBeInTheDocument();
    });

    const bustInput = screen.getByLabelText('Bust *');
    const waistInput = screen.getByLabelText('Waist *');
    const hipInput = screen.getByLabelText('Hip *');
    const sleeveInput = screen.getByLabelText('Sleeve Length *');
    const lengthInput = screen.getByLabelText('Total Length *');

    fireEvent.change(bustInput, { target: { value: '34' } });
    fireEvent.change(waistInput, { target: { value: '28' } });
    fireEvent.change(hipInput, { target: { value: '36' } });
    fireEvent.change(sleeveInput, { target: { value: '18' } });
    fireEvent.change(lengthInput, { target: { value: '42' } });

    // Submit booking
    const submitButton = screen.getByText('Submit Booking');
    fireEvent.click(submitButton);

    // Should show submitting state
    await waitFor(() => {
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
    });
  });

  test('Customer can view their orders', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Login as customer
    await loginAsCustomer();

    // Navigate to My Orders (use the mobile version)
    const myOrdersButtons = screen.getAllByLabelText('My Orders');
    const mobileMyOrdersButton = myOrdersButtons.find(button => 
      button.className.includes('flex-col') // Mobile navigation has flex-col class
    ) || myOrdersButtons[0]; // Fallback to first button
    
    fireEvent.click(mobileMyOrdersButton);

    // Should show orders page with loading state first
    await waitFor(() => {
      expect(screen.getAllByText('My Orders')).toHaveLength(2); // Navigation + Page title
      expect(screen.getByText('Loading your orders...')).toBeInTheDocument();
    });

    // Should show orders after loading
    await waitFor(() => {
      expect(screen.getByText('Order #001')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('Customer can access chat support', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Login as customer
    await loginAsCustomer();

    // Navigate to Chat (use the mobile version)
    const chatButtons = screen.getAllByLabelText('Chat');
    const mobileChatButton = chatButtons.find(button => 
      button.className.includes('flex-col') // Mobile navigation has flex-col class
    ) || chatButtons[0]; // Fallback to first button
    
    fireEvent.click(mobileChatButton);

    // Should show chat page
    await waitFor(() => {
      expect(screen.getByText('Chat Support')).toBeInTheDocument();
      expect(screen.getByText('Hello! Welcome to our stitching center. How can I help you today?')).toBeInTheDocument();
    });

    // Test sending a message
    const messageInput = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: '' }); // Send button with icon

    fireEvent.change(messageInput, { target: { value: 'Hello, I need help with my order' } });
    fireEvent.click(sendButton);

    // Should show the sent message
    await waitFor(() => {
      expect(screen.getByText('Hello, I need help with my order')).toBeInTheDocument();
    });
  });

  test('Customer can use star chatbot to navigate to booking', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Login as customer
    await loginAsCustomer();

    // Click star chatbot
    const starButton = screen.getByLabelText('Open chat options');
    fireEvent.click(starButton);

    await waitFor(() => {
      expect(screen.getByText('How can we help you?')).toBeInTheDocument();
    });

    // Click "Book Now"
    const bookNowButton = screen.getByText('Book Now');
    fireEvent.click(bookNowButton);

    // Should navigate to booking page
    await waitFor(() => {
      expect(screen.getByText('Book Appointment')).toBeInTheDocument();
      expect(screen.getByText('Step 1 of 2')).toBeInTheDocument();
    });
  });

  test('Customer can access account page and logout', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Login as customer
    await loginAsCustomer();

    // Navigate to Account (use the mobile version)
    const accountButtons = screen.getAllByLabelText('Account');
    const mobileAccountButton = accountButtons.find(button => 
      button.className.includes('flex-col') // Mobile navigation has flex-col class
    ) || accountButtons[0]; // Fallback to first button
    
    fireEvent.click(mobileAccountButton);

    // Should show account page
    await waitFor(() => {
      expect(screen.getByText('Jane Customer')).toBeInTheDocument();
      expect(screen.getByText('customer Account')).toBeInTheDocument(); // Note: lowercase 'customer'
    });

    // Test logout
    const logoutButton = screen.getByText('Sign Out');
    fireEvent.click(logoutButton);

    // Should redirect to homepage with public navigation
    await waitFor(() => {
      expect(screen.getByText('Welcome to Our Stitching Center')).toBeInTheDocument();
      expect(screen.getAllByLabelText('Orders')).toHaveLength(2); // Public navigation (desktop + mobile)
    });
  });

  test('Booking form validation works correctly', async () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );

    // Login as customer
    await loginAsCustomer();

    // Navigate to booking (use the mobile version)
    const bookButtons = screen.getAllByLabelText('Book');
    const mobileBookButton = bookButtons.find(button => 
      button.className.includes('flex-col') // Mobile navigation has flex-col class
    ) || bookButtons[0]; // Fallback to first button
    
    fireEvent.click(mobileBookButton);

    await waitFor(() => {
      expect(screen.getByText('Book Appointment')).toBeInTheDocument();
    });

    // Try to proceed without filling required fields
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText('Please select a service')).toBeInTheDocument();
      expect(screen.getByText('Please select an appointment date')).toBeInTheDocument();
    });
  });
});