// Type definitions for the application

export type UserRole = 'public' | 'customer' | 'admin';

export type ChatbotAction = 'book-now' | 'price-inquiry' | 'talk-to-tailor';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'blouse' | 'kurti' | 'bridal';
  pricing: PricingTier[];
  estimatedDays: number;
  requiresMeasurements: boolean;
}

export interface PricingTier {
  type: string;
  price: number;
  description: string;
}

export interface CustomerMeasurements {
  bust: number;
  waist: number;
  hip: number;
  sleeveLength: number;
  totalLength: number;
}

export interface Order {
  id: string;
  customerId: string;
  serviceId: string;
  status: 'pending' | 'confirmed' | 'measuring' | 'stitching' | 'ready' | 'delivered';
  appointmentDate: Date;
  measurements?: CustomerMeasurements;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  appointmentDate: Date;
  measurementType: 'shop' | 'custom';
  measurements?: CustomerMeasurements;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface BookingData {
  serviceId: string;
  appointmentDate: Date;
  measurementType: 'shop' | 'custom';
  measurements?: CustomerMeasurements;
}

// Mock data and utilities
export interface MockData {
  users: User[];
  services: Service[];
  orders: Order[];
  bookings: Booking[];
}

export interface OrderFilterOptions {
  customerId?: string;
  status?: Order['status'];
  serviceId?: string;
}