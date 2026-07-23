'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await apiClient.get(`/customers${query}`);
      setCustomers(response.data);
    } catch (err) {
      setError('Failed to fetch customers registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Delay search request using debounce window
    const delayDebounce = setTimeout(() => {
      loadCustomers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif">Customers Registry</h1>
        <p className="text-xs text-stone-600 mt-1">Monitor client profiles, address books, and tailor measurement sheets</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-650 rounded-2xl text-xs text-center font-medium">
          {error}
        </div>
      )}

      {/* Toolbar Filters */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-sm">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            placeholder="Search by client name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 placeholder:text-stone-500 bg-stone-50"
          />
          <span className="absolute left-3 top-3.5 text-stone-600 text-xs">🔍</span>
        </div>

        <div className="text-xs text-stone-600 font-semibold">
          Registered Clients: {customers.length}
        </div>
      </div>

      {/* Customers List Table */}
      {loading && customers.length === 0 ? (
        <div className="text-center py-12 text-xs text-stone-600">Loading customers...</div>
      ) : customers.length === 0 ? (
        <div className="bg-white p-12 text-center border border-stone-200 rounded-3xl text-xs text-stone-600 shadow-sm">
          No customers found matching the search criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-600 uppercase">
                  <th className="px-6 py-3.5">Client Name</th>
                  <th className="px-6 py-3.5">Contact Details</th>
                  <th className="px-6 py-3.5">Registered Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150 text-xs text-stone-700">
                {customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-stone-50/50">
                    <td className="px-6 py-4 font-bold text-stone-800">{cust.name}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-stone-600">Phone: {cust.phone}</p>
                      <p className="text-[10px] text-stone-600">Email: {cust.email}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-600">
                      {new Date(cust.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/customers/${cust.id}`}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full font-bold text-xs transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {customers.map((cust) => (
              <div key={cust.id} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start border-b border-stone-100 pb-2">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">{cust.name}</h3>
                    <p className="text-xs text-stone-600 font-semibold">{cust.phone}</p>
                  </div>
                  <span className="text-[10px] text-stone-500 font-medium">
                    {new Date(cust.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] text-stone-600 truncate max-w-[200px]">{cust.email}</span>
                  <Link
                    href={`/admin/customers/${cust.id}`}
                    className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full font-bold text-xs transition-colors shrink-0"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
