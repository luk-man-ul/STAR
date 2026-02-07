import { useState, useEffect } from 'react';
import {
  getAllServices,
  getOrdersByCustomer,
  getAllOrders,
  subscribeToOrders,
  createOrder,
  updateOrderStatus,
  createBooking
} from '../services/firestoreService';
import { Order, Service, Booking } from '../types';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hooks for Firestore operations
 * Provides easy-to-use hooks for components
 */

// Hook to fetch all services
export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getAllServices();
        setServices(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error };
};

// Hook to fetch orders with real-time updates
export const useOrders = (realtime: boolean = false) => {
  const { user, userRole } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user && userRole !== 'admin') {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        let data: Order[];
        
        if (userRole === 'admin') {
          data = await getAllOrders();
        } else if (user) {
          data = await getOrdersByCustomer(user.id);
        } else {
          data = [];
        }
        
        setOrders(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (realtime) {
      // Subscribe to real-time updates
      const customerId = userRole === 'customer' ? user?.id || null : null;
      const unsubscribe = subscribeToOrders(customerId, (data) => {
        setOrders(data);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // One-time fetch
      fetchOrders();
    }
  }, [user, userRole, realtime]);

  return { orders, loading, error, refetch: () => {} };
};

// Hook to create an order
export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      const orderId = await createOrder(order);
      return orderId;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};

// Hook to update order status
export const useUpdateOrderStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (orderId: string, status: Order['status']) => {
    try {
      setLoading(true);
      setError(null);
      await updateOrderStatus(orderId, status);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};

// Hook to create a booking
export const useCreateBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (booking: Omit<Booking, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const bookingId = await createBooking(booking);
      return bookingId;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};
