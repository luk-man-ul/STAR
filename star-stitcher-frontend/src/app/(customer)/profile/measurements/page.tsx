'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

const measurementSchema = z.object({
  profileName: z.string().min(1, 'Profile name is required'),
  isDefault: z.boolean().optional(),
  bust: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  underBust: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  waist: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  hip: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  shoulder: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  armHole: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  sleeveLength: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  sleeveRound: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  frontNeckDepth: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  backNeckDepth: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  totalLength: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  bottomRound: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().positive().optional()),
  notes: z.string().optional(),
});

type MeasurementInput = z.infer<typeof measurementSchema>;

export default function MeasurementsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
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
      setProfiles(response.data || []);
    } catch (err) {
      setError('Failed to load sizing measurements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeasurements();
  }, []);

  const handleMakeDefault = async (id: string) => {
    setError(null);
    setSuccess(null);
    try {
      await apiClient.patch(`/measurements/${id}/default`);
      setSuccess('Default profile updated successfully!');
      await loadMeasurements();
    } catch (err) {
      setError('Failed to set default profile.');
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setSuccess(null);
    if (!confirm('Are you sure you want to delete this measurement profile?')) return;
    try {
      await apiClient.delete(`/measurements/${id}`);
      setSuccess('Measurement profile deleted successfully!');
      await loadMeasurements();
    } catch (err) {
      setError('Failed to delete measurement profile.');
    }
  };

  const handleStartAdd = () => {
    setError(null);
    setSuccess(null);
    setEditingProfile(null);
    reset({
      profileName: '',
      isDefault: profiles.length === 0,
      bust: undefined,
      underBust: undefined,
      waist: undefined,
      hip: undefined,
      shoulder: undefined,
      armHole: undefined,
      sleeveLength: undefined,
      sleeveRound: undefined,
      frontNeckDepth: undefined,
      backNeckDepth: undefined,
      totalLength: undefined,
      bottomRound: undefined,
      notes: '',
    });
    setIsEditing(true);
  };

  const handleStartEdit = (profile: any) => {
    setError(null);
    setSuccess(null);
    setEditingProfile(profile);
    reset({
      profileName: profile.profileName,
      isDefault: profile.isDefault,
      bust: profile.bust ?? undefined,
      underBust: profile.underBust ?? undefined,
      waist: profile.waist ?? undefined,
      hip: profile.hip ?? undefined,
      shoulder: profile.shoulder ?? undefined,
      armHole: profile.armHole ?? undefined,
      sleeveLength: profile.sleeveLength ?? undefined,
      sleeveRound: profile.sleeveRound ?? undefined,
      frontNeckDepth: profile.frontNeckDepth ?? undefined,
      backNeckDepth: profile.backNeckDepth ?? undefined,
      totalLength: profile.totalLength ?? undefined,
      bottomRound: profile.bottomRound ?? undefined,
      notes: profile.notes ?? '',
    });
    setIsEditing(true);
  };

  const onSubmit = async (data: MeasurementInput) => {
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      if (editingProfile) {
        await apiClient.patch(`/measurements/${editingProfile.id}`, data);
        setSuccess('Measurement profile updated successfully!');
      } else {
        await apiClient.post('/measurements', data);
        setSuccess('New measurement profile created successfully!');
      }
      setIsEditing(false);
      await loadMeasurements();
    } catch (err) {
      setError('Failed to save measurement profile. Please check your inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && profiles.length === 0) {
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
        <div className="space-y-4 pt-4">
          <div className="h-28 bg-stone-200 rounded-3xl w-full"></div>
          <div className="h-28 bg-stone-200 rounded-3xl w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif">My Profile</h1>
        <p className="text-stone-700 text-sm mt-1">Manage your customer profile and personal info</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-sm text-center font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm text-center font-medium">
          {success}
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

      {isEditing ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-stone-850 font-serif">
              {editingProfile ? `Edit Profile: ${editingProfile.profileName}` : 'Add New Measurement Profile'}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-semibold transition-all"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
            {/* Profile Config */}
            <div className="p-5 bg-stone-50 rounded-3xl border border-stone-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Profile Name (e.g. Self, Daughter Aisha)</label>
                <input
                  type="text"
                  placeholder="e.g. Aisha"
                  {...register('profileName')}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 bg-white"
                />
                {errors.profileName && <p className="text-[10px] text-rose-500 mt-1">{errors.profileName.message}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  {...register('isDefault')}
                  className="rounded border-stone-300 text-rose-600 focus:ring-rose-500 h-4 w-4"
                />
                <label htmlFor="isDefault" className="text-xs font-semibold text-stone-700 select-none">
                  Set as default measurement profile
                </label>
              </div>
            </div>

            {/* Sizing inputs */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider border-l-4 border-rose-500 pl-3">
                Upper Body Sizing (Inches)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'bust', label: 'Bust' },
                  { name: 'underBust', label: 'Under Bust' },
                  { name: 'shoulder', label: 'Shoulder' },
                  { name: 'armHole', label: 'Armhole' },
                  { name: 'sleeveLength', label: 'Sleeve Length' },
                  { name: 'sleeveRound', label: 'Sleeve Round' },
                  { name: 'frontNeckDepth', label: 'Front Neck Depth' },
                  { name: 'backNeckDepth', label: 'Back Neck Depth' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">{field.label}</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="--"
                      {...register(field.name as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 bg-white"
                    />
                    {errors[field.name] && <p className="text-[10px] text-rose-500 mt-1">{errors[field.name].message}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider border-l-4 border-rose-500 pl-3">
                Lower Body & Lengths (Inches)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'waist', label: 'Waist' },
                  { name: 'hip', label: 'Hip' },
                  { name: 'totalLength', label: 'Top Length' },
                  { name: 'bottomRound', label: 'Bottom Round' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">{field.label}</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="--"
                      {...register(field.name as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 bg-white"
                    />
                    {errors[field.name] && <p className="text-[10px] text-rose-500 mt-1">{errors[field.name].message}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider border-l-4 border-rose-500 pl-3">
                Custom Notes
              </h3>
              <div>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="e.g. want high neck collar or looser sleeve cuffs..."
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 placeholder:text-stone-500 bg-white"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={saving}
                className="h-11 px-8 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold transition-all active:scale-98 text-xs disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingProfile ? 'Save Changes' : 'Create Profile'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="h-11 px-6 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full font-semibold transition-all text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-stone-850 font-serif">Saved Sizing Profiles</h2>
            <button
              onClick={handleStartAdd}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-semibold shadow-sm transition-all"
            >
              Add Profile
            </button>
          </div>

          {profiles.length === 0 ? (
            <div className="py-12 border border-dashed border-stone-300 rounded-3xl text-center space-y-3">
              <span className="text-4xl block">📏</span>
              <p className="text-sm font-semibold text-stone-800">No measurement profiles saved</p>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Create a sizing profile so we can make clothes tailored exactly to your body shape.
              </p>
              <button
                onClick={handleStartAdd}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-semibold transition-all"
              >
                Create First Profile
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-stone-900 font-serif text-sm">{profile.profileName}</h3>
                      {profile.isDefault && (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-600 uppercase">
                          Default
                        </span>
                      )}
                    </div>

                    {/* Sizing preview summary */}
                    <div className="grid grid-cols-4 gap-4 text-center max-w-md bg-stone-50 p-3 rounded-2xl border border-stone-150">
                      <div>
                        <span className="block text-[8px] font-bold text-stone-500 uppercase">Bust</span>
                        <span className="text-xs font-bold text-stone-800">{profile.bust ? `${profile.bust}"` : '--'}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-bold text-stone-500 uppercase">Waist</span>
                        <span className="text-xs font-bold text-stone-800">{profile.waist ? `${profile.waist}"` : '--'}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-bold text-stone-500 uppercase">Hip</span>
                        <span className="text-xs font-bold text-stone-800">{profile.hip ? `${profile.hip}"` : '--'}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-bold text-stone-500 uppercase">Length</span>
                        <span className="text-xs font-bold text-stone-800">{profile.totalLength ? `${profile.totalLength}"` : '--'}</span>
                      </div>
                    </div>

                    {profile.notes && (
                      <p className="text-xs text-stone-600 line-clamp-1">
                        <strong>Notes:</strong> {profile.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2 border-t md:border-t-0 border-stone-100 pt-4 md:pt-0">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStartEdit(profile)}
                        className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-bold rounded-full transition-all"
                      >
                        Edit Sizing
                      </button>
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold rounded-full transition-all"
                      >
                        Delete
                      </button>
                    </div>

                    {!profile.isDefault && (
                      <button
                        onClick={() => handleMakeDefault(profile.id)}
                        className="text-stone-600 hover:text-stone-850 text-[10px] font-bold hover:underline"
                      >
                        Set as Default
                      </button>
                    )}
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
