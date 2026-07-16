'use client';

import React from 'react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 p-6 text-center space-y-6">
      <span className="text-6xl">🚫</span>
      <h1 className="text-3xl font-extrabold text-stone-900 font-serif">Access Denied</h1>
      <p className="text-sm text-stone-700 max-w-sm leading-relaxed">
        You do not have permission to access this resource. Please make sure you are logged in with the correct account.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold shadow-sm transition-colors flex items-center justify-center"
        >
          Sign In
        </Link>
        <Link
          href="/"
          className="px-6 h-11 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-full text-xs font-bold transition-colors flex items-center justify-center"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
