'use client';

import React, { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 p-6 text-center space-y-6">
      <span className="text-6xl">⚠️</span>
      <h1 className="text-3xl font-extrabold text-stone-850 font-serif">Something Went Wrong</h1>
      <p className="text-sm text-stone-500 max-w-sm leading-relaxed">
        An unexpected error occurred in the application. Please try reloading the page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold shadow-sm transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 h-11 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-full text-xs font-bold transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
