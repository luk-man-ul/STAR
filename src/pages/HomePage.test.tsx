import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderHomePage = () => {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Hero Section', () => {
    it('renders hero section correctly', () => {
      renderHomePage();
      
      // Test hero heading
      expect(screen.getByRole('heading', { name: /welcome to our stitching center/i })).toBeInTheDocument();
      
      // Test hero description
      expect(screen.getByText(/custom dress stitching with perfect fit and timely delivery/i)).toBeInTheDocument();
      
      // Test Book Appointment button
      const bookButton = screen.getByRole('button', { name: /book appointment/i });
      expect(bookButton).toBeInTheDocument();
      
      // Test button navigation
      fireEvent.click(bookButton);
      expect(mockNavigate).toHaveBeenCalledWith('/booking');
    });
  });

  describe('How it Works Section', () => {
    it('displays three steps correctly', () => {
      renderHomePage();
      
      // Test section heading
      expect(screen.getByRole('heading', { name: /how it works/i })).toBeInTheDocument();
      
      // Test Step 1: Choose Style
      expect(screen.getByRole('heading', { name: /choose style/i })).toBeInTheDocument();
      expect(screen.getByText(/browse our collection and select your preferred dress style/i)).toBeInTheDocument();
      
      // Test Step 2: Get Measured
      expect(screen.getByRole('heading', { name: /get measured/i })).toBeInTheDocument();
      expect(screen.getByText(/visit our shop for precise measurements or provide your own/i)).toBeInTheDocument();
      
      // Test Step 3: Doorstep Delivery
      expect(screen.getByRole('heading', { name: /doorstep delivery/i })).toBeInTheDocument();
      expect(screen.getByText(/receive your perfectly stitched dress at your doorstep/i)).toBeInTheDocument();
    });
  });

  describe('Services Section', () => {
    it('displays service cards for Blouse, Kurti, and Bridal', () => {
      renderHomePage();
      
      // Test services section heading
      expect(screen.getByRole('heading', { name: /our services/i })).toBeInTheDocument();
      
      // Test Blouse service card
      expect(screen.getByRole('heading', { name: /blouse stitching/i })).toBeInTheDocument();
      expect(screen.getByText(/custom blouse stitching with perfect fit and elegant designs/i)).toBeInTheDocument();
      
      // Test Kurti service card
      expect(screen.getByRole('heading', { name: /kurti stitching/i })).toBeInTheDocument();
      expect(screen.getByText(/comfortable and stylish kurti designs for everyday wear/i)).toBeInTheDocument();
      
      // Test Bridal service card
      expect(screen.getByRole('heading', { name: /bridal wear/i })).toBeInTheDocument();
      expect(screen.getByText(/exquisite bridal outfits for your special day/i)).toBeInTheDocument();
      
      // Test that all service cards have "View Price" buttons
      const viewPriceButtons = screen.getAllByRole('button', { name: /view price/i });
      expect(viewPriceButtons).toHaveLength(3);
    });

    it('displays pricing information when accordion is expanded', () => {
      renderHomePage();
      
      // Get the first "View Price" button (Blouse service)
      const viewPriceButtons = screen.getAllByRole('button', { name: /view price/i });
      const blouseViewPriceButton = viewPriceButtons[0];
      
      // Initially, the button should show collapsed state
      expect(blouseViewPriceButton).toHaveAttribute('aria-expanded', 'false');
      
      // Click to expand accordion
      fireEvent.click(blouseViewPriceButton);
      
      // After clicking, the button should show expanded state
      expect(blouseViewPriceButton).toHaveAttribute('aria-expanded', 'true');
      
      // Now pricing should be visible - check for specific blouse pricing text
      expect(screen.getByText(/simple blouse/i)).toBeInTheDocument();
      expect(screen.getByText(/basic blouse with standard design/i)).toBeInTheDocument();
      
      // Check that pricing values are present (using getAllByText for multiple matches)
      const priceElements = screen.getAllByText(/₹\d+/);
      expect(priceElements.length).toBeGreaterThan(0);
      
      // Click again to collapse
      fireEvent.click(blouseViewPriceButton);
      
      // After second click, should be collapsed again
      expect(blouseViewPriceButton).toHaveAttribute('aria-expanded', 'false');
    });
  });
});