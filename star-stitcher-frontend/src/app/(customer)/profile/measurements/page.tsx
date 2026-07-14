'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

const measurementSchema = z.object({
  bust: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().positive().optional()),
  underBust: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().positive().optional()),
  waist: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().positive().optional()),
  hip: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().positive().optional()),
  shoulder: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().positive().optional()),
  armHole: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().positive().optional()),
  sleeveLength: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().positive().optional()),
  sleeveRound: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().positive().optional()),
  frontNeckDepth: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().positive().optional()),
  backNeckDepth: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().positive().optional()),
  totalLength: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().positive().optional()),
  bottomRound: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().positive().optional()),
  notes: z.string().optional(),
});

type MeasurementInput = z.infer<typeof measurementSchema>;

export default function MeasurementsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{
    version: number;
    measurementSource: string;
    verifiedByShop: boolean;
    verifiedAt?: string | null;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors: formErrors },
  } = useForm<any>({
    resolver: zodResolver(measurementSchema),
  });

  const errors = formErrors as Record<string, any>;

  const loadMeasurements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/measurements');
      const data = response.data;
      if (data) {
        setValue('bust', data.bust ?? '');
        setValue('underBust', data.underBust ?? '');
        setValue('waist', data.waist ?? '');
        setValue('hip', data.hip ?? '');
        setValue('shoulder', data.shoulder ?? '');
        setValue('armHole', data.armHole ?? '');
        setValue('sleeveLength', data.sleeveLength ?? '');
        setValue('sleeveRound', data.sleeveRound ?? '');
        setValue('frontNeckDepth', data.frontNeckDepth ?? '');
        setValue('backNeckDepth', data.backNeckDepth ?? '');
        setValue('totalLength', data.totalLength ?? '');
        setValue('bottomRound', data.bottomRound ?? '');
        setValue('notes', data.notes ?? '');

        setMetadata({
          version: data.version,
          measurementSource: data.measurementSource,
          verifiedByShop: data.verifiedByShop,
          verifiedAt: data.verifiedAt,
        });
      }
    } catch (err) {
      setError('Failed to load sizing measurements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeasurements();
  }, [setValue]);

  const onSubmit = async (data: MeasurementInput) => {
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      const response = await apiClient.put('/measurements', data);
      const updated = response.data;
      setSuccess(true);
      setMetadata({
        version: updated.version,
        measurementSource: updated.measurementSource,
        verifiedByShop: updated.verifiedByShop,
        verifiedAt: updated.verifiedAt,
      });
    } catch (err) {
      setError('Failed to update measurements. Please check sizing inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-stone-200 rounded w-1/2"></div>
              <div className="h-12 bg-stone-200 rounded-2xl w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !loading && !metadata?.version) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-850">My Profile</h1>
          <p className="text-stone-655 text-sm mt-1">Manage your customer profile and personal info</p>
        </div>
        <div className="flex gap-4 border-b border-stone-200 pb-2">
          <Link href="/profile" className="text-sm font-medium text-stone-650 hover:text-rose-600 pb-2">
            General Info
          </Link>
          <Link href="/profile/addresses" className="text-sm font-medium text-stone-650 hover:text-rose-600 pb-2">
            Saved Addresses
          </Link>
          <Link href="/profile/measurements" className="text-sm font-semibold text-rose-600 border-b-2 border-rose-600 pb-2">
            Measurements
          </Link>
        </div>
        <div className="max-w-md py-16 text-center flex flex-col items-center justify-center space-y-4 mx-auto">
          <span className="text-5xl">📶</span>
          <h2 className="text-xl font-bold text-stone-850 font-serif">Failed to Load Measurements</h2>
          <p className="text-sm text-stone-650 max-w-sm">
            We encountered an issue loading your sizing measurements from our servers. Please check your connection.
          </p>
          <button
            onClick={loadMeasurements}
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
        <h1 className="text-2xl font-bold text-stone-800">My Profile</h1>
        <p className="text-stone-600 text-sm mt-1">Manage your customer profile and personal info</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-sm text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm text-center">
          Measurement specifications updated successfully!
        </div>
      )}

      {/* Navigation Sub-Links */}
      <div className="flex gap-4 border-b border-stone-200 pb-2">
        <Link href="/profile" className="text-sm font-medium text-stone-600 hover:text-rose-600 pb-2">
          General Info
        </Link>
        <Link href="/profile/addresses" className="text-sm font-medium text-stone-600 hover:text-rose-600 pb-2">
          Saved Addresses
        </Link>
        <Link href="/profile/measurements" className="text-sm font-semibold text-rose-600 border-b-2 border-rose-600 pb-2">
          Measurements
        </Link>
      </div>

      {metadata && (
        <div className="p-5 bg-stone-50 rounded-3xl border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] text-stone-500 font-bold uppercase">Sizing Version</p>
            <p className="text-lg font-bold text-stone-800">v{metadata.version}</p>
          </div>
          <div>
            <p className="text-[10px] text-stone-500 font-bold uppercase">Source Type</p>
            <p className="text-sm font-bold text-stone-800">{metadata.measurementSource}</p>
          </div>
          <div>
            <p className="text-[10px] text-stone-500 font-bold uppercase">Shop Verification</p>
            <span
              className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                metadata.verifiedByShop
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {metadata.verifiedByShop ? 'VERIFIED' : 'PENDING'}
            </span>
          </div>
          {metadata.verifiedAt && (
            <div>
              <p className="text-[10px] text-stone-500 font-bold uppercase">Verified At</p>
              <p className="text-xs font-semibold text-stone-600">
                {new Date(metadata.verifiedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-800 border-l-4 border-rose-500 pl-3">
            Upper Body Sizing (Inches)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Bust</label>
              <input
                type="number"
                step="0.1"
                {...register('bust')}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
              />
              {errors.bust && <p className="text-[10px] text-rose-500 mt-1">{errors.bust.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Under Bust</label>
              <input
                type="number"
                step="0.1"
                {...register('underBust')}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
              />
              {errors.underBust && <p className="text-[10px] text-rose-500 mt-1">{errors.underBust.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Shoulder</label>
              <input
                type="number"
                step="0.1"
                {...register('shoulder')}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
              />
              {errors.shoulder && <p className="text-[10px] text-rose-500 mt-1">{errors.shoulder.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Armhole</label>
              <input
                type="number"
                step="0.1"
                {...register('armHole')}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
              />
              {errors.armHole && <p className="text-[10px] text-rose-500 mt-1">{errors.armHole.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Sleeve Length</label>
              <input
                type="number"
                step="0.1"
                {...register('sleeveLength')}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
              />
              {errors.sleeveLength && <p className="text-[10px] text-rose-500 mt-1">{errors.sleeveLength.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Sleeve Round</label>
              <input
                type="number"
                step="0.1"
                {...register('sleeveRound')}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
              />
              {errors.sleeveRound && <p className="text-[10px] text-rose-500 mt-1">{errors.sleeveRound.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Front Neck Depth</label>
              <input
                type="number"
                step="0.1"
                {...register('frontNeckDepth')}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
              />
              {errors.frontNeckDepth && <p className="text-[10px] text-rose-500 mt-1">{errors.frontNeckDepth.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Back Neck Depth</label>
              <input
                type="number"
                step="0.1"
                {...register('backNeckDepth')}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
              />
              {errors.backNeckDepth && <p className="text-[10px] text-rose-500 mt-1">{errors.backNeckDepth.message}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-800 border-l-4 border-rose-500 pl-3">
            Lower Body & Lengths (Inches)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Waist</label>
              <input
                type="number"
                step="0.1"
                {...register('waist')}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
              />
              {errors.waist && <p className="text-[10px] text-rose-500 mt-1">{errors.waist.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Hip</label>
              <input
                type="number"
                step="0.1"
                {...register('hip')}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
              />
              {errors.hip && <p className="text-[10px] text-rose-500 mt-1">{errors.hip.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Top Length</label>
              <input
                type="number"
                step="0.1"
                {...register('totalLength')}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
              />
              {errors.totalLength && <p className="text-[10px] text-rose-500 mt-1">{errors.totalLength.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Bottom Round</label>
              <input
                type="number"
                step="0.1"
                {...register('bottomRound')}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
              />
              {errors.bottomRound && <p className="text-[10px] text-rose-500 mt-1">{errors.bottomRound.message}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold text-stone-800 border-l-4 border-rose-500 pl-3">
            Custom Notes
          </h2>
          <div>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="e.g. want high neck collar or looser sleeve cuffs..."
              className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm bg-white"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={saving}
            className="h-12 px-8 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold transition-all active:scale-98 text-sm disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Update Measurement Sheet'}
          </button>
        </div>
      </form>
    </div>
  );
}
