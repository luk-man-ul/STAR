'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

interface Address {
  id: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

const addressSchema = z.object({
  addressLine1: z.string().min(3, 'Address line 1 must be at least 3 characters'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  postalCode: z.string().min(5, 'Postal code must be at least 5 characters'),
  isDefault: z.boolean(),
});

type AddressInput = z.infer<typeof addressSchema>;

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
  });

  const loadAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/addresses');
      setAddresses(response.data);
    } catch (err) {
      setError('Failed to load saved addresses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleEditClick = (address: Address) => {
    setEditingAddress(address);
    setValue('addressLine1', address.addressLine1);
    setValue('addressLine2', address.addressLine2 || '');
    setValue('city', address.city);
    setValue('state', address.state);
    setValue('postalCode', address.postalCode);
    setValue('isDefault', address.isDefault);
    setShowForm(true);
  };

  const handleAddNewClick = () => {
    setEditingAddress(null);
    reset();
    setShowForm(true);
  };

  const onSubmit = async (data: AddressInput) => {
    setError(null);
    setActionLoading(true);
    try {
      if (editingAddress) {
        await apiClient.patch(`/addresses/${editingAddress.id}`, data);
      } else {
        await apiClient.post('/addresses', data);
      }
      setShowForm(false);
      reset();
      await loadAddresses();
    } catch (err) {
      setError('Failed to save address. Please verify your inputs.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    setError(null);
    try {
      await apiClient.delete(`/addresses/${id}`);
      await loadAddresses();
    } catch (err) {
      setError('Failed to delete address.');
    }
  };

  const handleSetDefault = async (id: string) => {
    setError(null);
    try {
      await apiClient.patch(`/addresses/${id}/default`);
      await loadAddresses();
    } catch (err) {
      setError('Failed to update default address.');
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 bg-stone-200 rounded w-1/3"></div>
          <div className="h-4 bg-stone-200 rounded w-2/3"></div>
        </div>
        <div className="flex gap-4 border-b border-stone-200 pb-2">
          <div className="h-4 bg-stone-200 rounded w-16"></div>
          <div className="h-4 bg-stone-200 rounded w-24"></div>
          <div className="h-4 bg-stone-200 rounded w-20"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-stone-200 space-y-4">
              <div className="h-4 bg-stone-200 rounded w-1/3"></div>
              <div className="h-4 bg-stone-200 rounded w-3/4"></div>
              <div className="h-4 bg-stone-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && addresses.length === 0 && !loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Profile</h1>
          <p className="text-stone-700 text-sm mt-1">Manage your customer profile and personal info</p>
        </div>
        <div className="flex gap-4 border-b border-stone-200 pb-2">
          <Link href="/profile" className="text-sm font-medium text-stone-600 hover:text-rose-600 pb-2">
            General Info
          </Link>
          <Link href="/profile/addresses" className="text-sm font-semibold text-rose-600 border-b-2 border-rose-600 pb-2">
            Saved Addresses
          </Link>
          <Link href="/profile/measurements" className="text-sm font-medium text-stone-600 hover:text-rose-600 pb-2">
            Measurements
          </Link>
        </div>
        <div className="max-w-md py-16 text-center flex flex-col items-center justify-center space-y-4 mx-auto">
          <span className="text-5xl">📶</span>
          <h2 className="text-xl font-bold text-stone-900 font-serif">Failed to Load Addresses</h2>
          <p className="text-sm text-stone-700 max-w-sm">
            We encountered an issue loading your saved addresses from our servers. Please check your connection.
          </p>
          <button
            onClick={loadAddresses}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">My Profile</h1>
        <p className="text-stone-700 text-sm mt-1">Manage your customer profile and personal info</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-sm text-center">
          {error}
        </div>
      )}

      {/* Navigation Sub-Links */}
      <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-6 border-b border-stone-200 pb-2 text-xs sm:text-sm">
        <Link href="/profile" className="font-medium text-stone-600 hover:text-rose-600 pb-2">
          General Info
        </Link>
        <Link href="/profile/addresses" className="font-semibold text-rose-600 border-b-2 border-rose-600 pb-2">
          Saved Addresses
        </Link>
        <Link href="/profile/measurements" className="font-medium text-stone-600 hover:text-rose-600 pb-2">
          Measurements
        </Link>
      </div>

      {showForm ? (
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 max-w-md space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-stone-800 font-serif">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1">Address Line 1</label>
              <input
                type="text"
                {...register('addressLine1')}
                placeholder="Flat/House No, Building"
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 bg-white"
              />
              {errors.addressLine1 && <p className="text-xs text-rose-500 mt-1">{errors.addressLine1.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1">Address Line 2 (Optional)</label>
              <input
                type="text"
                {...register('addressLine2')}
                placeholder="Street, Area, Landmark"
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1">City</label>
                <input
                  type="text"
                  {...register('city')}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 bg-white"
                />
                {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-800 mb-1">State</label>
                <input
                  type="text"
                  {...register('state')}
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 bg-white"
                />
                {errors.state && <p className="text-xs text-rose-500 mt-1">{errors.state.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-800 mb-1">Postal Code</label>
              <input
                type="text"
                {...register('postalCode')}
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 bg-white"
              />
              {errors.postalCode && <p className="text-xs text-rose-500 mt-1">{errors.postalCode.message}</p>}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isDefault"
                {...register('isDefault')}
                className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-stone-300 rounded"
              />
              <label htmlFor="isDefault" className="text-xs sm:text-sm font-medium text-stone-800 select-none">
                Set as default shipping address
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold text-sm transition-all cursor-pointer"
              >
                {actionLoading ? 'Saving...' : 'Save Address'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 h-12 border border-stone-300 text-stone-700 rounded-full font-semibold text-sm transition-all hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6 max-w-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-lg font-bold text-stone-800 font-serif">Saved Addresses</h2>
            <button
              onClick={handleAddNewClick}
              className="px-5 h-10 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold transition-all active:scale-95 shadow-sm"
            >
              + Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="p-8 sm:p-12 border border-dashed border-stone-300 text-center text-stone-600 rounded-3xl bg-white space-y-3 shadow-sm">
              <span className="text-4xl block select-none">📍</span>
              <p className="text-sm font-bold text-stone-800">No addresses saved yet</p>
              <p className="text-xs text-stone-600 max-w-xs mx-auto">
                Save your home or delivery destination for home fulfillment of tailored garments.
              </p>
              <button
                onClick={handleAddNewClick}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold transition-all mt-2"
              >
                Add First Address
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-5 rounded-3xl border bg-white shadow-sm ${
                    address.isDefault ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-stone-800 text-sm">{address.addressLine1}</p>
                      {address.addressLine2 && <p className="text-xs text-stone-600">{address.addressLine2}</p>}
                      <p className="text-xs text-stone-600">
                        {address.city}, {address.state} - {address.postalCode}
                      </p>
                      {address.isDefault && (
                        <span className="inline-block mt-2 px-3 py-0.5 bg-rose-100 text-rose-700 font-bold text-[9px] rounded-full uppercase tracking-wider">
                          Default Address
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2 sm:pt-0">
                      {!address.isDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="px-3.5 h-8 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-medium transition-colors cursor-pointer"
                        >
                          Make Default
                        </button>
                      )}
                      <button
                        onClick={() => handleEditClick(address)}
                        className="px-3.5 h-8 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-medium transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="px-3.5 h-8 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-full text-xs font-medium transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
