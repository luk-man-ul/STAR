'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiClient from '@/lib/api-client';

interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

const categorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

type CategoryInput = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/categories?includeArchived=true');
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEditClick = (cat: Category) => {
    setEditingCategory(cat);
    setValue('name', cat.name);
    setValue('description', cat.description || '');
    setValue('isActive', cat.isActive);
    setShowModal(true);
  };

  const handleAddNewClick = () => {
    setEditingCategory(null);
    reset();
    setShowModal(true);
  };

  const onSubmit = async (data: CategoryInput) => {
    setError(null);
    setActionLoading(true);
    try {
      if (editingCategory) {
        await apiClient.patch(`/categories/${editingCategory.id}`, data);
      } else {
        await apiClient.post('/categories', data);
      }
      setShowModal(false);
      reset();
      await loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (cat: Category) => {
    setError(null);
    try {
      await apiClient.patch(`/categories/${cat.id}`, {
        isActive: !cat.isActive,
      });
      await loadCategories();
    } catch (err) {
      setError('Failed to toggle category active status.');
    }
  };

  const handleArchive = async (id: string) => {
    if (!confirm('Are you sure you want to archive this category? It will set active to false.')) return;
    setError(null);
    try {
      await apiClient.delete(`/categories/${id}`);
      await loadCategories();
    } catch (err) {
      setError('Failed to archive category.');
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-850 font-serif">Garment Categories</h1>
          <p className="text-xs text-stone-500 mt-1">Manage the tailoring catalog category categories</p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="px-5 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
        >
          + Add Category
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-650 rounded-2xl text-xs text-center">
          {error}
        </div>
      )}

      {/* Filter and Search Box */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 flex justify-between items-center shadow-sm">
        <div className="w-80 relative">
          <input
            type="text"
            placeholder="Search categories by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs bg-stone-50"
          />
          <span className="absolute left-3 top-3.5 text-stone-400 text-xs">🔍</span>
        </div>
        <div className="text-xs text-stone-500">
          Showing {filteredCategories.length} categories
        </div>
      </div>

      {/* Main Table grid */}
      {loading && categories.length === 0 ? (
        <div className="text-center py-12 text-xs text-stone-500">Loading categories...</div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white p-12 text-center border border-stone-200 rounded-3xl text-xs text-stone-500 shadow-sm">
          No categories found. Click the button above to add your first category.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-500 uppercase">
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Description</th>
                <th className="px-6 py-3.5 text-center">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-150 text-xs text-stone-700">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50/50">
                  <td className="px-6 py-4 font-bold text-stone-850">{cat.name}</td>
                  <td className="px-6 py-4 max-w-xs truncate text-stone-500">
                    {cat.description || 'No description provided'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`px-3 py-1 font-bold text-[9px] uppercase tracking-wider rounded-full transition-colors ${
                        cat.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                      }`}
                    >
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(cat)}
                      className="px-3 h-8 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full font-semibold transition-colors"
                    >
                      Edit
                    </button>
                    {cat.isActive && (
                      <button
                        onClick={() => handleArchive(cat.id)}
                        className="px-3 h-8 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full font-semibold transition-colors"
                      >
                        Archive
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit/Add Category Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 relative space-y-6 shadow-2xl border border-stone-150">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-850 text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-stone-850 font-serif">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Category Name</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="e.g. Blouse, Kurti, Lehenga"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs bg-white"
                />
                {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description (Optional)</label>
                <textarea
                  {...register('description')}
                  rows={3}
                  placeholder="Provide sizing or styling guidelines"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-stone-300 rounded"
                />
                <label htmlFor="isActive" className="text-xs font-medium text-stone-700 select-none">
                  Mark as active in lookbook lookbook
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold text-xs transition-colors"
                >
                  {actionLoading ? 'Saving...' : 'Save Category'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-11 border border-stone-300 text-stone-600 rounded-full font-semibold text-xs transition-colors hover:bg-stone-50"
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
