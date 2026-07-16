'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

interface BusinessHour {
  id?: string;
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface Holiday {
  id: string;
  holidayDate: string;
  name: string;
  description?: string;
}

interface ShopSettings {
  status: 'OPEN' | 'CLOSED';
  shopName: string;
  logoUrl?: string;
  aboutShop?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsLink?: string;
  enableHomeDelivery: boolean;
  enablePickup: boolean;
  deliveryCharges: number;
  appointmentDuration: number;
  maxAppointmentsPerSlot: number;
  heroHeading: string;
  heroSubheading: string;
  instagramUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  businessHours: BusinessHour[];
  holidays: Holiday[];
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'business' | 'hours'>('general');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Holiday form states
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayName, setHolidayName] = useState('');
  const [holidayDesc, setHolidayDesc] = useState('');

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/settings');
      // Ensure business hours are sorted by day of week (0 to 6)
      const sortedHours = (response.data.businessHours || []).sort(
        (a: BusinessHour, b: BusinessHour) => a.dayOfWeek - b.dayOfWeek
      );
      setSettings({
        ...response.data,
        businessHours: sortedHours,
      });
    } catch (err) {
      setError('Failed to fetch settings from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!settings) return;
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setSettings({
      ...settings,
      [name]: val,
    });
  };

  const handleCheckboxChange = (name: keyof ShopSettings, checked: boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [name]: checked,
    });
  };

  const handleHourChange = (index: number, field: keyof BusinessHour, value: any) => {
    if (!settings) return;
    const updated = [...settings.businessHours];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setSettings({
      ...settings,
      businessHours: updated,
    });
  };

  const saveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setError(null);
    setSuccess(null);
    setActionLoading(true);
    try {
      await apiClient.patch('/settings', {
        status: settings.status,
        shopName: settings.shopName,
        logoUrl: settings.logoUrl,
        aboutShop: settings.aboutShop,
        heroHeading: settings.heroHeading,
        heroSubheading: settings.heroSubheading,
      });
      setSuccess('General details updated successfully.');
      await loadSettings();
    } catch (err) {
      setError('Failed to save general configurations.');
    } finally {
      setActionLoading(false);
    }
  };

  const saveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setError(null);
    setSuccess(null);
    setActionLoading(true);
    try {
      await apiClient.patch('/settings', {
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        address: settings.address,
        googleMapsLink: settings.googleMapsLink,
        instagramUrl: settings.instagramUrl,
        facebookUrl: settings.facebookUrl,
        websiteUrl: settings.websiteUrl,
      });
      setSuccess('Contact channels and social links saved successfully.');
      await loadSettings();
    } catch (err) {
      setError('Failed to save contact profiles.');
    } finally {
      setActionLoading(false);
    }
  };

  const saveBusinessSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setError(null);
    setSuccess(null);
    setActionLoading(true);
    try {
      await apiClient.patch('/settings', {
        enableHomeDelivery: settings.enableHomeDelivery,
        enablePickup: settings.enablePickup,
        deliveryCharges: Number(settings.deliveryCharges),
        appointmentDuration: Number(settings.appointmentDuration),
        maxAppointmentsPerSlot: Number(settings.maxAppointmentsPerSlot),
      });
      setSuccess('Business policies and charges parameters updated.');
      await loadSettings();
    } catch (err) {
      setError('Failed to save business options.');
    } finally {
      setActionLoading(false);
    }
  };

  const saveHoursSettings = async () => {
    if (!settings) return;

    setError(null);
    setSuccess(null);
    setActionLoading(true);
    try {
      await apiClient.patch('/settings/hours', settings.businessHours);
      setSuccess('Operating hours schedules configured successfully.');
      await loadSettings();
    } catch (err) {
      setError('Failed to save working schedules.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayDate || !holidayName) return;

    setError(null);
    setSuccess(null);
    setActionLoading(true);
    try {
      await apiClient.post('/settings/holidays', {
        holidayDate,
        name: holidayName,
        description: holidayDesc,
      });
      setHolidayDate('');
      setHolidayName('');
      setHolidayDesc('');
      setSuccess('New shop closure date registered.');
      await loadSettings();
    } catch (err) {
      setError('Failed to record holiday log.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteHoliday = async (id: string) => {
    if (!confirm('Are you sure you want to remove this holiday closure?')) return;
    setError(null);
    setSuccess(null);
    try {
      await apiClient.delete(`/settings/holidays/${id}`);
      setSuccess('Holiday closure removed.');
      await loadSettings();
    } catch (err) {
      setError('Failed to delete holiday.');
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setSuccess(null);
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const uploadRes = await apiClient.post('/storage/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const url = uploadRes.data.url;
      // Auto save uploaded URL directly to settings
      await apiClient.patch('/settings', { logoUrl: url });
      setSuccess('Logo updated successfully.');
      await loadSettings();
    } catch (err) {
      setError('Logo upload failed. Must be PNG/JPG/JPEG/WEBP under 2MB.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-sm text-stone-600">Loading settings workspace...</div>;
  }

  if (!settings) return null;

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif">Shop Settings</h1>
        <p className="text-xs text-stone-600 mt-1">Configure business operating frameworks, holidays, logos and links</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-650 rounded-2xl text-xs text-center font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-xs text-center font-medium">
          {success}
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex border-b border-stone-300 gap-6 text-xs font-bold text-stone-600">
        {[
          { id: 'general', name: 'General & Logo' },
          { id: 'contact', name: 'Contact & Socials' },
          { id: 'business', name: 'Policies & Slots' },
          { id: 'hours', name: 'Hours & Holidays' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setError(null);
              setSuccess(null);
            }}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab 1: General */}
      {activeTab === 'general' && (
        <form onSubmit={saveGeneralSettings} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-800">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Shop Brand Name</label>
                <input
                  type="text"
                  name="shopName"
                  value={settings.shopName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Business Status</label>
                <select
                  name="status"
                  value={settings.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                >
                  <option value="OPEN">Open (Bookings Enabled)</option>
                  <option value="CLOSED">Closed (Bookings Disabled)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">About Shop</label>
                <textarea
                  name="aboutShop"
                  value={settings.aboutShop || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Brand Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 border border-stone-300 bg-stone-50 rounded-2xl flex items-center justify-center text-3xl overflow-hidden font-bold">
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      '✨'
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="logoFileInput"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="logoFileInput"
                      className="inline-flex px-4 py-2 border border-stone-300 hover:border-stone-400 text-stone-700 text-xs rounded-full font-bold cursor-pointer transition-colors"
                    >
                      Choose Brand File
                    </label>
                    <p className="text-[10px] text-stone-600 mt-1">Accepts PNG/JPEG/WEBP under 2MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Hero Title Banner</label>
                <input
                  type="text"
                  name="heroHeading"
                  value={settings.heroHeading}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Hero Subheading text</label>
                <input
                  type="text"
                  name="heroSubheading"
                  value={settings.heroSubheading}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs shadow-sm transition-colors"
            >
              {actionLoading ? 'Saving...' : 'Save General Settings'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Contact */}
      {activeTab === 'contact' && (
        <form onSubmit={saveContactSettings} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-800">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={settings.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">WhatsApp Contact Target</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={settings.whatsapp}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Physical Address</label>
                <textarea
                  name="address"
                  value={settings.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Google Maps coordinates Link</label>
                <input
                  type="text"
                  name="googleMapsLink"
                  value={settings.googleMapsLink || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Instagram URL</label>
                <input
                  type="text"
                  name="instagramUrl"
                  value={settings.instagramUrl || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Facebook URL</label>
                <input
                  type="text"
                  name="facebookUrl"
                  value={settings.facebookUrl || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Boutique Portfolio Website (Optional)</label>
                <input
                  type="text"
                  name="websiteUrl"
                  value={settings.websiteUrl || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs shadow-sm transition-colors"
            >
              {actionLoading ? 'Saving...' : 'Save Contacts Details'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Business */}
      {activeTab === 'business' && (
        <form onSubmit={saveBusinessSettings} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-800">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Appointment Slot Interval</label>
                <select
                  name="appointmentDuration"
                  value={settings.appointmentDuration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Max Bookings Per Slot</label>
                <input
                  type="number"
                  name="maxAppointmentsPerSlot"
                  value={settings.maxAppointmentsPerSlot}
                  onChange={handleInputChange}
                  min={1}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Base Delivery Charges (₹)</label>
                <input
                  type="number"
                  name="deliveryCharges"
                  value={settings.deliveryCharges}
                  onChange={handleInputChange}
                  min={0}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableHomeDelivery"
                  checked={settings.enableHomeDelivery}
                  onChange={(e) => handleCheckboxChange('enableHomeDelivery', e.target.checked)}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-stone-300 rounded"
                />
                <label htmlFor="enableHomeDelivery" className="font-semibold select-none">
                  Enable Home Delivery Options
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enablePickup"
                  checked={settings.enablePickup}
                  onChange={(e) => handleCheckboxChange('enablePickup', e.target.checked)}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-stone-300 rounded"
                />
                <label htmlFor="enablePickup" className="font-semibold select-none">
                  Enable Self-Pickup Options
                </label>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={actionLoading}
              className="px-6 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs shadow-sm transition-colors"
            >
              {actionLoading ? 'Saving...' : 'Save Business Policies'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Hours & Holidays */}
      {activeTab === 'hours' && (
        <div className="space-y-6">
          {/* Operating Hours list */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-stone-800 font-serif">Daily Operating Hours</h2>
            <div className="space-y-3 text-xs text-stone-800">
              {settings.businessHours.map((bh, idx) => (
                <div key={idx} className="flex flex-wrap items-center justify-between gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-150">
                  <div className="w-28 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`day-${idx}`}
                      checked={bh.isOpen}
                      onChange={(e) => handleHourChange(idx, 'isOpen', e.target.checked)}
                      className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-stone-300 rounded"
                    />
                    <label htmlFor={`day-${idx}`} className="font-bold select-none">{weekdays[bh.dayOfWeek]}</label>
                  </div>
                  {bh.isOpen ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={bh.openTime}
                        onChange={(e) => handleHourChange(idx, 'openTime', e.target.value)}
                        placeholder="10:00"
                        className="w-18 text-center px-2 py-1 rounded border border-stone-300 bg-white font-mono text-xs text-stone-900"
                      />
                      <span>to</span>
                      <input
                        type="text"
                        value={bh.closeTime}
                        onChange={(e) => handleHourChange(idx, 'closeTime', e.target.value)}
                        placeholder="18:30"
                        className="w-18 text-center px-2 py-1 rounded border border-stone-300 bg-white font-mono text-xs text-stone-900"
                      />
                    </div>
                  ) : (
                    <span className="text-stone-600 font-semibold italic">Store Closed</span>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={saveHoursSettings}
                disabled={actionLoading}
                className="px-6 h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs shadow-sm transition-colors"
              >
                {actionLoading ? 'Saving...' : 'Save Working Days & Hours'}
              </button>
            </div>
          </div>

          {/* Holiday Logs Manager */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Holiday Form */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-stone-800 font-serif">Add Holiday Closure</h2>
              <form onSubmit={handleAddHoliday} className="space-y-4 text-xs text-stone-800">
                <div>
                  <label className="block font-semibold mb-1">Holiday Date</label>
                  <input
                    type="date"
                    value={holidayDate}
                    onChange={(e) => setHolidayDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Holiday Name</label>
                  <input
                    type="text"
                    value={holidayName}
                    onChange={(e) => setHolidayName(e.target.value)}
                    placeholder="e.g. Independence Day"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 placeholder:text-stone-500 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Description (Optional)</label>
                  <input
                    type="text"
                    value={holidayDesc}
                    onChange={(e) => setHolidayDesc(e.target.value)}
                    placeholder="Boutique closed for national holiday"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 placeholder:text-stone-500 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold text-xs shadow-sm transition-colors"
                >
                  {actionLoading ? 'Registering...' : 'Add Date'}
                </button>
              </form>
            </div>

            {/* Holiday list */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-stone-800 font-serif">Registered Closures</h2>
              {settings.holidays.length === 0 ? (
                <p className="text-xs text-stone-600 py-6 text-center">No holiday dates configured.</p>
              ) : (
                <div className="space-y-3 text-xs text-stone-800 max-h-[300px] overflow-y-auto pr-1">
                  {settings.holidays.map((h) => (
                    <div key={h.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-150 flex justify-between items-center gap-4">
                      <div>
                        <p className="font-bold text-stone-800">{h.name}</p>
                        <p className="text-[10px] text-stone-600 font-mono">
                          {new Date(h.holidayDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteHoliday(h.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
