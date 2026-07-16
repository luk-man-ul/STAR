'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

interface Appointment {
  id: string;
  appointmentDate: string;
  status: string;
}

interface Design {
  name: string;
  code: string;
}

interface Booking {
  id: string;
  shortId: string;
  status: string;
  measurementMethod: string;
  deliveryMethod: string;
  createdAt: string;
  design: Design;
  appointment?: Appointment | null;
}

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/bookings/customer');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load your booking history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'APPROVED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'CANCELLED':
        return 'bg-stone-200 text-stone-600 border-stone-300';
      case 'CONVERTED':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-stone-100 text-stone-600 border-stone-250';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto py-4">
        <div className="flex justify-between items-center animate-pulse">
          <div className="space-y-2 w-1/3">
            <div className="h-6 bg-stone-200 rounded"></div>
            <div className="h-4 bg-stone-200 rounded w-2/3"></div>
          </div>
          <div className="h-11 bg-stone-200 rounded-full w-36"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-3xl p-5 space-y-4 animate-pulse">
              <div className="flex justify-between border-b border-stone-100 pb-3">
                <div className="h-5 bg-stone-200 rounded w-1/4"></div>
                <div className="h-5 bg-stone-200 rounded w-16"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                    <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && bookings.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center flex flex-col items-center justify-center space-y-4">
        <span className="text-5xl">📶</span>
        <h2 className="text-xl font-bold text-stone-900 font-serif">Failed to Load Bookings</h2>
        <p className="text-sm text-stone-700 max-w-sm">
          We encountered an issue retrieving your booking history from our servers. Please check your internet connection.
        </p>
        <button
          onClick={loadBookings}
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">My Bookings</h1>
          <p className="text-xs text-stone-600 mt-1">Track request states, approvals, and appointments schedules</p>
        </div>
        <Link
          href="/book"
          className="px-5 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all flex items-center justify-center"
        >
          Book Appointment
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-655 rounded-2xl text-xs text-center">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="bg-white p-12 text-center border border-stone-200 rounded-3xl text-xs text-stone-600 shadow-sm">
          No bookings submitted yet. Click the button above to schedule your first tailoring booking.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] text-stone-600 font-bold uppercase">Booking ID</span>
                  <p className="font-bold text-stone-800 text-sm">{booking.shortId}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 font-bold text-[9px] uppercase tracking-wider rounded-full border ${getStatusBadge(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-stone-600 font-bold uppercase block">Garment Style</span>
                  <span className="font-bold text-stone-800">{booking.design.name}</span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-600 font-bold uppercase block">Sizing Method</span>
                  <span className="font-semibold text-stone-700">{booking.measurementMethod}</span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-600 font-bold uppercase block">Appointment Slot</span>
                  <span className="font-bold text-stone-800">
                    {booking.appointment
                      ? new Date(booking.appointment.appointmentDate).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Not Scheduled'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-stone-600 font-bold uppercase block">Booked Date</span>
                  <span className="font-semibold text-stone-600">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
