import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order, Service, Booking, User } from '../types';

/**
 * Firestore Database Service
 * Handles all database operations for orders, services, and bookings
 */

// ==================== SERVICES ====================

export const getAllServices = async (): Promise<Service[]> => {
  try {
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(servicesRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Service));
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const getServiceById = async (serviceId: string): Promise<Service | null> => {
  try {
    const serviceDoc = await getDoc(doc(db, 'services', serviceId));
    
    if (serviceDoc.exists()) {
      return {
        id: serviceDoc.id,
        ...serviceDoc.data()
      } as Service;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

export const createService = async (service: Omit<Service, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'services'), service);
    return docRef.id;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateService = async (serviceId: string, updates: Partial<Service>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'services', serviceId), updates);
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (serviceId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'services', serviceId));
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

// ==================== ORDERS ====================

const convertTimestampToDate = (data: any): any => {
  const converted = { ...data };
  
  if (data.appointmentDate instanceof Timestamp) {
    converted.appointmentDate = data.appointmentDate.toDate();
  }
  if (data.createdAt instanceof Timestamp) {
    converted.createdAt = data.createdAt.toDate();
  }
  if (data.updatedAt instanceof Timestamp) {
    converted.updatedAt = data.updatedAt.toDate();
  }
  
  return converted;
};

export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const orderData = {
      ...order,
      appointmentDate: Timestamp.fromDate(order.appointmentDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    
    if (orderDoc.exists()) {
      const data = orderDoc.data();
      return {
        id: orderDoc.id,
        ...convertTimestampToDate(data)
      } as Order;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const getOrdersByCustomer = async (customerId: string): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestampToDate(doc.data())
    } as Order));
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestampToDate(doc.data())
    } as Order));
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const updateOrder = async (orderId: string, updates: Partial<Order>): Promise<void> => {
  try {
    const updateData: any = { ...updates };
    
    // Convert Date to Timestamp if present
    if (updates.appointmentDate) {
      updateData.appointmentDate = Timestamp.fromDate(updates.appointmentDate);
    }
    
    updateData.updatedAt = Timestamp.now();
    
    await updateDoc(doc(db, 'orders', orderId), updateData);
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'orders', orderId));
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};

// Real-time order updates
export const subscribeToOrders = (
  customerId: string | null,
  callback: (orders: Order[]) => void
): (() => void) => {
  try {
    const ordersRef = collection(db, 'orders');
    let q;
    
    if (customerId) {
      q = query(
        ordersRef,
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(ordersRef, orderBy('createdAt', 'desc'));
    }
    
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampToDate(doc.data())
      } as Order));
      
      callback(orders);
    });
  } catch (error) {
    console.error('Error subscribing to orders:', error);
    throw error;
  }
};

// ==================== BOOKINGS ====================

export const createBooking = async (booking: Omit<Booking, 'id'>): Promise<string> => {
  try {
    const bookingData = {
      ...booking,
      appointmentDate: Timestamp.fromDate(booking.appointmentDate)
    };
    
    const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getBookingsByCustomer = async (customerId: string): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('customerId', '==', customerId),
      orderBy('appointmentDate', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        appointmentDate: data.appointmentDate instanceof Timestamp 
          ? data.appointmentDate.toDate() 
          : data.appointmentDate
      } as Booking;
    });
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    throw error;
  }
};

export const getAllBookings = async (): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, orderBy('appointmentDate', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        appointmentDate: data.appointmentDate instanceof Timestamp 
          ? data.appointmentDate.toDate() 
          : data.appointmentDate
      } as Booking;
    });
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: Booking['status']
): Promise<void> => {
  try {
    await updateDoc(doc(db, 'bookings', bookingId), { status });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};

// ==================== USERS ====================

export const getAllCustomers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('role', '==', 'customer'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
      } as User;
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
      } as User;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
