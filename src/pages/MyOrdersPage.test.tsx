import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { fc, testProp } from '@fast-check/jest';
import MyOrdersPage from './MyOrdersPage';
import { AuthProvider } from '../contexts/AuthContext';
import { Order } from '../types';
import * as utils from '../utils';

// Mock the utils module
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  getOrdersForRole: jest.fn(),
  getServiceById: jest.fn(),
}));

const mockedUtils = utils as jest.Mocked<typeof utils>;

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

// Arbitrary generator for Order objects
const orderArbitrary = fc.record({
  id: fc.string({ minLength: 1 }),
  customerId: fc.string({ minLength: 1 }),
  serviceId: fc.string({ minLength: 1 }),
  status: fc.constantFrom('pending', 'confirmed', 'measuring', 'stitching', 'ready', 'delivered'),
  appointmentDate: fc.date(),
  createdAt: fc.date(),
  updatedAt: fc.date(),
  specialInstructions: fc.option(fc.string(), { nil: undefined }),
  measurements: fc.option(fc.record({
    bust: fc.integer({ min: 20, max: 50 }),
    waist: fc.integer({ min: 20, max: 50 }),
    hip: fc.integer({ min: 20, max: 50 }),
    sleeveLength: fc.integer({ min: 10, max: 30 }),
    totalLength: fc.integer({ min: 30, max: 60 })
  }), { nil: undefined })
}) as fc.Arbitrary<Order>;

// Arbitrary generator for Service objects
const serviceArbitrary = fc.record({
  id: fc.string({ minLength: 1 }),
  name: fc.string({ minLength: 1 }),
  description: fc.string(),
  category: fc.constantFrom('blouse', 'kurti', 'bridal'),
  pricing: fc.array(fc.record({
    type: fc.string({ minLength: 1 }),
    price: fc.integer({ min: 100, max: 10000 }),
    description: fc.string()
  }), { minLength: 1 }),
  estimatedDays: fc.integer({ min: 1, max: 30 }),
  requiresMeasurements: fc.boolean()
});

describe('MyOrdersPage Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Feature: dress-stitching-website, Property 11: Order display includes required information
  testProp('should display required order information (ID, Service, Status) for any valid order', [
    fc.array(orderArbitrary, { minLength: 1, maxLength: 10 }),
    fc.array(serviceArbitrary, { minLength: 1, maxLength: 5 })
  ], (orders, services) => {
    // Mock the utility functions
    mockedUtils.getOrdersForRole.mockReturnValue(orders);
    
    // Create a service lookup map
    const serviceMap = new Map(services.map(service => [service.id, service]));
    mockedUtils.getServiceById.mockImplementation((serviceId: string) => 
      serviceMap.get(serviceId) || services[0] // fallback to first service if not found
    );

    renderWithProviders(<MyOrdersPage />);

    // Verify that each order displays the required information
    orders.forEach((order) => {
      // Check that order ID is displayed (formatted as uppercase)
      const orderIdPattern = new RegExp(`Order #${order.id.split('-')[1]?.toUpperCase() || order.id.toUpperCase()}`, 'i');
      expect(screen.getByText(orderIdPattern)).toBeInTheDocument();

      // Check that service name is displayed
      const service = serviceMap.get(order.serviceId) || services[0];
      expect(screen.getByText(service.name)).toBeInTheDocument();

      // Check that status is displayed (capitalized)
      const statusRegex = new RegExp(order.status, 'i');
      expect(screen.getByText(statusRegex)).toBeInTheDocument();
    });
  });

  test('should handle empty order list gracefully', () => {
    // Mock empty order list
    mockedUtils.getOrdersForRole.mockReturnValue([]);

    renderWithProviders(<MyOrdersPage />);

    // Should display "No orders found" message
    expect(screen.getByText('No orders found')).toBeInTheDocument();
    expect(screen.getByText("You haven't placed any orders yet.")).toBeInTheDocument();
  });
});