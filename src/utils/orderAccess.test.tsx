import { fc, testProp } from '@fast-check/jest';
import { getOrdersForRole, mockOrders } from './index';
import { Order, UserRole } from '../types';

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

// Arbitrary generator for UserRole
const userRoleArbitrary = fc.constantFrom('public', 'customer', 'admin') as fc.Arbitrary<UserRole>;

describe('Order Access Control Property Tests', () => {
  // Feature: dress-stitching-website, Property 12: Role-based order access control
  testProp('should enforce role-based order access control', [
    fc.array(orderArbitrary, { minLength: 0, maxLength: 20 }),
    userRoleArbitrary,
    fc.string({ minLength: 1 })
  ], (orders, userRole, userId) => {
    const result = getOrdersForRole(orders, userRole, userId);

    switch (userRole) {
      case 'public':
        // Public users should never see any orders
        expect(result).toHaveLength(0);
        break;

      case 'customer':
        // Customers should only see their own orders
        const expectedCustomerOrders = orders.filter(order => order.customerId === userId);
        expect(result).toHaveLength(expectedCustomerOrders.length);
        
        // Verify all returned orders belong to the customer
        result.forEach(order => {
          expect(order.customerId).toBe(userId);
        });
        
        // Verify no orders from other customers are included
        const otherCustomerOrders = orders.filter(order => order.customerId !== userId);
        otherCustomerOrders.forEach(order => {
          expect(result).not.toContainEqual(order);
        });
        break;

      case 'admin':
        // Admins should see all orders
        expect(result).toHaveLength(orders.length);
        expect(result).toEqual(orders);
        break;

      default:
        // Invalid roles should return empty array
        expect(result).toHaveLength(0);
        break;
    }
  });

  testProp('should handle customer role without userId', [
    fc.array(orderArbitrary, { minLength: 1, maxLength: 10 })
  ], (orders) => {
    // Customer role without userId should return empty array
    const result = getOrdersForRole(orders, 'customer');
    expect(result).toHaveLength(0);
  });

  testProp('should preserve order data integrity', [
    fc.array(orderArbitrary, { minLength: 1, maxLength: 10 }),
    fc.string({ minLength: 1 })
  ], (orders, userId) => {
    // Test with customer role to get filtered results
    const customerOrders = orders.filter(order => order.customerId === userId);
    
    if (customerOrders.length > 0) {
      const result = getOrdersForRole(orders, 'customer', userId);
      
      // Verify that returned orders maintain their original structure
      result.forEach(order => {
        const originalOrder = orders.find(o => o.id === order.id);
        expect(originalOrder).toBeDefined();
        expect(order).toEqual(originalOrder);
      });
    }
  });

  testProp('should be deterministic for same inputs', [
    fc.array(orderArbitrary, { minLength: 0, maxLength: 10 }),
    userRoleArbitrary,
    fc.string({ minLength: 1 })
  ], (orders, userRole, userId) => {
    // Multiple calls with same parameters should return identical results
    const result1 = getOrdersForRole(orders, userRole, userId);
    const result2 = getOrdersForRole(orders, userRole, userId);
    
    expect(result1).toEqual(result2);
  });
});