'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/store/use-booking-store';
import apiClient from '@/lib/api-client';
import { AppointmentSuccessModal, BookingDetails } from '@/components/customer/appointment-success-modal';

export default function BookReviewPage() {
  const router = useRouter();
  const { draft, clearDraft } = useBookingStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<BookingDetails | null>(null);

  useEffect(() => {
    // Redirect back to booking entry if no draft is present and no successful submission modal is active
    if (!draft && !submittedBooking) {
      router.replace('/book');
    }
  }, [draft, submittedBooking, router]);

  const handleConfirm = async () => {
    if (!draft) return;
    setError(null);
    setLoading(true);
    try {
      const res = await apiClient.post('/bookings', {
        designId: draft.designId,
        measurementMethod: draft.measurementMethod,
        measurementId: draft.measurementMethod === 'ONLINE' ? draft.measurementId : undefined,
        deliveryMethod: draft.deliveryMethod,
        addressId: draft.addressId,
        specialInstructions: draft.specialInstructions,
        appointmentDate: draft.appointmentDate,
      });

      setSubmittedBooking({
        shortId: res.data?.shortId,
        designName: draft.designName,
        designPrice: draft.designPrice,
        measurementMethod: draft.measurementMethod,
        measurementProfileName: draft.measurementProfileName,
        deliveryMethod: draft.deliveryMethod,
        addressText: draft.addressText,
        specialInstructions: draft.specialInstructions,
        appointmentDate: draft.appointmentDate,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit booking slot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewBookings = () => {
    clearDraft();
    setSubmittedBooking(null);
    router.push('/customer/bookings');
  };

  const handleNewAppointment = () => {
    clearDraft();
    setSubmittedBooking(null);
    router.push('/book');
  };

  const handleBackToDashboard = () => {
    clearDraft();
    setSubmittedBooking(null);
    router.push('/dashboard');
  };

  if (!draft && !submittedBooking) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif">Review Booking</h1>
        <p className="text-stone-600 text-sm mt-1">Please review your scheduling choices before submission</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-650 rounded-2xl text-xs text-center font-medium">
          {error}
        </div>
      )}

      {draft && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-6">
          <div className="space-y-4">
            <div className="border-b border-stone-150 pb-3 flex justify-between items-center">
              <span className="text-xs text-stone-600 uppercase font-bold tracking-wider">Garment Style</span>
              <span className="text-sm font-bold text-stone-800">{draft.designName}</span>
            </div>

            <div className="border-b border-stone-150 pb-3 flex justify-between items-center">
              <span className="text-xs text-stone-600 uppercase font-bold tracking-wider">Stitching Price</span>
              <span className="text-sm font-extrabold text-rose-600">₹{draft.designPrice?.toLocaleString()}</span>
            </div>

            <div className="border-b border-stone-150 pb-3 flex justify-between items-center">
              <span className="text-xs text-stone-600 uppercase font-bold tracking-wider">Sizing Method</span>
              <span className="text-sm font-bold text-stone-800">{draft.measurementMethod}</span>
            </div>

            {draft.measurementMethod === 'ONLINE' && draft.measurementProfileName && (
              <div className="border-b border-stone-150 pb-3 flex justify-between items-center">
                <span className="text-xs text-stone-600 uppercase font-bold tracking-wider">Measurement Profile</span>
                <span className="text-sm font-bold text-rose-700">{draft.measurementProfileName}</span>
              </div>
            )}

            <div className="border-b border-stone-150 pb-3 flex justify-between items-center">
              <span className="text-xs text-stone-600 uppercase font-bold tracking-wider">Delivery Mode</span>
              <span className="text-sm font-bold text-stone-800">{draft.deliveryMethod}</span>
            </div>

            {draft.addressText && (
              <div className="border-b border-stone-150 pb-3 flex justify-between items-start gap-4">
                <span className="text-xs text-stone-600 uppercase font-bold tracking-wider whitespace-nowrap">Shipping Destination</span>
                <span className="text-sm font-semibold text-stone-600 text-right">{draft.addressText}</span>
              </div>
            )}

            <div className="border-b border-stone-150 pb-3 flex justify-between items-start gap-4">
              <span className="text-xs text-stone-600 uppercase font-bold tracking-wider whitespace-nowrap">Appointment Date</span>
              <span className="text-sm font-extrabold text-stone-900 text-right">
                {new Date(draft.appointmentDate).toLocaleString([], {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {draft.specialInstructions && (
              <div className="space-y-1">
                <span className="text-[10px] text-stone-600 uppercase font-bold tracking-wider block">Special Instructions</span>
                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-150">
                  {draft.specialInstructions}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-sm shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Submitting...' : 'Confirm & Book'}
            </button>
            <button
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1 h-12 border border-stone-300 text-stone-700 hover:text-stone-900 rounded-full font-bold text-sm transition-colors hover:bg-stone-50 disabled:opacity-50 cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <AppointmentSuccessModal
        isOpen={!!submittedBooking}
        booking={submittedBooking}
        onViewBookings={handleViewBookings}
        onNewAppointment={handleNewAppointment}
        onBackToDashboard={handleBackToDashboard}
      />
    </div>
  );
}

