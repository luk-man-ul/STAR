'use client';

import React from 'react';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      name: 'Designer Blouse',
      image: '✨',
      price: '₹650',
      days: '5-7 Days',
      desc: 'Traditional lining blouses, padded patterns, backless designs, heavy zari embroidery, and bridal wear blouse tailoring.',
      bullets: ['Custom neck patterns', 'Dori & tassels customization', 'Pinch/pleat optimizations', 'Embroidery options'],
    },
    {
      name: 'Elegant Kurti & Salwar Suit',
      image: '👗',
      price: '₹800',
      days: '4-5 Days',
      desc: 'Daily wear cotton kurtis, straight-cut pants, anarkalis, patialas, and custom designer palazzo sets tailored to your length.',
      bullets: ['A-line and straight models', 'Neck and sleeve lining', 'Pocket attachments option', 'Pant length matching'],
    },
    {
      name: 'Exquisite Lehenga Choli',
      image: '👑',
      price: '₹3,500',
      days: '14-21 Days',
      desc: 'Breathtaking event lehenga cholis, heavy gheras, wedding party wear, and custom bridal embroidery with premium details.',
      bullets: ['Can-can attachments', 'Full volume flare panels', 'Custom latkan/handwork', 'Perfect bust fit cholis'],
    },
    {
      name: 'Designer Frocks & Western Gowns',
      image: '🎀',
      price: '₹1,500',
      days: '7-10 Days',
      desc: 'Western evening gowns, party frocks for adults, matching mother-daughter dresses, and custom western cuts.',
      bullets: ['Concealed back zippers', 'Premium satin/net linings', 'Custom waist bows', 'Floor-length adjustments'],
    },
    {
      name: 'School & Corporate Uniforms',
      image: '👔',
      price: '₹500',
      days: '5-7 Days',
      desc: 'Precisely stitched school uniforms, ladies corporate suit jackets, formal shirts, and standard matching pleated skirts.',
      bullets: ['Reinforced seam stitching', 'Standard button alignments', 'Durable fit structures', 'Batch tailoring options'],
    },
    {
      name: 'Garment Fitting & Alterations',
      image: '✂️',
      price: '₹150',
      days: '1-2 Days',
      desc: 'Fitting adjustments, resizing oversized designer wear, custom sleeve insertions, length shortening, and zip repairs.',
      bullets: ['Same-day rush options', 'Precise sizing fits', 'Darning and custom repairs', 'Original hem matching'],
    },
  ];

  return (
    <div className="py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-stone-900 font-serif">Tailoring Services</h1>
        <p className="text-stone-600 text-sm">
          Browse our tailored ladies garments. Prices listed represent baseline stitching rates, which can be modified during order validation.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-stone-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-4xl">{service.image}</span>
                <div className="text-right">
                  <p className="text-[10px] text-stone-600 font-bold uppercase">Stitching Starts At</p>
                  <p className="text-lg font-bold text-rose-600">{service.price}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-stone-800">{service.name}</h3>
                <p className="text-[10px] text-rose-500 font-bold uppercase mt-0.5">Duration: {service.days}</p>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed">{service.desc}</p>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">Customizations Included:</p>
                <div className="grid grid-cols-2 gap-2">
                  {service.bullets.map((b, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-stone-600">
                      <span className="text-rose-500">✓</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 mt-6">
              <Link
                href="/login"
                className="block w-full text-center py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold transition-colors"
              >
                Book Sizing Consultation
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Notice */}
      <div className="p-6 bg-stone-100 border border-stone-200 rounded-3xl text-center text-xs text-stone-700 max-w-2xl mx-auto leading-relaxed">
        <strong>💡 Please Note:</strong> Stitching price rates do not include fabric costs unless requested. Sizing measurements taken online, at home, or in-store will be saved to your profile for future orders.
      </div>
    </div>
  );
}
