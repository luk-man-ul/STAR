'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

interface Appointment {
  id: string;
  appointmentDate: string;
  booking: {
    id: string;
    shortId: string;
    customer: { name: string; phone: string };
    design: { name: string };
  };
}

interface SummaryData {
  todaysAppointments: Appointment[];
  pendingBookingsCount: number;
  inProgressOrdersCount: number;
  readyForPickupCount: number;
  deliveriesTodayCount: number;
  pendingPayments: { count: number; amount: number };
  newCustomersCount: number;
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        setLoading(true);
        const response = await apiClient.get('/dashboard/summary');
        setSummary(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard metrics.');
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-sm text-stone-600">Loading shop stats...</div>;
  }

  if (error || !summary) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-650 rounded-2xl text-xs text-center font-semibold">
        {error || 'Failed to initialize summary data.'}
      </div>
    );
  }

  const kpis = [
    { title: "Today's Appointments", value: summary.todaysAppointments.length, icon: "📅", link: "/admin/calendar", bg: "bg-blue-50 border-blue-200 text-blue-800" },
    { title: "Pending Bookings", value: summary.pendingBookingsCount, icon: "📋", link: "/admin/bookings", bg: "bg-amber-50 border-amber-200 text-amber-800" },
    { title: "Orders In Progress", value: summary.inProgressOrdersCount, icon: "✂️", link: "/admin/orders", bg: "bg-rose-50 border-rose-200 text-rose-800" },
    { title: "Ready For Pickup", value: summary.readyForPickupCount, icon: "🛍️", link: "/admin/orders?status=READY_FOR_PICKUP", bg: "bg-green-50 border-green-200 text-green-800" },
    { title: "Deliveries Today", value: summary.deliveriesTodayCount, icon: "🚚", link: "/admin/orders?status=OUT_FOR_DELIVERY", bg: "bg-indigo-50 border-indigo-200 text-indigo-800" },
    { title: "Pending Payments", value: `₹${summary.pendingPayments.amount.toLocaleString()}`, sub: `${summary.pendingPayments.count} Orders`, icon: "💰", link: "/admin/orders", bg: "bg-emerald-50 border-emerald-200 text-emerald-800" },
    { title: "New Clients This Month", value: summary.newCustomersCount, icon: "👥", link: "/admin/customers", bg: "bg-purple-50 border-purple-200 text-purple-800" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-850 font-serif">Boutique Executive Summary</h1>
        <p className="text-xs text-stone-500 mt-1">Stitching lines performance snapshot and scheduling queues overview</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <Link
            key={idx}
            href={kpi.link}
            className={`p-5 rounded-3xl border shadow-sm transition-all hover:scale-102 flex flex-col justify-between h-36 bg-white hover:shadow-md`}
          >
            <div className="flex justify-between items-start">
              <span className="text-2xl">{kpi.icon}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${kpi.bg}`}>
                Monitor
              </span>
            </div>
            <div className="mt-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                {kpi.title}
              </span>
              <span className="text-xl font-extrabold text-stone-850 mt-1 block">
                {kpi.value}
              </span>
              {'sub' in kpi && (
                <span className="text-[9px] font-medium text-stone-400 block mt-0.5">{kpi.sub}</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Today's Appointments Queue */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-stone-850 font-serif">Today's Appointment Schedule</h2>
        {summary.todaysAppointments.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500">
            No sizing consultations scheduled for today.
          </div>
        ) : (
          <div className="divide-y divide-stone-150 text-xs text-stone-700">
            {summary.todaysAppointments.map((ap) => (
              <div key={ap.id} className="py-4 flex justify-between items-center gap-4 hover:bg-stone-50/40 rounded-xl px-2">
                <div className="flex items-center gap-4">
                  <div className="px-3.5 py-2 bg-stone-100 rounded-2xl font-bold text-stone-700 text-center">
                    {new Date(ap.appointmentDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div>
                    <p className="font-bold text-stone-850">{ap.booking.customer.name}</p>
                    <p className="text-[10px] text-stone-400">Phone: {ap.booking.customer.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-stone-600">{ap.booking.design.name}</p>
                  <p className="text-[10px] text-stone-400">Ref: {ap.booking.shortId}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
