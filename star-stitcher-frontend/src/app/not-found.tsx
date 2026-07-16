'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 p-6 text-center space-y-6">
      <span className="text-6xl">🔍</span>
      <h1 className="text-3xl font-extrabold text-stone-900 font-serif">Page Not Found</h1>
      <p className="text-sm text-stone-700 max-w-sm leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold shadow-sm transition-colors flex items-center justify-center"
      >
        Go Home
      </Link>
    </div>
  );
}
