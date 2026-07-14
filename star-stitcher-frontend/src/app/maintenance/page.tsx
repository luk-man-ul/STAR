'use client';

import React from 'react';

export default function MaintenancePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-50 p-6 text-center space-y-6">
      <span className="text-6xl">🛠️</span>
      <h1 className="text-3xl font-extrabold text-stone-850 font-serif">Under Maintenance</h1>
      <p className="text-sm text-stone-655 max-w-sm leading-relaxed">
        Star Stitcher is undergoing scheduled maintenance updates. We will be back online shortly. Thank you for your patience!
      </p>
      <a
        href="https://wa.me/917306417315"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex px-6 h-11 items-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition-colors shadow-sm"
      >
        Chat on WhatsApp
      </a>
    </div>
  );
}
