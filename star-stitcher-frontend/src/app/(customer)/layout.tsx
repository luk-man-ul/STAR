'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';
import apiClient from '@/lib/api-client';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setAuth, clearAuth } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      if (!user) {
        try {
          const response = await apiClient.get('/auth/me');
          setAuth(response.data);
          setChecking(false);
        } catch (err) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
          }
          clearAuth();
          router.push('/login');
        }
      } else {
        setChecking(false);
      }
    }
    verifyAuth();
  }, [user, router, setAuth, clearAuth]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
      }
      clearAuth();
      router.push('/login');
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50 text-sm text-stone-600">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying access permissions...</span>
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Book Appointment', href: '/book', icon: '📅' },
    { name: 'My Bookings', href: '/customer/bookings', icon: '👗' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Desktop & Mobile Header */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/85 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6 max-w-5xl mx-auto w-full">
          <Link href="/dashboard" className="text-xl font-bold text-rose-600">
            Star Stitcher
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors py-2 border-b-2 ${
                    isActive
                      ? 'text-rose-600 border-rose-600'
                      : 'text-stone-600 border-transparent hover:text-stone-900 hover:border-stone-300'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="text-stone-600 hover:text-rose-600 font-semibold transition-colors flex items-center gap-1.5 ml-4 text-sm"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </nav>

          {/* User profile brief for mobile header */}
          <div className="md:hidden flex items-center gap-2">
            <span className="text-xs text-stone-600 font-semibold">
              {user?.name}
            </span>
            <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 bg-stone-50 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl px-6 py-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white/95 py-2 md:hidden shadow-lg">
        <div className="flex justify-around items-center text-[10px] font-bold text-stone-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center py-1 px-3 space-y-1 transition-all ${
                  isActive ? 'text-rose-600 font-black' : 'text-stone-600 hover:text-rose-500'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.name.replace(' Appointment', '')}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center py-1 px-3 space-y-1 text-stone-600 hover:text-rose-600"
          >
            <span className="text-base">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
