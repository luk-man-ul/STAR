'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { useBookingStore } from '@/store/use-booking-store';
import { useSettingsStore } from '@/store/use-settings-store';

interface Design {
  id: string;
  name: string;
  code: string;
  price: number;
}

interface Address {
  id: string;
  addressLine1: string;
  city: string;
  isDefault: boolean;
}

const bookFormSchema = z.object({
  designId: z.string().min(1, 'Please select a catalog style'),
  measurementMethod: z.enum(['ONLINE', 'SHOP']),
  deliveryMethod: z.enum(['PICKUP', 'DELIVERY']),
  addressId: z.string().optional(),
  specialInstructions: z.string().optional(),
  appointmentDate: z.string().min(1, 'Please select appointment date'),
  appointmentTime: z.string().min(1, 'Please choose a time slot'),
});

type BookFormInput = z.infer<typeof bookFormSchema>;

export default function BookPage() {
  const router = useRouter();
  const setDraft = useBookingStore((state) => state.setDraft);
  const { settings, fetchSettings } = useSettingsStore();

  const [designs, setDesigns] = useState<Design[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookFormInput>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      measurementMethod: 'ONLINE',
      deliveryMethod: 'PICKUP',
    },
  });

  const selectedDelivery = watch('deliveryMethod');
  const selectedTime = watch('appointmentTime');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [designsRes, addressesRes] = await Promise.all([
          apiClient.get('/designs'),
          apiClient.get('/addresses').catch(() => ({ data: [] })),
          fetchSettings(),
        ]);
        setDesigns(designsRes.data.data || []);
        setAddresses(addressesRes.data || []);
      } catch (err) {
        setError('Failed to load catalog resources.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [fetchSettings]);

  if (settings?.status === 'CLOSED') {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-6 bg-white border border-stone-200 rounded-3xl shadow-sm space-y-6">
        <span className="text-5xl block">😴</span>
        <h1 className="text-2xl font-bold text-stone-850 font-serif">Currently Closed</h1>
        <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
          Star Stitcher is currently closed and not accepting online bookings. You can reach out directly via WhatsApp for any custom queries or consultations.
        </p>
        <a
          href={`https://wa.me/${settings.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex px-6 h-11 items-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-colors shadow-sm"
        >
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  const onSubmit = (data: BookFormInput) => {
    setError(null);
    
    // Validate appointment Date rules
    const dateObj = new Date(data.appointmentDate);
    const day = dateObj.getDay();
    if (day === 0) {
      setError('The boutique is closed on Sundays. Please select a Monday-Saturday date.');
      return;
    }

    const month = dateObj.getMonth();
    const dayOfMonth = dateObj.getDate();
    if ((month === 7 && dayOfMonth === 15) || (month === 0 && dayOfMonth === 26)) {
      setError('The boutique is closed on National Holidays.');
      return;
    }

    const design = designs.find((d) => d.id === data.designId);
    const address = addresses.find((a) => a.id === data.addressId);

    // Merge Date and Time into single ISO string
    const [hours, minutes] = data.appointmentTime.split(':');
    const mergedDate = new Date(data.appointmentDate);
    mergedDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    setDraft({
      designId: data.designId,
      designName: design?.name,
      designPrice: design?.price,
      measurementMethod: data.measurementMethod,
      deliveryMethod: data.deliveryMethod,
      addressId: data.addressId,
      addressText: address ? `${address.addressLine1}, ${address.city}` : undefined,
      specialInstructions: data.specialInstructions,
      appointmentDate: mergedDate.toISOString(),
    });

    router.push('/book/review');
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-stone-600">Loading lookbook and addresses details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-850 font-serif">Create Tailoring Booking</h1>
        <p className="text-stone-500 text-sm mt-1">Stitch your designer outfit with perfect custom fits</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-650 rounded-2xl text-xs text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-3xl border border-stone-200 space-y-6 shadow-sm">
        {/* Step 1: Select Design */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-stone-800">1. Select Garment Style</label>
          <select
            {...register('designId')}
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
          >
            <option value="">Select Catalog Design</option>
            {designs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.code}) - Starting at ₹{d.price.toLocaleString()}
              </option>
            ))}
          </select>
          {errors.designId && <p className="text-xs text-rose-500 mt-1">{errors.designId.message}</p>}
        </div>

        {/* Step 2: Sizing & Delivery Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-stone-800">2. Sizing Verification</label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 border border-stone-300 rounded-2xl py-3 px-4 text-xs font-semibold cursor-pointer select-none has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50/50">
                <input
                  type="radio"
                  value="ONLINE"
                  {...register('measurementMethod')}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                />
                Submit Online Sizes
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 border border-stone-300 rounded-2xl py-3 px-4 text-xs font-semibold cursor-pointer select-none has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50/50">
                <input
                  type="radio"
                  value="SHOP"
                  {...register('measurementMethod')}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                />
                In-Store Consultation
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-stone-800">3. Delivery Type</label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center justify-center gap-2 border border-stone-300 rounded-2xl py-3 px-4 text-xs font-semibold cursor-pointer select-none has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50/50">
                <input
                  type="radio"
                  value="PICKUP"
                  {...register('deliveryMethod')}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                />
                Self-Pickup
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 border border-stone-300 rounded-2xl py-3 px-4 text-xs font-semibold cursor-pointer select-none has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50/50">
                <input
                  type="radio"
                  value="DELIVERY"
                  {...register('deliveryMethod')}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                />
                Home Delivery
              </label>
            </div>
          </div>
        </div>

        {/* Saved Addresses Sub-Form */}
        {selectedDelivery === 'DELIVERY' && (
          <div className="space-y-2 pt-2 transition-all">
            <label className="block text-xs font-bold text-stone-750">Select Shipping Destination</label>
            {addresses.length === 0 ? (
              <div className="p-4 border border-dashed border-stone-300 rounded-2xl text-xs text-stone-500 bg-stone-50 text-center">
                No addresses saved. Please configure addresses under profile before scheduling delivery.
              </div>
            ) : (
              <select
                {...register('addressId')}
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
              >
                <option value="">Select Saved Address</option>
                {addresses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.addressLine1}, {a.city} {a.isDefault ? '(Default)' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Step 3: Choose Appointment Slot */}
        <div className="space-y-4 pt-2">
          <label className="block text-sm font-bold text-stone-800">4. Select Sizing Slot</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Appointment Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                {...register('appointmentDate')}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs bg-white"
              />
              {errors.appointmentDate && <p className="text-xs text-rose-500 mt-1">{errors.appointmentDate.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1">Select Time Slot</label>
              <select
                {...register('appointmentTime')}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs bg-white"
              >
                <option value="">Choose Time</option>
                {timeSlots.map((ts) => (
                  <option key={ts} value={ts}>
                    {ts}
                  </option>
                ))}
              </select>
              {errors.appointmentTime && <p className="text-xs text-rose-500 mt-1">{errors.appointmentTime.message}</p>}
            </div>
          </div>
        </div>

        {/* Special instructions */}
        <div className="space-y-2 pt-2">
          <label className="block text-sm font-bold text-stone-800">5. Saree Details & Style Notes (Optional)</label>
          <textarea
            {...register('specialInstructions')}
            rows={3}
            placeholder="e.g. want specific sleeve styles, back hook layouts..."
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-sm shadow-sm transition-all active:scale-98"
          >
            Review Booking Details
          </button>
        </div>
      </form>
    </div>
  );
}
