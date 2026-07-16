'use client';

import React from 'react';

export default function AboutPage() {
  const workingHours = [
    { day: 'Monday', hours: '10:00 AM - 8:30 PM' },
    { day: 'Tuesday', hours: '10:00 AM - 8:30 PM' },
    { day: 'Wednesday', hours: '10:00 AM - 8:30 PM' },
    { day: 'Thursday', hours: '10:00 AM - 8:30 PM' },
    { day: 'Friday', hours: '10:00 AM - 8:30 PM' },
    { day: 'Saturday', hours: '10:00 AM - 8:30 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ];

  return (
    <div className="py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-stone-900 font-serif">About Star Stitcher</h1>
        <p className="text-stone-600 text-sm">
          A dedicated tailoring boutique serving Malleshwaram ladies with bespoke stitching since 2012.
        </p>
      </div>

      {/* Story Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-stone-800 font-serif">Our Story</h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Star Stitcher was founded by Radhika Sharma in 2012 with a simple vision: to eliminate the stress from women’s custom dress tailoring. We noticed how difficult it was for ladies to get perfect fits, clear pricing structures, and reliable delivery updates.
          </p>
          <p className="text-stone-600 text-sm leading-relaxed">
            Over the last decade, we have grown from a single master tailor in a small shop to a dedicated team of 15+ experienced tailors in Malleshwaram. We combine age-old hand-stitching embroidery skills with a modern ordering flow, allowing you to track your orders in real-time.
          </p>
          <p className="text-stone-700 text-sm font-semibold italic text-rose-600">
            &ldquo;A dress should not just fit; it should feel like it was crafted to be a part of you.&rdquo; - Radhika, Founder
          </p>
        </div>
        <div className="bg-rose-50 p-8 rounded-3xl border border-rose-100 space-y-6 flex flex-col justify-center items-center text-center">
          <span className="text-5xl">🪡</span>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-stone-800">12+ Years of Excellence</h3>
            <p className="text-sm text-stone-600 max-w-sm">
              We verify and record every sizing profile with 14 measurement dimensions to ensure a flawless fit guarantee.
            </p>
          </div>
        </div>
      </div>

      {/* Hours and Location Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-stone-200">
        {/* Working Hours */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-stone-800 font-serif">Boutique Working Hours</h2>
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-600 uppercase">
                  <th className="px-6 py-3">Day</th>
                  <th className="px-6 py-3">Opening Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150 text-sm text-stone-700">
                {workingHours.map((wh) => (
                  <tr key={wh.day} className={wh.hours === 'Closed' ? 'bg-rose-50/50' : ''}>
                    <td className="px-6 py-4 font-semibold">{wh.day}</td>
                    <td className="px-6 py-4">{wh.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Location & Maps Placeholder */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-stone-800 font-serif">Our Location</h2>
          <div className="bg-white p-6 rounded-3xl border border-stone-200 space-y-4 shadow-sm">
            <div>
              <p className="font-bold text-stone-800">Star Stitcher Boutique</p>
              <p className="text-sm text-stone-600">12, Rose Villa, Malleshwaram, Bangalore, Karnataka - 560003</p>
              <p className="text-xs text-stone-600 mt-1">Landmark: Opposite Rose Garden Metro Pillar</p>
            </div>

            {/* Maps Placeholder Card */}
            <div className="h-64 bg-stone-100 rounded-2xl border border-stone-200 flex flex-col items-center justify-center text-center p-4 space-y-2 relative overflow-hidden">
              {/* Decorative map graphics representation */}
              <div className="absolute inset-0 bg-[radial-gradient(var(--tw-gradient-stops))] from-rose-50 via-stone-100 to-stone-50 opacity-40" />
              <span className="text-3xl relative z-10">📍</span>
              <p className="font-bold text-xs text-stone-800 relative z-10 uppercase tracking-wider">Google Maps View</p>
              <p className="text-xs text-stone-600 relative z-10 max-w-xs">
                Map view loading placeholder. Star Stitcher is located in Malleshwaram with parking facilities.
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold transition-colors"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
