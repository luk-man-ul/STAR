'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import apiClient from '@/lib/api-client';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/forgot-password', data);
      setSuccess(response.data?.message || 'Password reset email sent successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-900">Reset Password</h1>
        <p className="text-sm text-stone-600 mt-1">We will send a password reset link to your email</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-sm text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-stone-800 mb-1">Email Address</label>
          <input
            type="email"
            {...register('email')}
            placeholder="email@example.com"
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 placeholder:text-stone-500 bg-white"
          />
          {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center text-sm"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="text-center text-xs text-stone-600">
        Remember your password?{' '}
        <Link href="/login" className="text-rose-600 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
