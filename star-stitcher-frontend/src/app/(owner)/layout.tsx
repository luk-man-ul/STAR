'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';
import apiClient from '@/lib/api-client';

export default function OwnerLayout({
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
          const fetchedUser = response.data;
          setAuth(fetchedUser);
          if (fetchedUser.role !== 'ADMIN') {
            setChecking(false);
          } else {
            setChecking(false);
          }
        } catch (err) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
          }
          clearAuth();
          router.push('/login');
        }
      } else {
        if (user.role !== 'ADMIN') {
          // Access Denied
          setChecking(false);
        } else {
          setChecking(false);
        }
      }
    }
    verifyAuth();
  }, [user, router, setAuth, clearAuth]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore signing out error
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      clearAuth();
      router.push('/login');
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100 text-sm text-stone-600">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying administrator permissions...</span>
        </div>
      </div>
    );
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-100 p-6 text-center space-y-4">
        <span className="text-4xl">🚫</span>
        <h1 className="text-xl font-bold text-stone-900">Access Denied</h1>
        <p className="text-sm text-stone-700 max-w-sm">
          You do not have the required permissions to view the Star Stitcher Admin dashboard.
        </p>
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold"
        >
          Sign Out & Relogin
        </button>
      </div>
    );
  }

  const sidebarLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Orders', href: '/admin/orders', icon: '✂️' },
    { name: 'Bookings', href: '/admin/bookings', icon: '📋' },
    { name: 'Calendar', href: '/admin/calendar', icon: '📅' },
    { name: 'Designs', href: '/admin/designs', icon: '🎨' },
    { name: 'Categories', href: '/admin/categories', icon: '🏷️' },
    { name: 'Customers', href: '/admin/customers', icon: '👥' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex min-h-screen bg-stone-100">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-stone-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <span className="text-lg font-extrabold text-rose-600 tracking-wider font-serif">
              STAR STITCHER
            </span>
            <span className="ml-1.5 px-2 py-0.5 bg-rose-100 text-rose-700 text-[9px] font-bold rounded-full uppercase tracking-wider">
              CMS
            </span>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {sidebarLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="px-4 pt-4 border-t border-stone-200">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-2xl text-sm font-semibold transition-all"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content frame */}
      <div className="md:pl-64 flex flex-col flex-1 w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-stone-200 h-16 flex items-center justify-between px-6">
          <div className="flex items-center md:hidden gap-3">
            <span className="text-base font-bold text-rose-600 font-serif">STAR STITCHER CMS</span>
          </div>
          <div className="hidden md:block text-xs font-semibold text-stone-600">
            Welcome back, <span className="text-stone-850 font-bold">{user.name}</span> (Boutique Owner)
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              className="px-3.5 py-1.5 border border-stone-300 hover:border-stone-400 text-stone-700 rounded-full font-semibold transition-colors"
            >
              View Main Site
            </Link>
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <main className="flex-1 relative focus:outline-none bg-stone-50">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
