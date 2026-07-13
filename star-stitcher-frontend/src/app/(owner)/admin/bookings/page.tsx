'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

interface Customer {
  name: string;
  phone: string;
  email: string;
}

interface Appointment {
  id: string;
  appointmentDate: string;
  status: string;
}

interface Design {
  name: string;
  code: string;
  price: number;
}

interface Booking {
  id: string;
  shortId: string;
  status: string;
  measurementMethod: string;
  deliveryMethod: string;
  specialInstructions?: string;
  createdAt: string;
  customer: Customer;
  design: Design;
  appointment?: Appointment | null;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Reschedule state
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/bookings/admin');
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleApprove = async (id: string) => {
    setError(null);
    try {
      await apiClient.patch(`/bookings/${id}/approve`);
      await loadBookings();
    } catch (err) {
      setError('Failed to approve booking.');
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this booking?')) return;
    setError(null);
    try {
      await apiClient.patch(`/bookings/${id}/reject`);
      await loadBookings();
    } catch (err) {
      setError('Failed to reject booking.');
    }
  };

  const handleMarkArrived = async (id: string) => {
    setError(null);
    try {
      await apiClient.patch(`/bookings/${id}/arrive`);
      await loadBookings();
    } catch (err) {
      setError('Failed to mark customer as arrived.');
    }
  };

  const handleConvertToOrder = async (id: string) => {
    setError(null);
    try {
      const response = await apiClient.post(`/bookings/${id}/convert`);
      alert(`Stitching Order created successfully! Ref: ${response.data.shortId}`);
      await loadBookings();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to convert booking to order.');
    }
  };

  const handleRescheduleClick = (booking: Booking) => {
    setReschedulingBooking(booking);
    if (booking.appointment) {
      const dateStr = new Date(booking.appointment.appointmentDate).toISOString().split('T')[0];
      setRescheduleDate(dateStr);
    }
    setShowRescheduleModal(true);
  };

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBooking || !rescheduleDate || !rescheduleTime) return;

    setError(null);
    setActionLoading(true);
    try {
      const [hours, minutes] = rescheduleTime.split(':');
      const mergedDate = new Date(rescheduleDate);
      mergedDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

      // Sundays validation
      if (mergedDate.getDay() === 0) {
        throw new Error('The boutique is closed on Sundays.');
      }

      await apiClient.patch(`/bookings/${reschedulingBooking.id}/reschedule`, {
        appointmentDate: mergedDate.toISOString(),
      });

      setShowRescheduleModal(false);
      setReschedulingBooking(null);
      await loadBookings();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to reschedule.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-700';
      case 'APPROVED':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-700';
      case 'CONVERTED':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-stone-200 text-stone-700';
    }
  };

  const getAppointmentBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-700';
      case 'RESCHEDULED':
        return 'bg-amber-100 text-amber-700';
      case 'ARRIVED':
        return 'bg-green-100 text-green-700';
      case 'MISSED':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-stone-200 text-stone-700';
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      booking.shortId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-850 font-serif">Customer Bookings Queue</h1>
        <p className="text-xs text-stone-500 mt-1">Review sizing consultation request workflows and approve orders</p>
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
            placeholder="Search by customer name or ref ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs bg-stone-50"
          />
          <span className="absolute left-3 top-3.5 text-stone-400 text-xs">🔍</span>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs bg-stone-50"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CONVERTED">Converted to Order</option>
          </select>
        </div>

        <div className="text-right text-xs text-stone-500 font-semibold">
          Total Bookings: {filteredBookings.length}
        </div>
      </div>

      {/* Main listings */}
      {loading && bookings.length === 0 ? (
        <div className="text-center py-12 text-xs text-stone-500">Loading bookings list...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white p-12 text-center border border-stone-200 rounded-3xl text-xs text-stone-500 shadow-sm">
          No bookings match your current filter settings.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-stone-100 pb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-[10px] text-stone-400 font-bold uppercase">Reference ID</span>
                    <p className="font-bold text-stone-850 text-sm">{booking.shortId}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 font-bold text-[9px] uppercase tracking-wider rounded-full ${getStatusBadge(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="text-xs text-stone-500 font-medium">
                  Booked: {new Date(booking.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Grid content info */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">Customer Profile</span>
                  <p className="font-bold text-stone-850">{booking.customer.name}</p>
                  <p className="text-stone-500">{booking.customer.phone}</p>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">Lookbook Choice</span>
                  <p className="font-bold text-stone-800">{booking.design.name}</p>
                  <p className="text-rose-600 font-bold">₹{booking.design.price.toLocaleString()}</p>
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">Sizing Appointment</span>
                  <p className="font-bold text-stone-850">
                    {booking.appointment
                      ? new Date(booking.appointment.appointmentDate).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Not Scheduled'}
                  </p>
                  {booking.appointment && (
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[8px] font-bold uppercase ${getAppointmentBadge(booking.appointment.status)}`}>
                      {booking.appointment.status}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase block mb-1">Logistics / Sizing</span>
                  <p className="font-semibold text-stone-700">Measurements: {booking.measurementMethod}</p>
                  <p className="text-stone-500">Delivery: {booking.deliveryMethod}</p>
                </div>
              </div>

              {booking.specialInstructions && (
                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-150 text-xs text-stone-600 leading-relaxed">
                  <strong>Notes:</strong> {booking.specialInstructions}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100 justify-end">
                {booking.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleApprove(booking.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => handleReject(booking.id)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-full text-xs font-semibold transition-colors"
                    >
                      Reject Request
                    </button>
                  </>
                )}

                {booking.status === 'APPROVED' && (
                  <>
                    {booking.appointment && booking.appointment.status !== 'ARRIVED' && (
                      <button
                        onClick={() => handleMarkArrived(booking.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
                      >
                        Mark Arrived
                      </button>
                    )}
                    <button
                      onClick={() => handleConvertToOrder(booking.id)}
                      className="px-4 py-2 bg-indigo-650 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
                    >
                      Convert to Stitching Order
                    </button>
                  </>
                )}

                {booking.status !== 'CONVERTED' && booking.status !== 'REJECTED' && (
                  <button
                    onClick={() => handleRescheduleClick(booking)}
                    className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-600 rounded-full text-xs font-semibold transition-colors"
                  >
                    Reschedule
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reschedule Modal Box */}
      {showRescheduleModal && reschedulingBooking && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 relative space-y-6 shadow-2xl border border-stone-150">
            <button
              onClick={() => {
                setShowRescheduleModal(false);
                setReschedulingBooking(null);
              }}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-850 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-stone-850 font-serif">Reschedule Sizing Appointment</h2>
            <p className="text-xs text-stone-500">
              Rescheduling booking reference: <strong>{reschedulingBooking.shortId}</strong>
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">New Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">New Time Slot</label>
                  <select
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs bg-white"
                    required
                  >
                    <option value="">Choose Time</option>
                    {timeSlots.map((ts) => (
                      <option key={ts} value={ts}>
                        {ts}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold text-xs transition-colors"
                >
                  {actionLoading ? 'Rescheduling...' : 'Save Reschedule'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setReschedulingBooking(null);
                  }}
                  className="flex-1 h-11 border border-stone-300 text-stone-600 rounded-full font-semibold text-xs transition-colors hover:bg-stone-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
