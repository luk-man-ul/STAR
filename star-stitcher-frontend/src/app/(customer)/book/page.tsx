'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

interface MeasurementProfile {
  id: string;
  profileName: string;
  isDefault: boolean;
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
}

const bookFormSchema = z.object({
  designId: z.string().min(1, 'Please select a catalog style'),
  measurementMethod: z.enum(['ONLINE', 'SHOP']),
  measurementId: z.string().optional(),
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
  const [measurementProfiles, setMeasurementProfiles] = useState<MeasurementProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const getLocalTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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

  const selectedMeasurementMethod = watch('measurementMethod');
  const selectedMeasurementId = watch('measurementId');
  const selectedDelivery = watch('deliveryMethod');
  const selectedTime = watch('appointmentTime');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [designsRes, addressesRes, profilesRes] = await Promise.all([
        apiClient.get('/designs'),
        apiClient.get('/addresses').catch(() => ({ data: [] })),
        apiClient.get('/measurements').catch(() => ({ data: [] })),
        fetchSettings(),
      ]);
      setDesigns(designsRes.data.data || []);
      setAddresses(addressesRes.data || []);

      const profiles: MeasurementProfile[] = Array.isArray(profilesRes.data) ? profilesRes.data : [];
      setMeasurementProfiles(profiles);

      // Preselect default profile if ONLINE method selected
      if (profiles.length > 0) {
        const defaultProfile = profiles.find((p) => p.isDefault) || profiles[0];
        if (defaultProfile) {
          setValue('measurementId', defaultProfile.id);
        }
      }
    } catch (err) {
      setError('Failed to load catalog resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [fetchSettings]);

  // Handle switching measurement method & auto-preselection
  useEffect(() => {
    if (selectedMeasurementMethod === 'ONLINE') {
      if (measurementProfiles.length > 0 && !selectedMeasurementId) {
        const defaultProfile = measurementProfiles.find((p) => p.isDefault) || measurementProfiles[0];
        if (defaultProfile) {
          setValue('measurementId', defaultProfile.id);
        }
      }
    } else {
      // Clear stale measurement selection when switching to SHOP
      setValue('measurementId', undefined);
    }
  }, [selectedMeasurementMethod, measurementProfiles, selectedMeasurementId, setValue]);

  if (settings?.status === 'CLOSED') {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-6 bg-white border border-stone-200 rounded-3xl shadow-sm space-y-6">
        <span className="text-5xl block">😴</span>
        <h1 className="text-2xl font-bold text-stone-900 font-serif">Currently Closed</h1>
        <p className="text-sm text-stone-600 max-w-xs mx-auto leading-relaxed">
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
    
    // Prevent scheduling appointments in the past
    if (data.appointmentDate < getLocalTodayString()) {
      setError('Appointments cannot be scheduled in the past.');
      return;
    }

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

    // ONLINE measurement validation
    let selectedProfile: MeasurementProfile | undefined = undefined;
    if (data.measurementMethod === 'ONLINE') {
      if (!data.measurementId || measurementProfiles.length === 0) {
        setError('You don\'t have any saved measurements yet. Please add a profile or select In-Store Consultation.');
        return;
      }

      selectedProfile = measurementProfiles.find((p) => p.id === data.measurementId);
      if (!selectedProfile) {
        setError('The selected measurement profile was not found. Please select a valid profile.');
        return;
      }
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
      measurementId: data.measurementMethod === 'ONLINE' ? data.measurementId : undefined,
      measurementProfileName: data.measurementMethod === 'ONLINE' ? selectedProfile?.profileName : undefined,
      deliveryMethod: data.deliveryMethod,
      addressId: data.addressId,
      addressText: address ? `${address.addressLine1}, ${address.city}` : undefined,
      specialInstructions: data.specialInstructions,
      appointmentDate: mergedDate.toISOString(),
    });

    router.push('/book/review');
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 py-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-7 bg-stone-200 rounded w-1/3"></div>
          <div className="h-4 bg-stone-200 rounded w-2/3"></div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-6 h-[400px]">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-stone-200 rounded w-1/4"></div>
              <div className="h-12 bg-stone-200 rounded-2xl w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && designs.length === 0 && !loading) {
    return (
      <div className="max-w-md mx-auto py-16 text-center flex flex-col items-center justify-center space-y-4">
        <span className="text-5xl">📶</span>
        <h2 className="text-xl font-bold text-stone-900 font-serif">Failed to Load Catalog</h2>
        <p className="text-sm text-stone-700 max-w-sm">
          We encountered an issue loading tailoring styles and catalog resources. Please check your connection.
        </p>
        <button
          onClick={loadData}
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif">Create Tailoring Booking</h1>
        <p className="text-stone-600 text-sm mt-1">Stitch your designer outfit with perfect custom fits</p>
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
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 bg-white"
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
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 border border-stone-300 rounded-2xl py-3 px-4 text-xs font-semibold cursor-pointer select-none text-stone-800 has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50/50">
                <input
                  type="radio"
                  value="ONLINE"
                  {...register('measurementMethod')}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                />
                Submit Online Sizes
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 border border-stone-300 rounded-2xl py-3 px-4 text-xs font-semibold cursor-pointer select-none text-stone-800 has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50/50">
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
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 flex items-center justify-center gap-2 border border-stone-300 rounded-2xl py-3 px-4 text-xs font-semibold cursor-pointer select-none text-stone-800 has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50/50">
                <input
                  type="radio"
                  value="PICKUP"
                  {...register('deliveryMethod')}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                />
                Self-Pickup
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 border border-stone-300 rounded-2xl py-3 px-4 text-xs font-semibold cursor-pointer select-none text-stone-800 has-[:checked]:border-rose-500 has-[:checked]:bg-rose-50/50">
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

        {/* Step 2.5: Measurement Profile Picker (for ONLINE sizing) */}
        {selectedMeasurementMethod === 'ONLINE' && (
          <div className="space-y-3 pt-2 transition-all">
            <label className="block text-xs font-bold text-stone-800">Whose measurements should we use?</label>
            
            {measurementProfiles.length === 0 ? (
              <div className="p-5 border border-dashed border-stone-300 rounded-2xl bg-stone-50 text-center space-y-3">
                <div className="text-stone-700 text-xs font-medium">
                  You don&apos;t have any saved measurements yet.
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    href="/customer/profile/measurements"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition-all shadow-sm"
                  >
                    Add Measurements
                  </Link>
                  <button
                    type="button"
                    onClick={() => setValue('measurementMethod', 'SHOP')}
                    className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-white rounded-full text-xs font-semibold transition-all"
                  >
                    Use In-Store Consultation
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Measurement Profiles">
                {measurementProfiles.map((p) => {
                  const isSelected = selectedMeasurementId === p.id;
                  const filledCount = [
                    p.bust, p.underBust, p.waist, p.hip, p.shoulder, p.neck,
                    p.armHole, p.sleeveLength, p.sleeveRound, p.frontNeckDepth,
                    p.backNeckDepth, p.totalLength, p.bottomRound
                  ].filter((val) => val !== null && val !== undefined).length;

                  return (
                    <div
                      key={p.id}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onClick={() => setValue('measurementId', p.id, { shouldValidate: true })}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          setValue('measurementId', p.id, { shouldValidate: true });
                        }
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 select-none focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/50 shadow-sm ring-1 ring-rose-500'
                          : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-sm">{p.profileName}</span>
                          {p.isDefault && (
                            <span className="px-2 py-0.5 bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-extrabold tracking-wider rounded-full uppercase">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-rose-600 bg-rose-600' : 'border-stone-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-xs text-stone-500 font-medium">
                        {filledCount > 0 ? `${filledCount} measurements saved` : 'Standard profile'}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            {errors.measurementId && (
              <p className="text-xs text-rose-500 mt-1">{errors.measurementId.message}</p>
            )}
          </div>
        )}

        {/* Saved Addresses Sub-Form */}
        {selectedDelivery === 'DELIVERY' && (
          <div className="space-y-2 pt-2 transition-all">
            <label className="block text-xs font-bold text-stone-800">Select Shipping Destination</label>
            {addresses.length === 0 ? (
              <div className="p-4 border border-dashed border-stone-300 rounded-2xl text-xs text-stone-600 bg-stone-50 text-center">
                No addresses saved. Please configure addresses under profile before scheduling delivery.
              </div>
            ) : (
              <select
                {...register('addressId')}
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 bg-white"
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
              <label className="block text-xs font-semibold text-stone-800 mb-1">Appointment Date</label>
              <input
                type="date"
                min={getLocalTodayString()}
                {...register('appointmentDate')}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 bg-white"
              />
              {errors.appointmentDate && <p className="text-xs text-rose-500 mt-1">{errors.appointmentDate.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">Select Time Slot</label>
              <select
                {...register('appointmentTime')}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 bg-white"
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
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 placeholder:text-stone-500 bg-white"
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
