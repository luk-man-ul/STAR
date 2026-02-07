import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Settings, Phone, Mail } from 'lucide-react';

const AccountPage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Not Signed In</h2>
            <p className="text-slate-600 mb-6">Please sign in to view your account</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-rose-600 text-white py-3 rounded-2xl font-medium hover:bg-rose-700 transition-colors min-h-[48px]"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-rose-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-rose-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
          <p className="text-slate-600 capitalize">{user.role} Account</p>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Account Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-slate-500 mr-3" />
                <div>
                  <p className="font-medium text-slate-800">Email</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-slate-500 mr-3" />
                <div>
                  <p className="font-medium text-slate-800">Phone</p>
                  <p className="text-sm text-slate-600">{user.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center">
                <User className="w-4 h-4 text-slate-500 mr-3" />
                <div>
                  <p className="font-medium text-slate-800">Account Type</p>
                  <p className="text-sm text-slate-600 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {user.role === 'customer' && (
              <>
                <button
                  onClick={() => navigate('/book')}
                  className="w-full text-left p-4 bg-rose-50 rounded-2xl hover:bg-rose-100 transition-colors"
                >
                  <p className="font-medium text-rose-800">Book New Appointment</p>
                  <p className="text-sm text-rose-600">Schedule your next stitching service</p>
                </button>
                
                <button
                  onClick={() => navigate('/my-orders')}
                  className="w-full text-left p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors"
                >
                  <p className="font-medium text-blue-800">View My Orders</p>
                  <p className="text-sm text-blue-600">Check your order status and history</p>
                </button>
              </>
            )}
            
            {user.role === 'admin' && (
              <>
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="w-full text-left p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors"
                >
                  <p className="font-medium text-purple-800">Admin Dashboard</p>
                  <p className="text-sm text-purple-600">View business overview and analytics</p>
                </button>
                
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="w-full text-left p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
                >
                  <p className="font-medium text-green-800">Manage Orders</p>
                  <p className="text-sm text-green-600">View and update all customer orders</p>
                </button>
              </>
            )}
            
            <button
              onClick={() => navigate('/chat')}
              className="w-full text-left p-4 bg-amber-50 rounded-2xl hover:bg-amber-100 transition-colors"
            >
              <p className="font-medium text-amber-800">Contact Support</p>
              <p className="text-sm text-amber-600">Get help from our team</p>
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-2xl font-medium hover:bg-red-700 transition-colors min-h-[48px]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;