'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

interface Address {
  id: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

interface Measurement {
  bust?: number;
  underBust?: number;
  waist?: number;
  hip?: number;
  shoulder?: number;
  neck?: number;
  armHole?: number;
  sleeveLength?: number;
  sleeveRound?: number;
  frontNeckDepth?: number;
  backNeckDepth?: number;
  totalLength?: number;
  bottomRound?: number;
  notes?: string;
}

interface Order {
  id: string;
  shortId: string;
  status: string;
  expectedDeliveryDate?: string | null;
  paymentStatus: string;
  remainingAmount: number;
  finalPrice: number;
  design: { name: string };
}

interface Booking {
  id: string;
  shortId: string;
  status: string;
  measurementMethod: string;
  createdAt: string;
  design: { name: string };
  appointment?: { appointmentDate: string } | null;
}

interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  addresses: Address[];
  measurements?: Measurement | null;
}

export default function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);

  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAllData() {
      try {
        setLoading(true);
        const [profileRes, ordersRes, bookingsRes] = await Promise.all([
          apiClient.get(`/customers/${id}`),
          apiClient.get(`/customers/${id}/orders`).catch(() => ({ data: [] })),
          apiClient.get(`/customers/${id}/bookings`).catch(() => ({ data: [] })),
        ]);

        setCustomer(profileRes.data);
        setOrders(ordersRes.data);
        setBookings(bookingsRes.data);
      } catch (err) {
        setError('Failed to load customer profile details.');
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12 text-sm text-stone-600">Loading customer account file...</div>;
  }

  if (error || !customer) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-650 rounded-2xl text-xs text-center font-medium">
        {error || 'Customer profile details not found.'}
      </div>
    );
  }

  // Outstanding Balance calculations
  const totalBalance = orders.reduce((sum, ord) => sum + ord.remainingAmount, 0);

  // WhatsApp shortcut links
  const waMessage = encodeURIComponent(
    `Hello ${customer.name}, here is an update from Star Stitcher tailoring boutique. Thank you!`
  );
  const waUrl = `https://wa.me/${customer.phone.replace(/\+/g, '')}?text=${waMessage}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Customer Profile: {customer.name}</h1>
          <p className="text-xs text-stone-600 mt-1">
            Registered:{' '}
            <span className="font-semibold text-stone-800">
              {new Date(customer.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>
        <div className="flex gap-3 text-xs font-semibold">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <span>💬</span> WhatsApp Customer
          </a>
          <button
            onClick={() => router.back()}
            className="px-4 py-2.5 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-full transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>

      {/* Profile Overview and Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm text-xs text-stone-800 space-y-2">
          <span className="text-[10px] font-bold text-stone-600 uppercase block">Account Directory</span>
          <p className="text-base font-bold text-stone-800">{customer.name}</p>
          <p>
            <strong>Phone:</strong> {customer.phone}
          </p>
          <p>
            <strong>Email:</strong> {customer.email}
          </p>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-stone-900 text-white p-5 rounded-3xl shadow-sm text-xs flex flex-col justify-between">
          <span className="text-[10px] font-bold text-stone-400 uppercase block">Outstanding Balance</span>
          <div className="mt-4">
            <span className="text-2xl font-extrabold text-rose-400 block">
              ₹{totalBalance.toLocaleString()}
            </span>
            <span className="text-[10px] text-stone-400 mt-1 block">Accumulated from {orders.filter(o => o.remainingAmount > 0).length} active orders</span>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm text-xs text-stone-800 space-y-4">
          <span className="text-[10px] font-bold text-stone-600 uppercase block border-b border-stone-100 pb-1">
            Shipping Destinations
          </span>
          {customer.addresses.length === 0 ? (
            <p className="text-stone-600 font-medium">No addresses saved.</p>
          ) : (
            <div className="space-y-2">
              {customer.addresses.map((addr) => (
                <div key={addr.id} className="p-2 bg-stone-50 rounded-xl border border-stone-150">
                  <p className="font-semibold text-stone-800">
                    {addr.addressLine1} {addr.isDefault && <span className="text-[9px] text-rose-500 font-bold ml-1">(Default)</span>}
                  </p>
                  <p className="text-[10px] text-stone-600">{addr.city} {addr.postalCode}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sizing Sheet & Stitching Orders Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Measurements Sizing sheet (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-stone-800 font-serif border-b border-stone-100 pb-2">
            Tailor Sizing Sheet
          </h2>
          {customer.measurements ? (
            <div className="space-y-4 text-xs text-stone-800">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(customer.measurements).map(([key, val]) => {
                  if (typeof val !== 'number' || val === null) return null;
                  return (
                    <div key={key} className="flex justify-between border-b border-stone-100 pb-1.5">
                      <span className="text-stone-600 font-semibold uppercase text-[10px]">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-bold text-stone-800">{val}"</span>
                    </div>
                  );
                })}
              </div>
              {customer.measurements.notes && (
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-150">
                  <strong>Notes:</strong> {customer.measurements.notes}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-stone-600 text-center py-4">No measurements config file defined.</p>
          )}
        </div>

        {/* Right: Bookings & Orders History (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active / Previous Orders table */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-800 font-serif border-b border-stone-100 pb-2">
              Stitching Orders History
            </h2>
            {orders.length === 0 ? (
              <p className="text-xs text-stone-600 text-center py-4">No orders logged.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                      <th className="py-2">Order ID</th>
                      <th className="py-2">Style</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-right">Balance</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/50">
                        <td className="py-3 font-bold text-stone-800">{ord.shortId}</td>
                        <td className="py-3 font-semibold text-stone-600">{ord.design.name}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded font-bold text-[8px] uppercase">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-bold text-stone-800">
                          ₹{ord.remainingAmount.toLocaleString()}
                        </td>
                        <td className="py-3 text-right">
                          <Link href={`/admin/orders/${ord.id}`} className="text-rose-600 font-bold hover:underline">
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bookings Queue history */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-800 font-serif border-b border-stone-100 pb-2">
              Bookings History
            </h2>
            {bookings.length === 0 ? (
              <p className="text-xs text-stone-600 text-center py-4">No bookings scheduled.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                      <th className="py-2">Booking ID</th>
                      <th className="py-2">Style</th>
                      <th className="py-2">Sizing Date</th>
                      <th className="py-2">Method</th>
                      <th className="py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-850">
                    {bookings.map((bk) => (
                      <tr key={bk.id}>
                        <td className="py-3 font-bold text-stone-800">{bk.shortId}</td>
                        <td className="py-3 font-semibold text-stone-600">{bk.design.name}</td>
                        <td className="py-3 font-semibold text-stone-600">
                          {bk.appointment
                            ? new Date(bk.appointment.appointmentDate).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="py-3 text-stone-600">{bk.measurementMethod}</td>
                        <td className="py-3 text-right">
                          <span className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded font-bold text-[8px] uppercase">
                            {bk.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
