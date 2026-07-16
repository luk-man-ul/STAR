'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/use-auth-store';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/login', data);
      const { user, session } = response.data;
      
      localStorage.setItem('auth_token', session.access_token);
      localStorage.setItem('refresh_token', session.refresh_token);
      
      setAuth(user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-900">Sign In</h1>
        <p className="text-sm text-stone-600 mt-1">Access your customer profile & order history</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <label className="block text-sm font-semibold text-stone-800 mb-1">Password</label>
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 placeholder:text-stone-500 bg-white"
          />
          {errors.password && <p className="text-xs text-rose-500 mt-1">{errors.password.message}</p>}
        </div>

        <div className="text-right">
          <Link href="/forgot-password" className="text-xs text-rose-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center text-sm"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center text-xs text-stone-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-rose-600 font-semibold hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}
