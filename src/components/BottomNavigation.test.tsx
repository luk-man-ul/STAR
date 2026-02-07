import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { fc, testProp } from '@fast-check/jest';
import userEvent from '@testing-library/user-event';
import BottomNavigation from './BottomNavigation';
import { UserRole } from '../types';

// Mock useNavigate to track navigation calls
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/' }),
}));

// Property test for bottom navigation displaying correct items for user role
// Feature: dress-stitching-website, Property 3: Bottom navigation displays correct items for user role
describe('BottomNavigation Property Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  testProp(
    'displays correct navigation items for each user role',
    [fc.constantFrom('public', 'customer', 'admin')],
    (userRole: UserRole) => {
      const { container } = render(
        <MemoryRouter>
          <BottomNavigation userRole={userRole} />
        </MemoryRouter>
      );
      
      // Define expected navigation items for each role
      const expectedItems = {
        public: ['Home', 'Orders', 'Call Us', 'Account'],
        customer: ['Home', 'My Orders', 'Book', 'Chat', 'Account'],
        admin: ['Dashboard', 'Orders', 'Customers', 'Services']
      };
      
      const expectedLabels = expectedItems[userRole];
      
      // Verify all expected items are present within this container
      expectedLabels.forEach(label => {
        const elements = screen.getAllByText(label);
        // Filter to only elements within our container
        const elementsInContainer = elements.filter(el => container.contains(el));
        expect(elementsInContainer).toHaveLength(1);
      });
      
      // Verify no unexpected items are present in this container
      const allPossibleLabels = [
        'Home', 'Orders', 'Call Us', 'Account', 
        'My Orders', 'Book', 'Chat', 
        'Dashboard', 'Customers', 'Services'
      ];
      
      const unexpectedLabels = allPossibleLabels.filter(
        label => !expectedLabels.includes(label)
      );
      
      unexpectedLabels.forEach(label => {
        const elements = screen.queryAllByText(label);
        const elementsInContainer = elements.filter(el => container.contains(el));
        expect(elementsInContainer).toHaveLength(0);
      });
      
      // Verify correct number of navigation items in this container
      const allButtons = screen.getAllByRole('button');
      const buttonsInContainer = allButtons.filter(button => container.contains(button));
      expect(buttonsInContainer).toHaveLength(expectedLabels.length);
    },
    { numRuns: 100 }
  );

  // Property test for authentication redirects
  // Feature: dress-stitching-website, Property 4: Unauthenticated users redirect to login for protected features
  testProp(
    'redirects unauthenticated users to login for protected features',
    [fc.constant('public')],
    async (userRole: UserRole) => {
      const user = userEvent.setup();
      const { container } = render(
        <MemoryRouter>
          <BottomNavigation userRole={userRole} />
        </MemoryRouter>
      );
      
      // Find the Orders button within this container
      const allOrdersButtons = screen.getAllByText('Orders');
      const ordersButtonsInContainer = allOrdersButtons.filter(button => container.contains(button));
      expect(ordersButtonsInContainer).toHaveLength(1);
      const ordersButton = ordersButtonsInContainer[0];
      
      // Click the Orders button
      await user.click(ordersButton);
      
      // Verify that navigate was called with '/login'
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    },
    { numRuns: 100 }
  );
});