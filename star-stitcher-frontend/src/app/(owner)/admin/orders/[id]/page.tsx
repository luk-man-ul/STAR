'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api-client';

interface Address {
  addressLine1: string;
  city: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface Design {
  name: string;
  code: string;
  category: { name: string };
}

interface PaymentTransaction {
  id: string;
  amount: number;
  paymentMethod: string;
  transactionReference?: string | null;
  notes?: string | null;
  paidAt: string;
}

interface TimelineEvent {
  id: string;
  status: string;
  notes?: string | null;
  createdAt: string;
}

interface OrderDetail {
  id: string;
  shortId: string;
  status: string;
  appointmentDate: string;
  deliveryType: string;
  specialInstructions?: string | null;
  measurementSnapshot?: Record<string, any> | null;
  isUrgent: boolean;
  rushFee: number;
  fabricSource: string;
  fabricDescription?: string | null;
  fabricImageUrl?: string | null;
  expectedDeliveryDate?: string | null;
  finalPrice: number;
  priceOverrideReason?: string | null;
  paymentStatus: string;
  paidAmount: number;
  remainingAmount: number;
  customer: Customer;
  design: Design;
  shippingAddress?: Address | null;
  transactions: PaymentTransaction[];
  timelineEvents: TimelineEvent[];
}

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status update states
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  // Payment record states
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('UPI');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

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

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/orders/${id}`);
      setOrder(response.data);
      setNewStatus(response.data.status);
    } catch (err) {
      setError('Failed to load order information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderDetail();
  }, [id]);

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !newStatus) return;

    setStatusLoading(true);
    setError(null);
    try {
      await apiClient.patch(`/orders/${id}/status`, {
        status: newStatus,
        notes: statusNotes,
      });
      setStatusNotes('');
      await loadOrderDetail();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update order workflow status.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || !payAmount) return;

    const amountNum = parseFloat(payAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please provide a valid payment amount.');
      return;
    }

    setPaymentLoading(true);
    setError(null);
    try {
      await apiClient.patch(`/orders/${id}/payment`, {
        amount: amountNum,
        paymentMethod: payMethod,
        transactionReference: payRef,
        notes: payNotes,
      });
      setPayAmount('');
      setPayRef('');
      setPayNotes('');
      await loadOrderDetail();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to record manual payment entry.');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-stone-600">Loading order timeline & ledger details...</div>;
  }

  if (error || !order) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-650 rounded-2xl text-xs text-center font-medium">
        {error || 'Order details not found.'}
      </div>
    );
  }

  // Pre-fill WhatsApp template message links
  const waMessage = encodeURIComponent(
    `Hello ${order.customer.name}, here is an update for your Star Stitcher order ${order.shortId}. Current stitching status is ${order.status.replace(/_/g, ' ')}. Due date: ${order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'N/A'}. Thank you!`
  );
  const waUrl = `https://wa.me/${order.customer.phone.replace(/\+/g, '')}?text=${waMessage}`;

