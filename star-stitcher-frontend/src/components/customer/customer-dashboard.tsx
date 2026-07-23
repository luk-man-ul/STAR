'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';
import { useSettingsStore } from '@/store/use-settings-store';

interface Appointment {
  id: string;
  appointmentDate: string;
  status: string;
}

interface Design {
  id: string;
  name: string;
  code: string;
  price: number;
  imageUrl?: string;
  imageIcon?: string;
  category?: { name: string } | any;
}

interface Booking {
  id: string;
  shortId: string;
  status: string;
  measurementMethod: string;
  deliveryMethod: string;
  createdAt: string;
  updatedAt: string;
  design: Design;
  appointment?: Appointment | null;
  shippingAddress?: any;
}

interface Address {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

interface Measurement {
  id: string;
  bust?: number | null;
  underBust?: number | null;
  waist?: number | null;
  hip?: number | null;
  shoulder?: number | null;
  neck?: number | null;
  armHole?: number | null;
  sleeveLength?: number | null;
  sleeveRound?: number | null;
  frontNeckDepth?: number | null;
  backNeckDepth?: number | null;
  totalLength?: number | null;
  bottomRound?: number | null;
  updatedAt: string;
}

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const { settings, fetchSettings } = useSettingsStore();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [measurements, setMeasurements] = useState<Measurement | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [bookingsRes, measurementsRes, addressesRes, designsRes, settingsRes] = await Promise.all([
        apiClient.get('/bookings/customer').catch(() => ({ data: [] })),
        apiClient.get('/measurements').catch(() => ({ data: null })),
        apiClient.get('/addresses').catch(() => ({ data: [] })),
        apiClient.get('/designs?limit=20').catch(() => ({ data: { data: [] } })),
        fetchSettings().catch(() => null),
      ]);

      setBookings(bookingsRes.data || []);
      const profiles = measurementsRes.data;
      const defaultProfile = Array.isArray(profiles) ? (profiles.find((p: any) => p.isDefault) || profiles[0] || null) : (profiles || null);
      setMeasurements(defaultProfile);
      setAddresses(addressesRes.data || []);
      
