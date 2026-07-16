'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSettingsStore } from '@/store/use-settings-store';

export default function HomePage() {
  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const categories = [
    { name: 'Designer Blouse', image: '✨', count: '12 styles available', desc: 'Custom embroidery, deep cuts, zari patterns' },
    { name: 'Elegant Kurti', image: '👗', count: '8 styles available', desc: 'Casual A-Line, office wear, traditional prints' },
    { name: 'Wedding Lehenga', image: '👑', count: '15 styles available', desc: 'Bridal flare, events, detailed stone work' },
    { name: 'Custom Frocks', image: '🎀', count: '6 styles available', desc: 'Modern gowns, summer frocks, kids party wear' },
  ];

  const featuredDesigns = [
    { name: 'Zari Bridal Blouse', category: 'Blouse', code: 'BL-002', price: '₹4,500', days: 14, tag: 'Best Seller' },
    { name: 'Casual Pocket Kurti', category: 'Kurti', code: 'KU-001', price: '₹800', days: 4, tag: 'Daily Wear' },
    { name: 'Royal Ghera Lehenga', category: 'Lehenga', code: 'LE-001', price: '₹12,000', days: 21, tag: 'Premium' },
  ];

  const workflowSteps = [
    { num: '01', title: 'Choose Style', desc: 'Select a custom design from our lookbook or upload your reference picture.' },
    { num: '02', title: 'Submit Sizes', desc: 'Schedule a home appointment, visit our Kasaragod shop, or enter measurements online.' },
    { num: '03', title: 'Precision Tailoring', desc: 'Our master tailors stitch your dress matching your precise shape profile.' },
    { num: '04', title: 'Doorstep Delivery', desc: 'Receive your custom dress delivered right to your house with fit validation.' },
  ];

  const testimonials = [
    { name: 'Priya P.', city: 'Kasaragod', quote: 'The heavy zari blouse they stitched for my wedding saree fits like a glove! Highly recommended.' },
    { name: 'Ananya R.', city: 'Kasaragod', quote: 'Star Stitcher saves me so much hassle. I just entered my measurements online and they delivered it in 4 days.' },
  ];

  const heroHeading = settings?.heroHeading || 'Bespoke Custom Stitching for the Modern Woman';
  const heroSubheading = settings?.heroSubheading || 'Exquisite ladies tailoring boutique. Submit measurements online, pick designer models from our lookbook, and track your stitching order directly from your mobile.';
  const whatsapp = settings?.whatsapp || '+91 7306417315';

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-stone-900 to-stone-850 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.15),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 max-w-3xl">
          <span className="inline-block px-4 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-full text-xs font-bold uppercase tracking-wider text-rose-400">
            {settings?.shopName || 'Star Stitcher'} Boutique
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-serif leading-tight">
            {heroHeading}
          </h1>
          <p className="text-lg text-stone-300 leading-relaxed max-w-2xl">
            {heroSubheading}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/login"
              className="px-8 h-14 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold transition-all active:scale-95 shadow-lg shadow-rose-900/30 flex items-center justify-center text-base"
            >
              Book Sizing Consultation
            </Link>
            <Link
              href="/designs"
              className="px-8 h-14 border border-stone-600 hover:border-white text-stone-200 hover:text-white rounded-full font-semibold transition-all active:scale-95 flex items-center justify-center text-base"
            >
              Explore Lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-stone-800 font-serif">Featured Custom Categories</h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">Explore custom stitching styles designed to give you an exquisite and perfect fit.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-md transition-all group hover:-translate-y-1">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{cat.image}</div>
              <h3 className="text-lg font-bold text-stone-800">{cat.name}</h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mt-1">{cat.count}</p>
              <p className="text-xs text-stone-600 mt-3 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-stone-100 py-20 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-800 font-serif leading-tight">
              Tailoring crafted exclusively matching your design
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed">
              We specialize in custom patterns, designer linings, and precise fits for women. No more repeat visits for adjustments.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {[
                { title: 'Master Tailors', desc: 'Highly experienced hands stitching complex wedding patterns.' },
                { title: 'On-Time Handover', desc: 'No delayed orders. Ready for pickups exactly when committed.' },
                { title: 'Online Sizing Files', desc: 'Saves your measurements securely for one-click re-bookings.' },
                { title: 'Track Stitching Stages', desc: 'Get SMS, WhatsApp, and live web workflow updates.' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-bold text-stone-800 text-sm flex items-center gap-2">
                    <span className="text-rose-500">✔</span> {item.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-stone-200 aspect-[4/3] rounded-3xl flex items-center justify-center text-stone-600 text-6xl border border-stone-300 font-serif">
            📍 Kasaragod
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-stone-800 font-serif">Tailoring Process</h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">Get custom fits in four easy steps from the comfort of your home.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {workflowSteps.map((step, idx) => (
            <div key={idx} className="relative space-y-4">
              <span className="text-5xl font-black text-stone-400 block font-mono">{step.num}</span>
              <h3 className="text-base font-bold text-stone-800">{step.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-rose-50/50 py-20 border-y border-rose-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-stone-800 font-serif">Happy Customers</h2>
            <p className="text-sm text-stone-600">Read what local women say about their custom fits from Star Stitcher.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-rose-100 shadow-sm text-stone-700 text-sm leading-relaxed relative">
                &ldquo;{test.quote}&rdquo;
                <div className="mt-4 not-italic font-bold text-stone-800 text-xs flex justify-between">
                  <span>- {test.name}</span>
                  <span className="text-stone-600 font-medium">{test.city}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-200 text-center space-y-6">
          <span className="text-3xl">💬</span>
          <h2 className="text-2xl font-bold text-stone-800 font-serif">Need Sizing Help or custom queries?</h2>
          <p className="text-sm text-stone-700 max-w-xl mx-auto leading-relaxed">
            Our boutique fashion consultants are active on WhatsApp. Send us your design sketches, custom requirements, or book home pick-ups instantly.
          </p>
          <div>
            <a
              href={`https://wa.me/${whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold transition-all active:scale-95 shadow-sm text-sm"
            >
              <span>Chat directly on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
