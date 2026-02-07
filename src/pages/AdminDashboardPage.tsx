import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4">
      {/* Header with Logout Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-text-secondary mt-2">Manage orders, customers, and services</p>
        </div>
        
        {/* Admin Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Log out from admin dashboard"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
      
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard cards/content can be added here */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Orders</h3>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Customers</h3>
          <p className="text-gray-600">View customer information</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Services</h3>
          <p className="text-gray-600">Manage available services</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;