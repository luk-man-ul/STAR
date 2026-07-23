'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';
import Link from 'next/link';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  avatarUrl: z.string().optional(),
});

type ProfileInput = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
  });

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/users/me');
      const data = response.data;
      setValue('name', data.name);
      setValue('phone', data.phone);
      setValue('avatarUrl', data.avatarUrl || '');
      setAuth(data);
    } catch (err: any) {
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [setValue, setAuth]);

  const onSubmit = async (data: ProfileInput) => {
    setSuccess(false);
    setError(null);
    setSubmitting(true);
    try {
      const response = await apiClient.patch('/users/me', data);
      setAuth(response.data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore signing out errors
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      clearAuth();
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse max-w-md">
        <div className="space-y-2">
          <div className="h-6 bg-stone-200 rounded w-1/3"></div>
          <div className="h-4 bg-stone-200 rounded w-2/3"></div>
        </div>
        <div className="flex gap-4 border-b border-stone-200 pb-2">
          <div className="h-4 bg-stone-200 rounded w-16"></div>
          <div className="h-4 bg-stone-200 rounded w-24"></div>
          <div className="h-4 bg-stone-200 rounded w-20"></div>
        </div>
        <div className="space-y-4 pt-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-stone-200 rounded w-1/4"></div>
              <div className="h-12 bg-stone-200 rounded-2xl w-full"></div>
            </div>
          ))}
          <div className="flex gap-3 pt-4">
            <div className="h-12 bg-stone-200 rounded-full w-28"></div>
            <div className="h-12 bg-stone-200 rounded-full w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-md py-16 text-center flex flex-col items-center justify-center space-y-4">
        <span className="text-5xl">📶</span>
        <h2 className="text-xl font-bold text-stone-900 font-serif">Failed to Load Profile</h2>
        <p className="text-sm text-stone-700 max-w-sm">
          We encountered an issue loading your profile details from our servers. Please verify your connection.
        </p>
        <button
          onClick={loadProfile}
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">My Profile</h1>
        <p className="text-stone-700 text-sm mt-1">Manage your customer profile and personal info</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-sm text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm text-center">
          Profile updated successfully!
        </div>
      )}

      {/* Navigation Sub-Links */}
      <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-6 border-b border-stone-200 pb-2 text-xs sm:text-sm">
        <Link href="/profile" className="font-semibold text-rose-600 border-b-2 border-rose-600 pb-2">
          General Info
        </Link>
        <Link href="/profile/addresses" className="font-medium text-stone-600 hover:text-rose-600 pb-2">
          Saved Addresses
        </Link>
        <Link href="/profile/measurements" className="font-medium text-stone-600 hover:text-rose-600 pb-2">
          Measurements
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-semibold text-stone-800 mb-1">Full Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 bg-white"
          />
          {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-800 mb-1">Phone Number</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 bg-white"
          />
          {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 h-12 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold transition-all active:scale-98 disabled:opacity-50 text-sm cursor-pointer"
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 h-12 px-6 border border-stone-300 text-stone-700 hover:text-rose-600 rounded-full font-semibold transition-all text-sm cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
}
