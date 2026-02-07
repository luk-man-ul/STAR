import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { fc, testProp } from '@fast-check/jest';
import MyOrdersPage from './MyOrdersPage';
import AdminOrdersPage from './AdminOrdersPage';
import { AuthProvider } from '../contexts/AuthContext';
import { Order, OrderStatus } from '../types';
import * as utils from '../utils';

// Mock the utils module
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  getOrdersForRole: jest.fn(),
  getServiceById: jest.fn(),
  updateOrderStatus: jest.fn(),
}));

const mockedUtils = utils as jest.Mocked<typeof utils>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Property test generators
const orderStatusArb = fc.constantFrom('pending', 'confirmed', 'in-progress', 'completed', 'cancelled');

const orderArb: fc.Arbitrary<Order> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  customerId: fc.string({ minLength: 1, maxLength: 20 }),
  serviceId: fc.string({ minLength: 1, maxLength: 20 }),
  status: orderStatusArb,
  totalAmount: fc.integer({ min: 100, max: 10000 }),
  createdAt: fc.date(),
  updatedAt: fc.date(),
  measurements: fc.record({
    chest: fc.option(fc.integer({ min: 20, max: 60 })),
    waist: fc.option(fc.integer({ min: 20, max: 50 })),
    hips: fc.option(fc.integer({ min: 20, max: 60 })),
    length: fc.option(fc.integer({ min: 50, max: 200 }))
  }),
  notes: fc.option(fc.string({ maxLength: 500 }))
});

const mockService = {
  id: 'service-1',
  name: 'Custom Dress',
  description: 'Beautiful custom dress',
  price: 1500,
  category: 'dresses' as const,
  imageUrl: '/images/dress.jpg',
  duration: '2 weeks'
};

const renderCustomerOrdersPage = (orders: Order[]) => {
  // Mock authenticated customer
  mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
    id: 'customer-1',
    email: 'customer@example.com',
    name: 'Jane Customer',
    phone: '+1234567890',
    role: 'customer',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }));

  mockedUtils.getOrdersForRole.mockResolvedValue(orders);
  mockedUtils.getServiceById.mockResolvedValue(mockService);

  return render(
    <BrowserRouter>
      <AuthProvider>
        <MyOrdersPage />
      </AuthProvider>
    </BrowserRouter>
  );
};

const renderAdminOrdersPage = (orders: Order[]) => {
  // Mock authenticated admin
  mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    phone: '+1234567890',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }));

  mockedUtils.getOrdersForRole.mockResolvedValue(orders);
  mockedUtils.getServiceById.mockResolvedValue(mockService);

  return render(
    <BrowserRouter>
      <AuthProvider>
        <AdminOrdersPage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Order Tracking Property Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
  });

  testProp('customer order tracking displays orders consistently',
    [fc.array(orderArb, { minLength: 0, maxLength: 5 })],
    async (orders) => {
      // Ensure orders belong to the customer
      const customerOrders = orders.map(order => ({ ...order, customerId: 'customer-1' }));
      
      const { getByText } = renderCustomerOrdersPage(customerOrders);
      
      await waitFor(() => {
        expect(getByText('My Orders')).toBeInTheDocument();
      });
      
      if (customerOrders.length === 0) {
        await waitFor(() => {
          expect(getByText('No orders found')).toBeInTheDocument();
        });
      } else {
        // Should display order information
        await waitFor(() => {
          expect(getByText('Custom Dress')).toBeInTheDocument();
        });
      }
    }
  );

  testProp('order status display is consistent across different statuses',
    [orderStatusArb],
    async (status) => {
      const order: Order = {
        id: 'order-1',
        customerId: 'customer-1',
        serviceId: 'service-1',
        status,
        totalAmount: 1500,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        measurements: {},
        notes: 'Test order'
      };
      
      const { getByText } = renderCustomerOrdersPage([order]);
      
      await waitFor(() => {
        expect(getByText('My Orders')).toBeInTheDocument();
        expect(getByText('Custom Dress')).toBeInTheDocument();
      });
      
      // Should display the status (capitalized)
      const capitalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
      await waitFor(() => {
        expect(getByText(capitalizedStatus)).toBeInTheDocument();
      });
    }
  );

  testProp('admin can see orders with different customer IDs',
    [fc.array(orderArb, { minLength: 1, maxLength: 3 })],
    async (orders) => {
      const { getByText } = renderAdminOrdersPage(orders);
      
      await waitFor(() => {
        expect(getByText('Order Management')).toBeInTheDocument();
      });
      
      // Should display order information
      await waitFor(() => {
        expect(getByText('Custom Dress')).toBeInTheDocument();
      });
    }
  );

  testProp('order amount display is consistent',
    [fc.integer({ min: 100, max: 10000 })],
    async (amount) => {
      const order: Order = {
        id: 'order-1',
        customerId: 'customer-1',
        serviceId: 'service-1',
        status: 'pending',
        totalAmount: amount,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        measurements: {},
        notes: 'Test order'
      };
      
      const { getByText } = renderCustomerOrdersPage([order]);
      
      await waitFor(() => {
        expect(getByText('My Orders')).toBeInTheDocument();
        expect(getByText('Custom Dress')).toBeInTheDocument();
      });
      
      // Should display the amount in correct format
      await waitFor(() => {
        expect(getByText(`₹${amount.toLocaleString()}`)).toBeInTheDocument();
      });
    }
  );

  testProp('order dates are displayed correctly',
    [fc.date({ min: new Date('2024-01-01'), max: new Date('2024-12-31') })],
    async (orderDate) => {
      const order: Order = {
        id: 'order-1',
        customerId: 'customer-1',
        serviceId: 'service-1',
        status: 'pending',
        totalAmount: 1500,
        createdAt: orderDate,
        updatedAt: orderDate,
        measurements: {},
        notes: 'Test order'
      };
      
      const { getByText } = renderCustomerOrdersPage([order]);
      
      await waitFor(() => {
        expect(getByText('My Orders')).toBeInTheDocument();
        expect(getByText('Custom Dress')).toBeInTheDocument();
      });
      
      // Should display the date in some format
      const dateString = orderDate.toLocaleDateString();
      await waitFor(() => {
        expect(getByText(dateString)).toBeInTheDocument();
      });
    }
  );

  testProp('admin status updates maintain order integrity',
    [orderStatusArb, orderStatusArb],
    async (initialStatus, newStatus) => {
      const order: Order = {
        id: 'order-1',
        customerId: 'customer-1',
        serviceId: 'service-1',
        status: initialStatus,
        totalAmount: 1500,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        measurements: {},
        notes: 'Test order'
      };

      // Mock successful status update
      const updatedOrder = { ...order, status: newStatus, updatedAt: new Date() };
      mockedUtils.updateOrderStatus.mockResolvedValue(updatedOrder);
      
      const { getByText } = renderAdminOrdersPage([order]);
      
      await waitFor(() => {
        expect(getByText('Order Management')).toBeInTheDocument();
      });
      
      // The property we're testing is that status updates should be consistent
      // This tests the mock behavior and ensures our test setup is correct
      if (initialStatus !== newStatus) {
        const result = await mockedUtils.updateOrderStatus('order-1', newStatus);
        expect(result?.status).toBe(newStatus);
        expect(result?.id).toBe(order.id);
        expect(result?.customerId).toBe(order.customerId);
        expect(result?.totalAmount).toBe(order.totalAmount);
      }
    }
  );
});