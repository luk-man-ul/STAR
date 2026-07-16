'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api-client';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
});

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    setLoading(true);
    try {
      await apiClient.post('/auth/register', data);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 py-4">
        {/* Success Icon & Title */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-2xl font-extrabold shadow-sm">
            ✓
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            ✅ Registration Successful!
          </h2>
        </div>

        {/* Body Text */}
        <div className="text-stone-700 text-sm space-y-3 text-center leading-relaxed">
          <p>Your Star Stitcher account has been created successfully.</p>
          <p>A verification email has been sent to your registered email address.</p>
          <p className="font-semibold text-stone-700">
            Please open your inbox and click the verification link before attempting to sign in.
          </p>
        </div>

        {/* Informational Blue Callout */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-2 text-stone-800 shadow-sm">
          <div className="font-bold text-blue-800 flex items-center gap-1.5 text-sm">
            <span>📧</span> Important
          </div>
          <ul className="list-disc pl-4 space-y-1.5 text-stone-700 font-medium">
            <li>Check your Inbox for the verification email.</li>
            <li>If you don&apos;t see it within a few minutes, check your Spam or Junk folder.</li>
            <li>You must verify your email before you can log in.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-2">
          <Link
            href="/login"
            className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold transition-all active:scale-98 flex items-center justify-center text-sm shadow-sm"
          >
            Go to Login
          </Link>
          
          <div className="text-center">
            <button
              onClick={() => {
                reset();
                setSuccess(false);
              }}
              className="text-xs text-stone-600 hover:text-rose-600 font-semibold transition-colors"
            >
              ← Back to Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-900">Create Account</h1>
        <p className="text-sm text-stone-600 mt-1">Register to save measurements and book appointments</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-stone-800 mb-1">Full Name</label>
          <input
            type="text"
            {...register('name')}
            placeholder="Jane Doe"
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 placeholder:text-stone-500 bg-white"
          />
          {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-800 mb-1">Email</label>
          <input
            type="email"
            {...register('email')}
            placeholder="email@example.com"
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 placeholder:text-stone-500 bg-white"
          />
          {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-800 mb-1">Phone Number</label>
          <input
            type="tel"
            {...register('phone')}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 placeholder:text-stone-500 bg-white"
          />
          {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-800 mb-1">Password</label>
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 placeholder:text-stone-500 bg-white"
          />
          {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center text-sm"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className="text-center text-xs text-stone-600">
        Already have an account?{' '}
        <Link href="/login" className="text-rose-600 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
