import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Package, 
  Users, 
  Settings, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAllOrders, getAllCustomers, getAllServices } from '../services/firestoreService';
import { LoadingSpinner } from '../components';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    totalServices: 0,
    totalRevenue: 0,
    recentOrders: [] as any[]
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [orders, customers, services] = await Promise.all([
        getAllOrders(),
        getAllCustomers(),
        getAllServices()
      ]);

      // Calculate stats
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const completedOrders = orders.filter(o => o.status === 'delivered').length;
      
      // Get recent orders (last 5)
      const recentOrders = orders.slice(0, 5);

      setStats({
        totalOrders: orders.length,
        pendingOrders,
        completedOrders,
        totalCustomers: customers.length,
        totalServices: services.length,
        totalRevenue: 0, // Calculate based on completed orders
        recentOrders
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <LoadingSpinner text="Loading dashboard..." className="py-12" />
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      {/* Header with Logout Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        
        {/* Admin Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Log out from admin dashboard"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Orders */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-rose-300 transition-colors cursor-pointer"
             onClick={() => navigate('/admin/orders')}>
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.totalOrders}</h3>
          <p className="text-sm text-slate-600">Total Orders</p>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span>{stats.pendingOrders} pending</span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-rose-300 transition-colors cursor-pointer"
             onClick={() => navigate('/admin/customers')}>
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 p-3 rounded-xl">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.totalCustomers}</h3>
          <p className="text-sm text-slate-600">Total Customers</p>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span>Active users</span>
          </div>
        </div>

        {/* Total Services */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-rose-300 transition-colors cursor-pointer"
             onClick={() => navigate('/admin/services')}>
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.totalServices}</h3>
          <p className="text-sm text-slate-600">Total Services</p>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span>Available services</span>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-rose-100 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6 text-rose-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-800">{stats.completedOrders}</h3>
          <p className="text-sm text-slate-600">Completed Orders</p>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span>Successfully delivered</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/orders')}
          className="bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-2xl p-6 hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8" />
            <ArrowRight className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Manage Orders</h3>
          <p className="text-sm text-rose-100">View and update order status</p>
        </button>

        <button
          onClick={() => navigate('/admin/customers')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8" />
            <ArrowRight className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Manage Customers</h3>
          <p className="text-sm text-blue-100">View customer information</p>
        </button>

        <button
          onClick={() => navigate('/admin/services')}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <Settings className="w-8 h-8" />
            <ArrowRight className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold mb-1">Manage Services</h3>
          <p className="text-sm text-purple-100">Add and edit services</p>
        </button>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-sm text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600">No orders yet</p>
            <p className="text-sm text-slate-500 mt-1">Orders will appear here once customers start booking</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={() => navigate('/admin/orders')}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg">
                    <Package className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      Order #{order.id.substring(0, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.pendingOrders}</p>
              <p className="text-sm text-slate-600">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Loader className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {stats.totalOrders - stats.pendingOrders - stats.completedOrders}
              </p>
              <p className="text-sm text-slate-600">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.completedOrders}</p>
              <p className="text-sm text-slate-600">Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