      const rawDesigns = designsRes.data?.data || [];
      // Grab up to 3 featured designs or the first 3 active ones
      const recommended = rawDesigns
        .filter((d: any) => d.isActive)
        .sort((a: any, b: any) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        .slice(0, 3);
      setDesigns(recommended);
    } catch (err) {
      setError('Some dashboard data could not be retrieved. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const countSetMeasurements = (m: Measurement | null) => {
    if (!m) return 0;
    const fields: (keyof Measurement)[] = [
      'bust', 'underBust', 'waist', 'hip', 'shoulder', 'neck',
      'armHole', 'sleeveLength', 'sleeveRound', 'frontNeckDepth',
      'backNeckDepth', 'totalLength', 'bottomRound'
    ];
    return fields.filter(field => m[field] !== null && m[field] !== undefined && m[field] !== '').length;
  };

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
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const activeStitching = bookings.filter(b => b.status === 'CONVERTED');
  
  const upcomingAppointments = bookings
    .filter(b => b.status === 'APPROVED' && b.appointment && new Date(b.appointment.appointmentDate) >= new Date())
    .sort((a, b) => new Date(a.appointment!.appointmentDate).getTime() - new Date(b.appointment!.appointmentDate).getTime());
  
  const nextAppointment = upcomingAppointments[0] || null;

  const recentTimelineEvents = [...bookings]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getTimelineText = (booking: Booking) => {
    const name = booking.design?.name || 'Garment';
    switch (booking.status) {
      case 'PENDING':
        return `Fitting appointment requested for ${name}.`;
      case 'APPROVED':
        return `Fitting session confirmed for ${name}.`;
      case 'REJECTED':
        return `Fitting request for ${name} could not be scheduled.`;
      case 'CANCELLED':
        return `Fitting request for ${name} was cancelled.`;
      case 'CONVERTED':
        return `Converted to Active Stitching order for ${name}.`;
      default:
        return `Status updated for ${name} request.`;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse" aria-hidden="true">
        {/* Banner Skeleton */}
        <div className="h-32 bg-stone-200 rounded-3xl w-full"></div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-24 bg-stone-200 rounded-3xl"></div>
          <div className="h-24 bg-stone-200 rounded-3xl"></div>
          <div className="h-24 bg-stone-200 rounded-3xl"></div>
          <div className="h-24 bg-stone-200 rounded-3xl"></div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="h-40 bg-stone-200 rounded-3xl"></div>
            <div className="h-48 bg-stone-200 rounded-3xl"></div>
            <div className="h-48 bg-stone-200 rounded-3xl"></div>
          </div>
          <div className="lg:col-span-4 space-y-8">
            <div className="h-64 bg-stone-200 rounded-3xl"></div>
            <div className="h-64 bg-stone-200 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-50/60 to-stone-100/60 p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif">
            Hello, {user?.name || 'Valued Customer'}!
          </h1>
          <p className="text-[11px] sm:text-xs text-stone-600 font-medium">
            {getFormattedDate()}
          </p>
          <p className="text-xs sm:text-sm text-stone-700 pt-1">
            Welcome to your Star Stitcher workspace. Track stitching updates and manage sizing profiles.
          </p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-lg sm:text-xl font-bold border border-rose-200 shadow-inner select-none shrink-0 self-end sm:self-auto">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Stitching */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3 sm:gap-4">
          <div className="text-xl sm:text-2xl bg-indigo-50 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center select-none text-indigo-600 shrink-0">
            🪡
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-stone-500 uppercase tracking-wider truncate">Active Stitching</p>
            <p className="text-base sm:text-lg font-bold text-stone-850">{activeStitching.length}</p>
          </div>
        </div>

        {/* Upcoming appointments */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3 sm:gap-4">
          <div className="text-xl sm:text-2xl bg-green-50 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center select-none text-green-600 shrink-0">
            📅
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-stone-500 uppercase tracking-wider truncate">Fittings Scheduled</p>
            <p className="text-base sm:text-lg font-bold text-stone-850">{upcomingAppointments.length}</p>
          </div>
        </div>

        {/* Measurements */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3 sm:gap-4">
          <div className="text-xl sm:text-2xl bg-amber-50 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center select-none text-amber-600 shrink-0">
            📏
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-stone-500 uppercase tracking-wider truncate">Sizing Metrics</p>
            <p className="text-base sm:text-lg font-bold text-stone-850">
              {measurements ? `${countSetMeasurements(measurements)}/13` : '0/13'}
            </p>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-3 sm:gap-4">
          <div className="text-xl sm:text-2xl bg-rose-50 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center select-none text-rose-600 shrink-0">
            📍
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] font-bold text-stone-500 uppercase tracking-wider truncate">Saved Addresses</p>
            <p className="text-base sm:text-lg font-bold text-stone-850">{addresses.length}</p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Section (Main content) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-800 font-serif">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link 
                href="/book"
                className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md hover:border-rose-300 hover:bg-rose-50/10 transition-all text-center space-y-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <span className="text-2xl block group-hover:scale-110 transition-transform select-none">📅</span>
                <span className="font-bold text-stone-800 text-xs block">Book Fitting</span>
                <span className="text-[9px] text-stone-500 block leading-tight">Schedule boutique slot</span>
              </Link>
              <Link 
                href="/designs"
                className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md hover:border-rose-300 hover:bg-rose-50/10 transition-all text-center space-y-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <span className="text-2xl block group-hover:scale-110 transition-transform select-none">🎨</span>
                <span className="font-bold text-stone-800 text-xs block">Browse Lookbook</span>
                <span className="text-[9px] text-stone-500 block leading-tight">Explore style catalog</span>
              </Link>
              <Link 
                href="/profile/measurements"
                className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md hover:border-rose-300 hover:bg-rose-50/10 transition-all text-center space-y-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <span className="text-2xl block group-hover:scale-110 transition-transform select-none">📏</span>
                <span className="font-bold text-stone-800 text-xs block">Manage Sizing</span>
                <span className="text-[9px] text-stone-500 block leading-tight">Update measurements</span>
              </Link>
              <Link 
                href="/profile"
                className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm hover:shadow-md hover:border-rose-300 hover:bg-rose-50/10 transition-all text-center space-y-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <span className="text-2xl block group-hover:scale-110 transition-transform select-none">👤</span>
                <span className="font-bold text-stone-800 text-xs block">Account Info</span>
                <span className="text-[9px] text-stone-500 block leading-tight">Update contact details</span>
              </Link>
            </div>
          </div>

          {/* Current Stitching (Active Orders) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-800 font-serif">Current Stitching</h2>
            {activeStitching.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm text-center space-y-4">
                <span className="text-4xl block select-none">🪡</span>
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-800 text-sm">No active stitching orders</h3>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Choose one of our catalog styles and schedule an appointment to start custom fitting.
                  </p>
                </div>
                <Link 
                  href="/designs"
                  className="inline-flex h-10 px-5 bg-rose-600 hover:bg-rose-700 text-white items-center justify-center rounded-full text-xs font-semibold shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeStitching.map(bk => (
                  <div key={bk.id} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9px] text-rose-600 font-bold uppercase tracking-wider">
                          {bk.design?.code || 'SS-CODE'}
                        </span>
                        <span className={`px-2 py-0.5 border rounded text-[8px] font-bold uppercase ${getStatusBadge(bk.status)}`}>
                          Stitching
                        </span>
                      </div>
                      <h3 className="font-bold text-stone-800 text-sm">{bk.design?.name}</h3>
                      <p className="text-[10px] text-stone-600 leading-tight">
                        Order code: <span className="font-semibold text-stone-700">{bk.shortId}</span>
                      </p>
                      <p className="text-[10px] text-stone-500">
                        Fitting date: {new Date(bk.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link 
                      href="/customer/bookings"
                      className="inline-flex h-9 border border-stone-300 hover:bg-stone-50 text-stone-700 items-center justify-center rounded-full text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      View Order Status
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Appointment */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-800 font-serif">Upcoming Fittings</h2>
            {!nextAppointment ? (
              <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm text-center space-y-4">
                <span className="text-4xl block select-none">📅</span>
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-800 text-sm">No scheduled fittings</h3>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Schedule a fitting session to provide measurements or bring your fabrics to the shop.
                  </p>
                </div>
                <Link 
                  href="/book"
                  className="inline-flex h-10 px-5 bg-rose-600 hover:bg-rose-700 text-white items-center justify-center rounded-full text-xs font-semibold shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  Schedule Sizing
                </Link>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl select-none">📅</span>
                    <div>
                      <h3 className="font-bold text-stone-800 text-sm">
                        {new Date(nextAppointment.appointment!.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </h3>
                      <p className="text-[10px] text-stone-600">
                        Fitting slot: <span className="font-semibold text-stone-700">{new Date(nextAppointment.appointment!.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 border rounded text-[8px] font-bold uppercase bg-green-100 text-green-700 border-green-200">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-stone-600 text-[10px]">Stitching Style</p>
                    <p className="font-bold text-stone-800 mt-0.5">{nextAppointment.design?.name}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-600 text-[10px]">Sizing Method</p>
                    <p className="font-bold text-stone-800 mt-0.5">
                      {nextAppointment.measurementMethod === 'SHOP' ? 'Boutique Visit' : 'Online Profile'}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-600 text-[10px]">Fulfillment</p>
                    <p className="font-bold text-stone-800 mt-0.5">
                      {nextAppointment.deliveryMethod === 'DELIVERY' ? 'Home Delivery' : 'Pickup at Boutique'}
                    </p>
                  </div>
                  {nextAppointment.shippingAddress && (
                    <div>
                      <p className="font-semibold text-stone-600 text-[10px]">Delivery Address</p>
                      <p className="text-stone-750 font-medium truncate mt-0.5" title={nextAppointment.shippingAddress.addressLine1}>
                        {nextAppointment.shippingAddress.addressLine1}, {nextAppointment.shippingAddress.city}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex gap-3">
                  <Link 
                    href="/customer/bookings"
                    className="flex-1 h-10 border border-stone-300 hover:bg-stone-50 text-stone-700 items-center justify-center rounded-full text-xs font-semibold flex transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    Manage Appointments
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Designs */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-stone-800 font-serif">Recommended Styles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {designs.map(design => (
                <Link 
                  href="/designs"
                  key={design.id}
                  className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  <div className="h-36 bg-rose-50/50 flex items-center justify-center text-4xl select-none relative overflow-hidden shrink-0">
                    {design.imageUrl ? (
                      <Image
                        src={design.imageUrl}
                        alt={design.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span>👗</span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[9px] text-rose-600 font-bold uppercase tracking-wider">
                        {design.category?.name || 'Lookbook'}
                      </span>
                      <h3 className="font-bold text-stone-800 text-xs truncate mt-0.5">{design.name}</h3>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-stone-100">
                      <span className="text-xs font-bold text-stone-800">₹{design.price}</span>
                      <span className="text-[9px] text-rose-600 font-bold group-hover:underline">View Catalog →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right Section (Sidebar content) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Measurement Status */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-stone-800 font-serif border-b border-stone-100 pb-2 flex justify-between items-center">
              <span>Sizing Profile</span>
              {measurements ? (
                <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-150 rounded text-[9px] font-bold uppercase">
                  Saved
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-150 rounded text-[9px] font-bold uppercase">
                  Missing
                </span>
              )}
            </h2>

            {measurements ? (
              <div className="space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed">
                  Your body sizing measurements are set. The boutique tailors use this profile to stitch custom fabrics.
                </p>
                
                {/* Sizing Previews */}
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[9px] font-semibold text-stone-500 uppercase block">Bust</span>
                    <span className="font-bold text-stone-800 mt-0.5 block">{measurements.bust ? `${measurements.bust}"` : '-'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-semibold text-stone-500 uppercase block">Waist</span>
                    <span className="font-bold text-stone-800 mt-0.5 block">{measurements.waist ? `${measurements.waist}"` : '-'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-semibold text-stone-500 uppercase block">Hip</span>
                    <span className="font-bold text-stone-800 mt-0.5 block">{measurements.hip ? `${measurements.hip}"` : '-'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-stone-500">
                    Last updated: {new Date(measurements.updatedAt).toLocaleDateString()}
                  </p>
                  <Link 
                    href="/profile/measurements"
                    className="w-full h-10 border border-stone-300 hover:bg-stone-50 text-stone-700 items-center justify-center rounded-full text-xs font-semibold flex transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    Update Sizing Sheets
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-stone-600 leading-relaxed">
                  We don&apos;t have your size dimensions saved. Complete your sizing profile so we can guarantee a flawless fit.
                </p>
                <div className="bg-amber-50/50 p-4 border border-amber-200 rounded-2xl text-[11px] leading-relaxed text-amber-800">
                  ⚠️ Complete your measurement profile before booking fitting sessions to request online sizing approvals.
                </div>
                <Link 
                  href="/profile/measurements"
                  className="w-full h-10 bg-rose-600 hover:bg-rose-700 text-white items-center justify-center rounded-full text-xs font-semibold flex transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  Configure Sizing Now
                </Link>
              </div>
            )}
          </div>

          {/* Shop Information */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-800 font-serif border-b border-stone-100 pb-2 flex justify-between items-center">
              <span>Boutique Details</span>
              {settings?.status === 'OPEN' ? (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-bold uppercase tracking-wider">
                  Open Today
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-stone-200 text-stone-600 rounded text-[9px] font-bold uppercase tracking-wider">
                  Closed
                </span>
              )}
            </h2>

            <div className="text-xs space-y-3 text-stone-700">
              <div>
                <p className="font-bold text-stone-850">📍 Location Address</p>
                <p className="text-stone-600 mt-1 leading-normal">
                  {settings?.address || 'KPR Rao Road, Old Bus Stand, Kasaragod, Kerala - 671121'}
                </p>
              </div>

              <div>
                <p className="font-bold text-stone-850">🕒 Business Hours</p>
                <p className="text-stone-600 mt-1 leading-normal">
                  Monday - Saturday: 10:00 AM - 7:30 PM <br />
                  Sunday: Closed
                </p>
              </div>

              <div>
                <p className="font-bold text-stone-850">📞 Telephone Support</p>
                <p className="text-stone-600 mt-1">{settings?.phone || '+91 9895634218'}</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a 
                href={`https://wa.me/${(settings?.whatsapp || '919895634218').replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white items-center justify-center rounded-full text-xs font-semibold flex gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span>💬</span> WhatsApp Boutique
              </a>
              <a 
                href={`tel:${settings?.phone || '+919895634218'}`}
                className="w-full h-10 border border-stone-300 hover:bg-stone-50 text-stone-700 items-center justify-center rounded-full text-xs font-semibold flex gap-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <span>📞</span> Contact Tailoring Team
              </a>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-800 font-serif border-b border-stone-100 pb-2">
              Recent Activity
            </h2>
            {recentTimelineEvents.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-4">No recent activities logged.</p>
            ) : (
              <div className="relative border-l border-stone-200 pl-4 space-y-4 text-xs">
                {recentTimelineEvents.map(evt => (
                  <div key={evt.id} className="space-y-1 relative">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 bg-rose-600 rounded-full border border-white"></div>
                    <p className="text-[10px] text-stone-500">
                      {new Date(evt.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                    <p className="text-stone-700 font-medium leading-tight">
                      {getTimelineText(evt)}
                    </p>
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
