'use client';

import React, { useEffect, useRef } from 'react';

export interface BookingDetails {
  shortId?: string;
  designName?: string;
  designPrice?: number;
  measurementMethod: string;
  measurementProfileName?: string;
  deliveryMethod: string;
  addressText?: string;
  specialInstructions?: string;
  appointmentDate: string;
}

interface AppointmentSuccessModalProps {
  isOpen: boolean;
  booking: BookingDetails | null;
  onViewBookings: () => void;
  onNewAppointment: () => void;
  onBackToDashboard: () => void;
}

export function AppointmentSuccessModal({
  isOpen,
  booking,
  onViewBookings,
  onNewAppointment,
  onBackToDashboard,
}: AppointmentSuccessModalProps) {
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus primary button when modal opens
      primaryButtonRef.current?.focus();

      // Handle Escape key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onViewBookings();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onViewBookings]);

  if (!isOpen || !booking) return null;

  const formattedDate = new Date(booking.appointmentDate).toLocaleString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 relative space-y-6 shadow-2xl border border-stone-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Badge */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center text-2xl font-extrabold mx-auto shadow-sm">
            ✓
          </div>
          <h2 id="success-modal-title" className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
            Appointment Request Submitted
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm mx-auto">
            Thank you! We&apos;ve received your appointment request and it is awaiting confirmation from our team.
          </p>
          {booking.shortId && (
            <div className="pt-1">
              <span className="inline-block px-3.5 py-1 bg-stone-100 border border-stone-200 rounded-full text-xs font-bold text-stone-700 tracking-wide font-mono">
                Booking Ref: {booking.shortId}
              </span>
            </div>
          )}
        </div>

        {/* Booking Summary Card */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2.5 text-xs">
          <span className="font-bold text-stone-800 text-xs block uppercase tracking-wider border-b border-stone-200 pb-2">
            Appointment Details
          </span>

          {booking.designName && (
            <div className="flex justify-between items-center py-1">
              <span className="text-stone-500 font-medium">Garment Style</span>
              <span className="font-bold text-stone-800">
                {booking.designName}{' '}
                {booking.designPrice ? `(₹${booking.designPrice.toLocaleString()})` : ''}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-1">
            <span className="text-stone-500 font-medium">Date & Time Slot</span>
            <span className="font-extrabold text-rose-700">{formattedDate}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-stone-500 font-medium">Sizing Verification</span>
            <span className="font-semibold text-stone-800">
              {booking.measurementMethod === 'ONLINE' ? 'Submit Online Sizes' : 'In-Store Consultation'}
            </span>
          </div>

          {booking.measurementMethod === 'ONLINE' && booking.measurementProfileName && (
            <div className="flex justify-between items-center py-1">
              <span className="text-stone-500 font-medium">Measurement Profile</span>
              <span className="font-bold text-rose-700">{booking.measurementProfileName}</span>
            </div>
          )}

          <div className="flex justify-between items-center py-1">
            <span className="text-stone-500 font-medium">Delivery Type</span>
            <span className="font-semibold text-stone-800">
              {booking.deliveryMethod === 'DELIVERY' ? 'Home Delivery' : 'Self-Pickup'}
            </span>
          </div>

          {booking.addressText && (
            <div className="flex justify-between items-start py-1 gap-2">
              <span className="text-stone-500 font-medium shrink-0">Destination</span>
              <span className="font-medium text-stone-700 text-right">{booking.addressText}</span>
            </div>
          )}

          {booking.specialInstructions && (
            <div className="pt-2 border-t border-stone-200/60">
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-1">
                Notes / Instructions
              </span>
              <p className="text-stone-600 italic text-[11px] leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200/80">
                {booking.specialInstructions}
              </p>
            </div>
          )}
        </div>

        {/* What Happens Next Guidance */}
        <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 space-y-2 text-xs">
          <span className="font-bold text-rose-950 text-xs block uppercase tracking-wider">
            What Happens Next
          </span>
          <ul className="space-y-1.5 text-stone-700 text-xs">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✔</span>
              <span>Our team will review your appointment request.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✔</span>
              <span>You can track its status anytime from My Bookings.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✔</span>
              <span>We&apos;ll contact you if additional information is needed.</span>
            </li>
          </ul>
        </div>

        {/* Reassurance Message */}
        <p className="text-[11px] text-stone-500 text-center italic">
          Need to make changes? You can contact us or create a new appointment anytime.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              ref={primaryButtonRef}
              onClick={onViewBookings}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs tracking-wide shadow-sm transition-all active:scale-98 flex items-center justify-center cursor-pointer"
            >
              View My Bookings
            </button>
            <button
              onClick={onNewAppointment}
              className="flex-1 h-12 border border-stone-300 text-stone-700 hover:bg-stone-50 hover:text-stone-900 rounded-full font-bold text-xs tracking-wide transition-colors flex items-center justify-center cursor-pointer"
            >
              New Appointment
            </button>
          </div>
          <button
            onClick={onBackToDashboard}
            className="w-full text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors py-1 block text-center cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
