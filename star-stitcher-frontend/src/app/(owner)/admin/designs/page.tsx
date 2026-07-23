'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiClient from '@/lib/api-client';

interface Category {
  id: string;
  name: string;
}

interface Design {
  id: string;
  categoryId: string;
  name: string;
  code: string;
  description?: string;
  imageUrl?: string;
  price: number;
  estimatedDays: number;
  featured: boolean;
  isActive: boolean;
  category?: Category;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const designSchema = z.object({
  categoryId: z.string().min(1, 'Please select a category'),
  name: z.string().min(2, 'Design name must be at least 2 characters'),
  code: z.string().min(2, 'Style code must be at least 2 characters'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().nonnegative('Price must be positive')),
  estimatedDays: z.preprocess((val) => Number(val), z.number().int().positive('Days must be a positive integer')),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type DesignInput = z.infer<typeof designSchema>;

export default function AdminDesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingDesign, setEditingDesign] = useState<Design | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(designSchema),
  });

  const loadCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const loadDesigns = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '6',
        includeArchived: 'true',
      });
      if (search) query.append('search', search);
      if (selectedCategory) query.append('categoryId', selectedCategory);

      const response = await apiClient.get(`/designs?${query.toString()}`);
      setDesigns(response.data.data);
      setMeta(response.data.meta);
    } catch (err) {
      setError('Failed to fetch lookbook designs catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadDesigns();
  }, [page, search, selectedCategory]);

  const handleEditClick = (design: Design) => {
    setEditingDesign(design);
    setValue('categoryId', design.categoryId);
    setValue('name', design.name);
    setValue('code', design.code);
    setValue('description', design.description || '');
    setValue('imageUrl', design.imageUrl || '');
    setValue('price', design.price);
    setValue('estimatedDays', design.estimatedDays);
    setValue('featured', design.featured);
    setValue('isActive', design.isActive);
    setUploadedUrl(design.imageUrl || null);
    setShowModal(true);
  };

  const handleAddNewClick = () => {
    setEditingDesign(null);
    reset();
    setUploadedUrl(null);
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      // Trigger upload via secure admin storage API endpoint
      const response = await apiClient.post('/storage/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const url = response.data.url;
      setUploadedUrl(url);
      setValue('imageUrl', url);
    } catch (err) {
      setError('Failed to upload image file to Supabase storage.');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = async (data: DesignInput) => {
    setError(null);
    setActionLoading(true);
    try {
      if (editingDesign) {
        await apiClient.patch(`/designs/${editingDesign.id}`, data);
      } else {
        await apiClient.post('/designs', data);
      }
      setShowModal(false);
      reset();
      setUploadedUrl(null);
      await loadDesigns();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save lookbook design item.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFeatured = async (design: Design) => {
    setError(null);
    try {
      await apiClient.patch(`/designs/${design.id}`, {
        featured: !design.featured,
      });
      await loadDesigns();
    } catch (err) {
      setError('Failed to update featured flag.');
    }
  };

  const handleToggleActive = async (design: Design) => {
    setError(null);
    try {
      await apiClient.patch(`/designs/${design.id}`, {
        isActive: !design.isActive,
      });
      await loadDesigns();
    } catch (err) {
      setError('Failed to update active status.');
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this design catalog item?')) return;
    setError(null);
    try {
      await apiClient.delete(`/designs/${id}`);
      await loadDesigns();
    } catch (err) {
      setError('Failed to archive lookbook design item.');
    }
  };

  const handleDuplicate = async (id: string) => {
    setError(null);
    try {
      await apiClient.post(`/designs/${id}/duplicate`);
      await loadDesigns();
    } catch (err) {
      setError('Failed to clone lookbook design item.');
    }
  };

  const formErrors = errors as Record<string, any>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Designs Lookbook</h1>
          <p className="text-xs text-stone-600 mt-1">Manage public lookbook catalog styles and price configurations</p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="px-5 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
        >
          + Add Design
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-650 rounded-2xl text-xs text-center">
          {error}
        </div>
      )}

      {/* Filters and Search toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center shadow-sm">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by code or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 bg-stone-50 placeholder:text-stone-500"
          />
          <span className="absolute left-3 top-3.5 text-stone-600 text-xs">🔍</span>
        </div>

        {/* Category Selector */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 bg-stone-50"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-right text-xs text-stone-600 font-medium">
          {meta ? `Total: ${meta.total} items` : ''}
        </div>
      </div>

      {/* Main Grid table */}
      {loading && designs.length === 0 ? (
        <div className="text-center py-12 text-xs text-stone-600">Loading lookbook catalog...</div>
      ) : designs.length === 0 ? (
        <div className="bg-white p-12 text-center border border-stone-200 rounded-3xl text-xs text-stone-600 shadow-sm">
          No design catalog items found. Click the button above to add one.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-600 uppercase">
                  <th className="px-6 py-3.5">Style</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Price</th>
                  <th className="px-6 py-3.5 text-center">Featured</th>
                  <th className="px-6 py-3.5 text-center">Active</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150 text-xs text-stone-700">
                {designs.map((design) => (
                  <tr key={design.id} className="hover:bg-stone-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-xl overflow-hidden font-bold shrink-0">
                          {design.imageUrl ? (
                            <img src={design.imageUrl} alt={design.name} className="w-full h-full object-cover" />
                          ) : (
                            '🎨'
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-stone-800">{design.name}</p>
                          <p className="text-[10px] text-stone-600">Code: {design.code} | {design.estimatedDays} Days</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-600">
                      {design.category?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-stone-800">
                      ₹{design.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(design)}
                        className={`text-lg focus:outline-none cursor-pointer`}
                        title="Toggle Featured"
                      >
                        {design.featured ? '⭐' : '☆'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(design)}
                        className={`px-3 py-1 font-bold text-[9px] uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
                          design.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                        }`}
                      >
                        {design.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleEditClick(design)}
                        className="px-3 h-8 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full font-semibold transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDuplicate(design.id)}
                        className="px-3 h-8 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full font-semibold transition-colors cursor-pointer"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => handleArchive(design.id)}
                        className="px-3 h-8 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full font-semibold transition-colors cursor-pointer"
                      >
                        Archive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {designs.map((design) => (
              <div key={design.id} className="bg-white border border-stone-200 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-2xl overflow-hidden font-bold shrink-0">
                      {design.imageUrl ? (
                        <img src={design.imageUrl} alt={design.name} className="w-full h-full object-cover" />
                      ) : (
                        '🎨'
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm">{design.name}</h3>
                      <p className="text-[10px] text-stone-600">Code: {design.code} | {design.category?.name || 'Unassigned'}</p>
                      <p className="text-xs font-extrabold text-stone-900 mt-0.5">₹{design.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleFeatured(design)}
                    className="text-xl p-1 focus:outline-none cursor-pointer"
                    title="Toggle Featured"
                  >
                    {design.featured ? '⭐' : '☆'}
                  </button>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => handleToggleActive(design)}
                    className={`px-3 py-1 font-bold text-[9px] uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
                      design.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                    }`}
                  >
                    {design.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleEditClick(design)}
                      className="px-3 h-7 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDuplicate(design.id)}
                      className="px-3 h-7 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-full font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleArchive(design.id)}
                      className="px-3 h-7 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-2 text-xs">
              <span className="text-stone-600">
                Page {meta.page} of {meta.totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 h-9 border border-stone-300 text-stone-700 hover:text-stone-900 rounded-full font-semibold disabled:opacity-40 transition-opacity bg-white"
                >
                  Previous
                </button>
                <button
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 h-9 border border-stone-300 text-stone-700 hover:text-stone-900 rounded-full font-semibold disabled:opacity-40 transition-opacity bg-white"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit/Add Design Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 relative space-y-6 shadow-2xl border border-stone-150 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-stone-600 hover:text-stone-900 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-stone-900 font-serif">
              {editingDesign ? 'Edit Lookbook Design' : 'Create Lookbook Design'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">Garment Category</label>
                  <select
                    {...register('categoryId')}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.categoryId && <p className="text-[10px] text-rose-500 mt-1">{formErrors.categoryId.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">Style Code (Unique)</label>
                  <input
                    type="text"
                    {...register('code')}
                    placeholder="e.g. BL-002"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 placeholder:text-stone-500 bg-white"
                  />
                  {formErrors.code && <p className="text-[10px] text-rose-500 mt-1">{formErrors.code.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">Design Name</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Heavy Zari Saree Blouse"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 placeholder:text-stone-500 bg-white"
                />
                {formErrors.name && <p className="text-[10px] text-rose-500 mt-1">{formErrors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">Stitching Price (₹)</label>
                  <input
                    type="number"
                    {...register('price')}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 bg-white"
                  />
                  {formErrors.price && <p className="text-[10px] text-rose-500 mt-1">{formErrors.price.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">Stitch Time (Days)</label>
                  <input
                    type="number"
                    {...register('estimatedDays')}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 bg-white"
                  />
                  {formErrors.estimatedDays && <p className="text-[10px] text-rose-500 mt-1">{formErrors.estimatedDays.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  rows={2}
                  placeholder="Enter embroidery details, design specifics, or fabric lengths required"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs text-stone-900 placeholder:text-stone-500 bg-white"
                />
              </div>

              {/* Design Image Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">Catalog Image</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 border border-stone-300 bg-stone-50 rounded-2xl flex items-center justify-center text-2xl overflow-hidden font-bold">
                    {uploadedUrl ? (
                      <img src={uploadedUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      '📸'
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      id="uploadFile"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="uploadFile"
                      className="inline-flex px-4 py-2 border border-stone-300 hover:border-stone-400 text-stone-700 text-xs rounded-full font-bold cursor-pointer transition-colors"
                    >
                      {uploadingImage ? 'Uploading Image...' : 'Choose Catalog File'}
                    </label>
                    <p className="text-[10px] text-stone-600 mt-1">Image uploads directly to Supabase storage bucket</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    {...register('featured')}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-stone-300 rounded"
                  />
                  <label htmlFor="featured" className="text-xs font-semibold text-stone-800 select-none">
                    Feature on public homepage
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    {...register('isActive')}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-stone-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-xs font-semibold text-stone-800 select-none">
                    Mark as active in lookup list
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={actionLoading || uploadingImage}
                  className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold text-xs transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Design'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-11 border border-stone-300 text-stone-700 rounded-full font-semibold text-xs transition-colors hover:bg-stone-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
