import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner, ErrorMessage } from '../components';
import { Order } from '../types';
import { getAllOrders, getServiceById, getUserById, updateOrderStatus } from '../services/firestoreService';

const AdminOrdersPage: React.FC = () => {
  const { userRole } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Record<string, any>>({});
  const [customers, setCustomers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all orders from Firebase
        const adminOrders = await getAllOrders();
        setOrders(adminOrders);

        // Fetch services and customers for each order
        const serviceMap: Record<string, any> = {};
        const customerMap: Record<string, any> = {};
        
        for (const order of adminOrders) {
          // Fetch service if not already fetched
          if (!serviceMap[order.serviceId]) {
            const service = await getServiceById(order.serviceId);
            if (service) {
              serviceMap[order.serviceId] = service;
            }
          }
          
          // Fetch customer if not already fetched
          if (!customerMap[order.customerId]) {
            const customer = await getUserById(order.customerId);
            if (customer) {
              customerMap[order.customerId] = customer;
            }
          }
        }
        
        setServices(serviceMap);
        setCustomers(customerMap);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders. Please try again.');
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [userRole]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    getAllOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'confirmed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'measuring':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'stitching':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'ready':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'delivered':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      setUpdatingOrderId(orderId);
      
      // Update order status in Firebase
      await updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus, updatedAt: new Date() }
            : order
        )
      );
    } catch (err: any) {
      console.error('Error updating order status:', err);
      setError(err.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const statusOptions: Order['status'][] = [
    'pending',
    'confirmed',
    'measuring',
    'stitching',
    'ready',
    'delivered'
  ];

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">All Orders</h1>
        <p className="text-slate-600 mb-6">Manage all customer orders</p>
        <LoadingSpinner text="Loading orders..." className="py-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">All Orders</h1>
        <p className="text-slate-600 mb-6">Manage all customer orders</p>
        <ErrorMessage
          title="Unable to Load Orders"
          message={error}
          onRetry={handleRetry}
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">All Orders</h1>
      <p className="text-slate-600 mb-6">Manage all customer orders</p>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <div className="text-slate-600 text-lg mb-2">No orders found</div>
          <p className="text-slate-500">No customer orders available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const service = services[order.serviceId];
            const customer = customers[order.customerId];
            const isUpdating = updatingOrderId === order.id;
            
            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl p-4 shadow-sm border border-rose-100 ${
                  isUpdating ? 'opacity-75' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Order #{order.id.substring(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {service?.name || 'Unknown Service'}
                      {order.pricingTier && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {order.pricingTier}
                        </span>
                      )}
                    </p>
                    <p className="text-slate-500 text-xs">
                      Customer: {customer?.name || 'Unknown Customer'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        disabled={isUpdating}
                        className="text-xs border border-rose-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                      {isUpdating && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <LoadingSpinner size="sm" text="" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500">Appointment:</span>
                      <p>{formatDate(order.appointmentDate)}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Order Date:</span>
                      <p>{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500">Customer Phone:</span>
                      <p>{customer?.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Email:</span>
                      <p className="text-xs">{customer?.email || 'N/A'}</p>
                    </div>
                  </div>

                  {order.measurements && (
                    <div className="pt-2 border-t border-rose-100">
                      <span className="text-xs text-slate-500 block mb-2">Measurements:</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Bust: {order.measurements.bust}"</div>
                        <div>Waist: {order.measurements.waist}"</div>
                        <div>Hip: {order.measurements.hip}"</div>
                        <div>Sleeve: {order.measurements.sleeveLength}"</div>
                        <div className="col-span-2">Length: {order.measurements.totalLength}"</div>
                      </div>
                    </div>
                  )}
                  
                  {order.specialInstructions && (
                    <div className="pt-2 border-t border-rose-100">
                      <span className="text-xs text-slate-500">Special Instructions:</span>
                      <p className="text-slate-600 mt-1">{order.specialInstructions}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;