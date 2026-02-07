import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, Package, Filter, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner, ErrorMessage } from '../components';
import { User } from '../types';
import { getAllCustomers } from '../services/firestoreService';

const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<User[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'orders'>('date');

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    filterAndSortCustomers();
  }, [customers, searchTerm, sortBy]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCustomers = await getAllCustomers();
      setCustomers(fetchedCustomers);
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCustomers = () => {
    let filtered = [...customers];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(term) ||
          customer.email.toLowerCase().includes(term) ||
          customer.phone?.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'orders':
          // This would require fetching order counts - simplified for now
          return 0;
        default:
          return 0;
      }
    });

    setFilteredCustomers(filtered);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const handleRetry = () => {
    loadCustomers();
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Customers</h1>
        <p className="text-slate-600 mb-6">Manage customer information</p>
        <LoadingSpinner text="Loading customers..." className="py-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pb-20">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Customers</h1>
        <p className="text-slate-600 mb-6">Manage customer information</p>
        <ErrorMessage
          title="Unable to Load Customers"
          message={error}
          onRetry={handleRetry}
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Customers</h1>
        <p className="text-slate-600">Manage customer information and history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-slate-800">{customers.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">New This Month</p>
              <p className="text-2xl font-bold text-slate-800">
                {customers.filter(c => {
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return new Date(c.createdAt) > monthAgo;
                }).length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Active Customers</p>
              <p className="text-2xl font-bold text-slate-800">{customers.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'orders')}
              className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            >
              <option value="date">Newest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="orders">Most Orders</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-slate-600 text-lg mb-2">
            {searchTerm ? 'No customers found' : 'No customers yet'}
          </div>
          <p className="text-slate-500">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Customers will appear here once they register'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-rose-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="bg-gradient-to-br from-rose-400 to-rose-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">
                      {customer.name}
                    </h3>
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-4 h-4" />
                        <span>{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Badge */}
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Active
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-500">Joined</p>
                  <p className="text-sm font-medium text-slate-700">
                    {formatDate(customer.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Orders</p>
                  <p className="text-sm font-medium text-slate-700">-</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Last Order</p>
                  <p className="text-sm font-medium text-slate-700">-</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Spent</p>
                  <p className="text-sm font-medium text-slate-700">₹0</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={() => navigate('/admin/orders', { state: { customerId: customer.id } })}
                  className="flex-1 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Orders
                </button>
                <a
                  href={`mailto:${customer.email}`}
                  className="flex-1 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      {filteredCustomers.length > 0 && (
        <div className="mt-6 text-center text-sm text-slate-600">
          Showing {filteredCustomers.length} of {customers.length} customer
          {customers.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
