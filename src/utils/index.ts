import { User, Service, Order, Booking, CustomerMeasurements, OrderFilterOptions, UserRole } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'priya@example.com',
    name: 'Priya Sharma',
    phone: '+91-9876543210',
    role: 'customer',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'user-2',
    email: 'admin@dressstitching.com',
    name: 'Admin User',
    phone: '+91-9876543211',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-3',
    email: 'anita@example.com',
    name: 'Anita Patel',
    phone: '+91-9876543212',
    role: 'customer',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
];

// Mock Services
export const mockServices: Service[] = [
  {
    id: 'service-1',
    name: 'Blouse Stitching',
    description: 'Custom blouse stitching with perfect fit',
    category: 'blouse',
    pricing: [
      { type: 'Simple', price: 500, description: 'Basic blouse design' },
      { type: 'Designer', price: 800, description: 'Designer blouse with embellishments' }
    ],
    estimatedDays: 7,
    requiresMeasurements: true
  },
  {
    id: 'service-2',
    name: 'Kurti Stitching',
    description: 'Stylish kurti stitching for all occasions',
    category: 'kurti',
    pricing: [
      { type: 'Casual', price: 600, description: 'Everyday wear kurti' },
      { type: 'Party Wear', price: 1200, description: 'Elegant party wear kurti' }
    ],
    estimatedDays: 5,
    requiresMeasurements: true
  },
  {
    id: 'service-3',
    name: 'Bridal Stitching',
    description: 'Exquisite bridal wear stitching',
    category: 'bridal',
    pricing: [
      { type: 'Traditional', price: 5000, description: 'Traditional bridal outfit' },
      { type: 'Designer', price: 10000, description: 'Designer bridal collection' }
    ],
    estimatedDays: 21,
    requiresMeasurements: true
  }
];

// Mock Customer Measurements
const sampleMeasurements: CustomerMeasurements = {
  bust: 36,
  waist: 30,
  hip: 38,
  sleeveLength: 18,
  totalLength: 42
};

const sampleMeasurements2: CustomerMeasurements = {
  bust: 34,
  waist: 28,
  hip: 36,
  sleeveLength: 16,
  totalLength: 40
};

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'order-1',
    customerId: 'user-1',
    serviceId: 'service-1',
    status: 'stitching',
    appointmentDate: new Date('2024-01-20'),
    measurements: sampleMeasurements,
    specialInstructions: 'Please use silk fabric',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-25')
  },
  {
    id: 'order-2',
    customerId: 'user-1',
    serviceId: 'service-2',
    status: 'ready',
    appointmentDate: new Date('2024-02-01'),
    measurements: sampleMeasurements,
    specialInstructions: 'Bright colors preferred',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: 'order-3',
    customerId: 'user-3',
    serviceId: 'service-3',
    status: 'confirmed',
    appointmentDate: new Date('2024-03-15'),
    measurements: sampleMeasurements2,
    specialInstructions: 'Traditional red and gold theme',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: 'order-4',
    customerId: 'user-3',
    serviceId: 'service-1',
    status: 'pending',
    appointmentDate: new Date('2024-03-01'),
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-25')
  },
  {
    id: 'order-5',
    customerId: 'user-1',
    serviceId: 'service-2',
    status: 'delivered',
    appointmentDate: new Date('2024-01-10'),
    measurements: sampleMeasurements,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20')
  }
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    customerId: 'user-1',
    serviceId: 'service-1',
    appointmentDate: new Date('2024-03-10'),
    measurementType: 'custom',
    measurements: sampleMeasurements,
    status: 'pending'
  },
  {
    id: 'booking-2',
    customerId: 'user-3',
    serviceId: 'service-2',
    appointmentDate: new Date('2024-03-12'),
    measurementType: 'shop',
    status: 'confirmed'
  }
];

// Order filtering utilities
export const filterOrdersByCustomer = (orders: Order[], customerId: string): Order[] => {
  return orders.filter(order => order.customerId === customerId);
};

export const filterOrdersByStatus = (orders: Order[], status: Order['status']): Order[] => {
  return orders.filter(order => order.status === status);
};

export const filterOrders = (orders: Order[], options: OrderFilterOptions): Order[] => {
  let filteredOrders = [...orders];

  if (options.customerId) {
    filteredOrders = filterOrdersByCustomer(filteredOrders, options.customerId);
  }

  if (options.status) {
    filteredOrders = filterOrdersByStatus(filteredOrders, options.status);
  }

  if (options.serviceId) {
    filteredOrders = filteredOrders.filter(order => order.serviceId === options.serviceId);
  }

  return filteredOrders;
};

// Role-based order access utilities
export const getOrdersForRole = (orders: Order[], userRole: UserRole, userId?: string): Order[] => {
  switch (userRole) {
    case 'customer':
      // Customers can only see their own orders
      return userId ? filterOrdersByCustomer(orders, userId) : [];
    case 'admin':
      // Admins can see all orders
      return orders;
    case 'public':
      // Public users cannot see any orders
      return [];
    default:
      return [];
  }
};

// Get service name by ID
export const getServiceById = (serviceId: string): Service | undefined => {
  return mockServices.find(service => service.id === serviceId);
};

// Get user name by ID
export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find(user => user.id === userId);
};