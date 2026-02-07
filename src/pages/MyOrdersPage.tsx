import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner, ErrorMessage } from '../components';
import { Order } from '../types';
import { getOrdersByCustomer, getServiceById } from '../services/firestoreService';

const MyOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch orders from Firebase
        const customerOrders = await getOrdersByCustomer(user.id);
        setOrders(customerOrders);

        // Fetch services for each order
        const serviceMap: Record<string, any> = {};
        for (const order of customerOrders) {
          if (!serviceMap[order.serviceId]) {
            const service = await getServiceById(order.serviceId);
            if (service) {
              serviceMap[order.serviceId] = service;
            }
          }
        }
        setServices(serviceMap);
      } catch (err: any) {
        setError(err.message || 'Failed to load your orders. Please try again.');
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Trigger reload by changing a dependency
    if (user) {
      getOrdersByCustomer(user.id)
        .then(setOrders)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'confirmed':
        return 'text-blue-600 bg-blue-50';
      case 'measuring':
        return 'text-purple-600 bg-purple-50';
      case 'stitching':
        return 'text-orange-600 bg-orange-50';
      case 'ready':
        return 'text-green-600 bg-green-50';
      case 'delivered':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">My Orders</h1>
        <p className="text-slate-600 mb-6">View your order history and status</p>
        <LoadingSpinner text="Loading your orders..." className="py-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">My Orders</h1>
        <p className="text-slate-600 mb-6">View your order history and status</p>
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
      <h1 className="text-2xl font-bold text-slate-800 mb-2">My Orders</h1>
      <p className="text-slate-600 mb-6">View your order history and status</p>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📦</span>
          </div>
          <div className="text-slate-600 text-lg mb-2">No orders found</div>
          <p className="text-slate-500 mb-6">You haven't placed any orders yet.</p>
          <button
            onClick={() => window.location.href = '/book'}
            className="bg-rose-600 text-white px-6 py-3 rounded-2xl font-medium hover:bg-rose-700 transition-colors"
          >
            Place Your First Order
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const service = services[order.serviceId];
            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-4 shadow-sm border border-rose-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      Order #{order.id.substring(0, 8).toUpperCase()}
                    </h3>
                    <p className="text-slate-600 text-sm">
                      {service?.name || 'Loading...'}
                      {order.pricingTier && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {order.pricingTier}
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Appointment Date:</span>
                    <span>{formatDate(order.appointmentDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Date:</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
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

export default MyOrdersPage;