  return (
    <div className="space-y-8">
      {/* Header title */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-stone-900 font-serif">Order Details: {order.shortId}</h1>
            <span className="px-3 py-0.5 bg-rose-100 text-rose-700 font-bold text-[10px] rounded-full uppercase tracking-wider">
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-stone-600 mt-1">Stitching tracker metrics, fabric tracking and manual ledger logs</p>
        </div>
        <div className="flex gap-3 text-xs font-semibold">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span>💬</span> WhatsApp Client
          </a>
          <button
            onClick={() => router.back()}
            className="px-4 py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-full transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Main Grid Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Order Specs, Sizing, Fabric (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Order Snapshot Cards */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-stone-800">
            <div>
              <span className="text-[10px] font-bold text-stone-600 uppercase block mb-1">Customer Profile</span>
              <Link href={`/admin/customers/${order.customer.id}`} className="font-bold text-rose-600 hover:underline">
                {order.customer.name}
              </Link>
              <p className="text-stone-600 mt-0.5">{order.customer.phone}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-600 uppercase block mb-1">Design Code</span>
              <p className="font-bold text-stone-800">{order.design.name}</p>
              <p className="text-stone-600 mt-0.5">{order.design.category.name} ({order.design.code})</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-600 uppercase block mb-1">Delivery details</span>
              <p className="font-bold text-stone-800">{order.deliveryType}</p>
              <p className="text-stone-600 mt-0.5">
                {order.shippingAddress ? `${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}` : 'Pickup'}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-stone-600 uppercase block mb-1">Expected Delivery</span>
              <p className="font-extrabold text-stone-800 text-sm">
                {order.expectedDeliveryDate
                  ? new Date(order.expectedDeliveryDate).toLocaleDateString([], {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Not Set'}
              </p>
            </div>
          </div>

          {/* Measurements Snapshot panel */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-stone-800 font-serif border-b border-stone-100 pb-2">
              Sizing Sheet Snapshot (At Confirmation)
            </h2>
            {order.measurementSnapshot && Object.keys(order.measurementSnapshot).length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 text-xs text-stone-800">
                {Object.entries(order.measurementSnapshot).map(([key, val]) => {
                  if (typeof val !== 'number' || val === null) return null;
                  return (
                    <div key={key} className="bg-stone-50 p-2.5 rounded-xl border border-stone-150 text-center">
                      <span className="text-[9px] uppercase font-bold text-stone-600 block mb-0.5">{key}</span>
                      <span className="font-extrabold text-stone-900 text-sm">{val} in</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-stone-600 text-center py-4">No measurements captured in order snapshot.</p>
            )}
          </div>

          {/* Fabric Details */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4 text-xs text-stone-800">
            <h2 className="text-sm font-bold text-stone-850 font-serif border-b border-stone-100 pb-2">
              Fabric Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p>
                  <strong>Material Source:</strong> {order.fabricSource.replace(/_/g, ' ')}
                </p>
                <p>
                  <strong>Description:</strong> {order.fabricDescription || 'No description logged'}
                </p>
              </div>
              <div>
                {order.fabricImageUrl && (
                  <div className="w-24 h-24 border border-stone-300 rounded-2xl overflow-hidden bg-stone-50 flex items-center justify-center font-bold">
                    <img src={order.fabricImageUrl} alt="Fabric preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chronological Timeline History */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6 text-xs text-stone-800">
            <h2 className="text-sm font-bold text-stone-850 font-serif border-b border-stone-100 pb-2">
              Stitching Activity Log
            </h2>
            <div className="relative border-l-2 border-stone-200 pl-6 ml-2 space-y-6">
              {order.timelineEvents.map((evt) => (
                <div key={evt.id} className="relative">
                  <span className="absolute -left-8.5 top-0.5 w-3 h-3 rounded-full bg-rose-500 border-2 border-white" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-800 uppercase">{evt.status.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-stone-600">
                      {new Date(evt.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-stone-600 mt-1">{evt.notes || 'No activity log description'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Workflow Actions & Payments (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Status transition forms */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-stone-800 font-serif">Transition Stitching Stage</h2>
            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 bg-white"
                >
                  {workflowStatuses.map((st) => (
                    <option key={st} value={st}>
                      {st.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={2}
                  placeholder="Notes for timeline events logs..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 placeholder:text-stone-500 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={statusLoading}
                className="w-full h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
              >
                {statusLoading ? 'Updating...' : 'Apply Transition'}
              </button>
            </form>
          </div>

          {/* Billing Summary Box */}
          <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-sm space-y-4 text-xs">
            <h2 className="text-sm font-bold font-serif border-b border-stone-800 pb-2">Billing Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-400">Total Price:</span>
                <span className="font-bold">₹{order.finalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Total Paid Amount:</span>
                <span className="font-bold text-green-400">₹{order.paidAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-stone-800 pt-2 text-sm font-bold">
                <span>Outstanding Balance:</span>
                <span className="text-rose-400">₹{order.remainingAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment ledger forms */}
          {order.remainingAmount > 0 && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-stone-800 font-serif">Record Manual Payment</h2>
              <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-800 mb-1 font-semibold">Payment Amount (₹)</label>
                  <input
                    type="number"
                    max={order.remainingAmount}
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="e.g. 2000"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 placeholder:text-stone-500 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-800 mb-1 font-semibold">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 bg-white"
                  >
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-800 mb-1 font-semibold">Transaction ID / Ref (Optional)</label>
                  <input
                    type="text"
                    value={payRef}
                    onChange={(e) => setPayRef(e.target.value)}
                    placeholder="e.g. UPI Ref Number"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 placeholder:text-stone-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-stone-800 mb-1 font-semibold">Notes (Optional)</label>
                  <input
                    type="text"
                    value={payNotes}
                    onChange={(e) => setPayNotes(e.target.value)}
                    placeholder="Advance or balance payment"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 placeholder:text-stone-500 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full h-10 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
                >
                  {paymentLoading ? 'Submitting...' : 'Confirm Bookkeeping Ledger'}
                </button>
              </form>
            </div>
          )}

          {/* Payment ledger history */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4 text-xs text-stone-800">
            <h2 className="text-sm font-bold text-stone-800 font-serif border-b border-stone-100 pb-2">
              Payment Transaction Ledger
            </h2>
            {order.transactions.length === 0 ? (
              <p className="text-xs text-stone-600 text-center py-4">No payments recorded for this order.</p>
            ) : (
              <div className="space-y-3">
                {order.transactions.map((tx) => (
                  <div key={tx.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-150 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-stone-800">₹{tx.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-stone-600">
                        Method: {tx.paymentMethod} | {new Date(tx.paidAt).toLocaleDateString()}
                      </p>
                      {tx.notes && <p className="text-[10px] text-stone-600 italic mt-0.5">{tx.notes}</p>}
                    </div>
                    {tx.transactionReference && (
                      <span className="text-[9px] px-2 py-0.5 bg-stone-200 rounded font-semibold text-stone-600 font-mono">
                        {tx.transactionReference}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
