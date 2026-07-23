'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import apiClient from '@/lib/api-client';

interface DesignItem {
  id: string;
  code: string;
  name: string;
  category: string;
  price: string;
  days: number;
  imageIcon: string;
  imageUrl?: string;
  description: string;
}

export default function DesignsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<DesignItem | null>(null);

  const [designs, setDesigns] = useState<DesignItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesRes, designsRes] = await Promise.all([
        apiClient.get('/categories'),
        apiClient.get('/designs?limit=100'),
      ]);

      const fetchedCats = categoriesRes.data || [];
      const fetchedDesigns = designsRes.data?.data || [];

      setCategories(['All', ...fetchedCats.map((c: any) => c.name)]);

      const getCategoryEmoji = (catName: string) => {
        const lower = catName.toLowerCase();
        if (lower.includes('blouse')) return '✂️';
        if (lower.includes('kurti')) return '👗';
        if (lower.includes('lehenga')) return '👑';
        if (lower.includes('frock')) return '🎀';
        if (lower.includes('uniform')) return '👔';
        return '🧵';
      };

      const mappedDesigns = fetchedDesigns.map((d: any) => ({
        id: d.id,
        code: d.code,
        name: d.name,
        category: d.category?.name || 'Uncategorized',
        price: `₹${d.price}`,
        days: d.estimatedDays,
        imageIcon: getCategoryEmoji(d.category?.name || ''),
        imageUrl: d.imageUrl || undefined,
        description: d.description || '',
      }));

      setDesigns(mappedDesigns);
    } catch (err) {
      setError('Failed to load designs. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredDesigns = useMemo(() => {
    return designs.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, designs]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
  };

  if (error) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center space-y-4">
        <span className="text-5xl">📶</span>
        <h2 className="text-2xl font-bold text-stone-900 font-serif">Connection Error</h2>
        <p className="text-sm text-stone-700 max-w-sm">
          We encountered an issue loading our design catalog. Please verify your connection and try again.
        </p>
        <button
          onClick={loadData}
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!loading && designs.length === 0) {
    return (
      <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center space-y-4">
        <span className="text-5xl">🧵</span>
        <h2 className="text-2xl font-bold text-stone-900 font-serif">No designs available yet.</h2>
        <p className="text-sm text-stone-700 max-w-sm">
          Our tailoring lookbook is currently empty. Please check back later.
        </p>
        <button
          onClick={loadData}
          className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
        >
          Refresh Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-stone-900 font-serif">Design Lookbook</h1>
        <p className="text-stone-700 text-sm">
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
          <span className="absolute left-3 top-3.5 text-stone-500 text-xs">🔍</span>
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
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm animate-pulse flex flex-col space-y-4 p-5 h-[380px]"
            >
              <div className="h-48 sm:h-64 bg-stone-200 rounded-2xl w-full"></div>
              <div className="h-3 bg-stone-200 rounded w-1/4"></div>
              <div className="h-5 bg-stone-200 rounded w-2/3"></div>
              <div className="h-3 bg-stone-200 rounded w-full"></div>
              <div className="border-t border-stone-100 pt-4 flex justify-between">
                <div className="h-5 bg-stone-200 rounded w-1/4"></div>
                <div className="h-5 bg-stone-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredDesigns.length === 0 ? (
        <div className="p-16 text-center border border-dashed border-stone-300 rounded-3xl text-sm text-stone-600 bg-white">
          No lookbook models found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDesigns.map((design) => {
            const isFav = favorites.includes(design.id);
            return (
              <div
                key={design.id}
                onClick={() => setSelectedDesign(design)}
                className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative cursor-pointer group flex flex-col h-full"
              >
                {/* Image Placeholder */}
                <div className="h-48 sm:h-64 bg-rose-50 flex items-center justify-center text-5xl select-none group-hover:scale-102 transition-transform duration-300 relative overflow-hidden">
                  {design.imageUrl ? (
                    <Image
                      src={design.imageUrl}
                      alt={design.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span>{design.imageIcon}</span>
                  )}
                </div>

                {/* Favorite Icon overlay */}
                <button
                  onClick={(e) => toggleFavorite(design.id, e)}
                  className="absolute top-4 right-4 w-9 h-9 bg-white hover:bg-rose-50 rounded-full shadow-sm flex items-center justify-center transition-colors border border-stone-100 z-10"
                  aria-label="Add to favorites"
                >
                  <span className={`text-base ${isFav ? 'text-rose-500' : 'text-stone-500'}`}>
                    {isFav ? '❤️' : '🤍'}
                  </span>
                </button>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                        {design.category}
                      </span>
                      <h3 className="font-bold text-stone-800 text-base mt-0.5">{design.name}</h3>
                      <p className="text-[11px] text-stone-600">Style Code: {design.code}</p>
                    </div>

                    <p className="text-xs text-stone-700 line-clamp-2 leading-relaxed">
                      {design.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-stone-100 pt-3 mt-2 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-600 font-bold uppercase">Stitching Price</span>
                      <p className="font-extrabold text-stone-800 text-sm">{design.price}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-600 font-bold uppercase">Stitch Duration</span>
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
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-lg w-full max-h-[85vh] overflow-y-auto rounded-3xl p-6 relative space-y-6 shadow-2xl border border-stone-150 my-auto">
            <button
              onClick={() => setSelectedDesign(null)}
              className="absolute top-4 right-4 text-stone-600 hover:text-stone-900 text-xl font-bold font-sans z-10"
              aria-label="Close details"
            >
              ✕
            </button>

            <div className="h-48 bg-rose-50 rounded-2xl flex items-center justify-center text-6xl relative overflow-hidden">
              {selectedDesign.imageUrl ? (
                <Image
                  src={selectedDesign.imageUrl}
                  alt={selectedDesign.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 512px"
                  className="object-cover"
                />
              ) : (
                <span>{selectedDesign.imageIcon}</span>
              )}
            </div>

            <div className="space-y-2">
              <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 rounded-full font-bold text-[9px] uppercase tracking-wider">
                {selectedDesign.category}
              </span>
              <h2 className="text-2xl font-bold text-stone-900 font-serif">{selectedDesign.name}</h2>
              <p className="text-xs text-stone-600">Style Reference Code: {selectedDesign.code}</p>
            </div>

            <p className="text-sm text-stone-700 leading-relaxed">{selectedDesign.description}</p>

            <div className="grid grid-cols-2 gap-4 border-t border-stone-100 pt-4 text-sm">
              <div>
                <p className="text-[10px] text-stone-600 font-bold uppercase">Estimated Tailoring Price</p>
                <p className="text-lg font-bold text-rose-700">{selectedDesign.price}</p>
              </div>
              <div>
                <p className="text-[10px] text-stone-600 font-bold uppercase">Tailoring Duration</p>
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
