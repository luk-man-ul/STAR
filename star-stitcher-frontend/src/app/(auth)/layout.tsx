'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSettingsStore } from '@/store/use-settings-store';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const shopName = settings?.shopName || 'Star Stitcher';

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-stone-100 relative">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-full hover:bg-stone-200/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 transition-all"
        >
          <span>←</span> Back to Home
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        {settings?.logoUrl ? (
          <img src={settings.logoUrl} alt={shopName} className="h-12 w-auto object-contain" />
        ) : (
          <h2 className="text-center text-3xl font-extrabold text-rose-600 font-sans tracking-wide">
            {shopName}
          </h2>
        )}
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-3xl sm:px-10 border border-stone-200">
          {children}
        </div>
      </div>
    </div>
  );
}
