'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

interface Customer {
  name: string;
  phone: string;
}

interface Design {
  name: string;
  code: string;
}

interface Order {
  id: string;
  shortId: string;
  status: string;
  expectedDeliveryDate?: string | null;
  paymentStatus: string;
  paidAmount: number;
  remainingAmount: number;
  finalPrice: number;
  customer: Customer;
  design: Design;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const workflowStatuses = [
    'BOOKED',
    'MEASUREMENT_PENDING',
    'MEASURED',
    'CUTTING',
    'STITCHING',
    'QUALITY_CHECK',
    'READY_FOR_PICKUP',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ];

  const loadOrders = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '8',
      });
      if (search) query.append('search', search);
      if (statusFilter) query.append('status', statusFilter);

      const response = await apiClient.get(`/orders?${query.toString()}`);
      setOrders(response.data.data);
      setMeta(response.data.meta);
    } catch (err) {
      setError('Failed to fetch orders log.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, search, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'BOOKED':
        return 'bg-amber-100 text-amber-700';
      case 'MEASUREMENT_PENDING':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'MEASURED':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'CUTTING':
        return 'bg-orange-50 text-orange-850';
      case 'STITCHING':
        return 'bg-rose-50 text-rose-700';
      case 'QUALITY_CHECK':
        return 'bg-blue-100 text-blue-700';
      case 'READY_FOR_PICKUP':
        return 'bg-green-100 text-green-700';
      case 'OUT_FOR_DELIVERY':
        return 'bg-indigo-100 text-indigo-700';
      case 'DELIVERED':
        return 'bg-stone-100 text-stone-600';
      case 'CANCELLED':
        return 'bg-stone-200 text-stone-700';
      default:
        return 'bg-stone-100 text-stone-600';
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-700';
      case 'PARTIALLY_PAID':
        return 'bg-amber-100 text-amber-700';
      case 'UNPAID':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Tailoring Orders</h1>
          <p className="text-xs text-stone-600 mt-1">Manage workshop tailoring, statuses, and payment records</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-650 rounded-2xl text-xs text-center font-medium">
          {error}
        </div>
      )}

      {/* Toolbar Filters */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 shadow-sm items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by order ID or client name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 placeholder:text-stone-500 bg-stone-50"
          />
          <span className="absolute left-3 top-3.5 text-stone-600 text-xs">🔍</span>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs bg-stone-50 text-stone-900 font-semibold"
          >
            <option value="">All Stitching Stages</option>
            {workflowStatuses.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="text-right text-xs text-stone-600 font-medium">
          {meta ? `Total: ${meta.total} orders` : ''}
        </div>
      </div>

      {/* Orders list grid */}
      {loading && orders.length === 0 ? (
        <div className="text-center py-12 text-xs text-stone-600">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 text-center border border-stone-200 rounded-3xl text-xs text-stone-600 shadow-sm">
          No orders found matching the filter options.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-600 uppercase">
                  <th className="px-6 py-3.5">Order Number</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Design Style</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Due Date</th>
                  <th className="px-6 py-3.5">Payment</th>
                  <th className="px-6 py-3.5">Balance</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150 text-xs text-stone-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/50">
                    <td className="px-6 py-4 font-bold text-stone-800">{order.shortId}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-stone-800">{order.customer.name}</div>
                      <div className="text-[10px] text-stone-600">{order.customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-600">{order.design.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-600">
                      {order.expectedDeliveryDate
                        ? new Date(order.expectedDeliveryDate).toLocaleDateString()
                        : 'Not Specified'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide ${getPaymentStatusBadge(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-stone-800">
                      ₹{order.remainingAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full font-bold text-xs transition-colors"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-2 text-xs">
              <span className="text-stone-600">
                Page {meta.page} of {meta.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 h-9 border border-stone-300 text-stone-700 hover:text-stone-900 rounded-full font-semibold disabled:opacity-40 transition-opacity bg-white"
                >
                  Previous
                </button>
                <button
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 h-9 border border-stone-300 text-stone-700 hover:text-stone-900 rounded-full font-semibold disabled:opacity-40 transition-opacity bg-white"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
