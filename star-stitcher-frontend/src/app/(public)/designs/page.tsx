'use client';

import React, { useState, useMemo } from 'react';

interface DesignItem {
  id: string;
  code: string;
  name: string;
  category: string;
  price: string;
  days: number;
  imageIcon: string;
  description: string;
}

export default function DesignsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<DesignItem | null>(null);

  const categories = ['All', 'Blouse', 'Kurti', 'Lehenga', 'Frock', 'Uniform'];

  const designs: DesignItem[] = [
    {
      id: 'd1',
      code: 'BL-001',
      name: 'V-Neck Classic Blouse',
      category: 'Blouse',
      price: '₹650',
      days: 5,
      imageIcon: '✂️',
      description: 'Elegant V-neck styling with smooth back lining, perfect for silk sarees.',
    },
    {
      id: 'd2',
      code: 'BL-002',
      name: 'Heavy Zari Bridal Blouse',
      category: 'Blouse',
      price: '₹4,500',
      days: 14,
      imageIcon: '✨',
      description: 'Exquisite hand-embroidered zari work with custom stone layout for weddings.',
    },
    {
      id: 'd3',
      code: 'KU-001',
      name: 'A-Line Casual Kurti',
      category: 'Kurti',
      price: '₹800',
      days: 4,
      imageIcon: '👗',
      description: 'Daily wear long kurti with comfortable fits and side pocket slots.',
    },
    {
      id: 'd4',
      code: 'LE-001',
      name: 'Royal Rajasthani Lehenga',
      category: 'Lehenga',
      price: '₹12,000',
      days: 21,
      imageIcon: '👑',
      description: 'Heavy ghera bridal lehenga choli with rich traditional Rajasthani embroidery.',
    },
    {
      id: 'd5',
      code: 'BL-003',
      name: 'Maggam Work Silk Blouse',
      category: 'Blouse',
      price: '₹3,200',
      days: 10,
      imageIcon: '🌟',
      description: 'Traditional maggam embroidery highlighting the neckline and elbow sleeves.',
    },
    {
      id: 'd6',
      code: 'KU-002',
      name: 'Anarkali Georgette Suit',
      category: 'Kurti',
      price: '₹2,250',
      days: 7,
      imageIcon: '🌸',
      description: 'Floor-length georgette suit featuring flared panels and hand-crafted borders.',
    },
    {
      id: 'd7',
      code: 'LE-002',
      name: 'Floral Pastel Lehenga',
      category: 'Lehenga',
      price: '₹6,500',
      days: 12,
      imageIcon: '💎',
      description: 'Chic modern pastel lehenga choli, extremely lightweight for sangeet events.',
    },
    {
      id: 'd8',
      code: 'FR-001',
      name: 'Tiered Western Frock',
      category: 'Frock',
      price: '₹1,600',
      days: 6,
      imageIcon: '🎀',
      description: 'Charming tiered western gown dress with belt locks and back zip adjustments.',
    },
    {
      id: 'd9',
      code: 'UN-001',
      name: 'Pleated School Uniform',
      category: 'Uniform',
      price: '₹750',
      days: 5,
      imageIcon: '👔',
      description: 'School pinafore dress set with reinforced inner lining and custom pockets.',
    },
  ];

  const filteredDesigns = useMemo(() => {
    return designs.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-stone-850 font-serif">Design Lookbook</h1>
        <p className="text-stone-600 text-sm">
          Explore catalog patterns. Save your favorites, select codes during booking, or request custom fabric styles.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-stone-200 shadow-sm">
        {/* Search */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="Search by name or code (e.g. BL-002)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-stone-50"
          />
          <span className="absolute left-3 top-3.5 text-stone-400 text-xs">🔍</span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-stone-150 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
      {filteredDesigns.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-stone-300 rounded-3xl text-sm text-stone-650 bg-white">
          No lookbook models found matching your search.
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredDesigns.map((design) => {
            const isFav = favorites.includes(design.id);
            return (
              <div
                key={design.id}
                onClick={() => setSelectedDesign(design)}
                className="break-inside-avoid bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative cursor-pointer group flex flex-col"
              >
                {/* Image Placeholder */}
                <div className="h-48 sm:h-64 bg-rose-50 flex items-center justify-center text-5xl select-none group-hover:scale-102 transition-transform duration-300">
                  {design.imageIcon}
                </div>

                {/* Favorite Icon overlay */}
                <button
                  onClick={(e) => toggleFavorite(design.id, e)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white hover:bg-rose-50 rounded-full shadow-sm flex items-center justify-center transition-colors border border-stone-100"
                  aria-label="Add to favorites"
                >
                  <span className={`text-base ${isFav ? 'text-rose-500' : 'text-stone-450'}`}>
                    {isFav ? '❤️' : '🤍'}
                  </span>
                </button>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">
                      {design.category}
                    </span>
                    <h3 className="font-bold text-stone-850 text-base mt-0.5">{design.name}</h3>
                    <p className="text-[11px] text-stone-500">Style Code: {design.code}</p>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {design.description}
                  </p>

                  <div className="flex justify-between items-center border-t border-stone-100 pt-3 mt-2 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase">Stitching Price</span>
                      <p className="font-extrabold text-stone-850 text-sm">{design.price}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 font-bold uppercase">Stitch Duration</span>
                      <p className="font-semibold text-stone-700">{design.days} Days</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Design Details Modal Drawer */}
      {selectedDesign && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 relative space-y-6 shadow-2xl border border-stone-150">
            <button
              onClick={() => setSelectedDesign(null)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-850 text-xl font-bold font-sans"
              aria-label="Close details"
            >
              ✕
            </button>

            <div className="h-48 bg-rose-50 rounded-2xl flex items-center justify-center text-6xl">
              {selectedDesign.imageIcon}
            </div>

            <div className="space-y-2">
              <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 rounded-full font-bold text-[9px] uppercase tracking-wider">
                {selectedDesign.category}
              </span>
              <h2 className="text-2xl font-bold text-stone-850 font-serif">{selectedDesign.name}</h2>
              <p className="text-xs text-stone-500">Style Reference Code: {selectedDesign.code}</p>
            </div>

            <p className="text-sm text-stone-600 leading-relaxed">{selectedDesign.description}</p>

            <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-4 text-sm">
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase">Estimated Tailoring Price</p>
                <p className="text-lg font-bold text-rose-600">{selectedDesign.price}</p>
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase">Tailoring Duration</p>
                <p className="text-sm font-semibold text-stone-800 mt-1">{selectedDesign.days} Business Days</p>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setSelectedDesign(null)}
                className="flex-1 h-12 bg-stone-900 hover:bg-stone-800 text-white rounded-full font-semibold text-sm transition-colors"
              >
                Close Lookbook Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
