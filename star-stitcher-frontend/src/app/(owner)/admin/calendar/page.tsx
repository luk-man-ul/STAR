'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import Link from 'next/link';

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
  appointmentDuration: number;
  maxAppointmentsPerSlot: number;
  businessHours: BusinessHour[];
  holidays: Holiday[];
}

interface AppointmentInfo {
  bookingId: string;
  shortId: string;
  customerName: string;
  customerPhone: string;
  designName: string;
  measurementMethod: string;
  measurementProfileName?: string;
  timeSlot: string; // e.g. "10:30"
  bookingStatus: string;
  appointmentStatus: string;
}

export default function AdminCalendarPage() {
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [appointments, setAppointments] = useState<Record<string, AppointmentInfo[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('UPCOMING');

  // Load ShopSettings and Booking Appointments in parallel
  const loadCalendarData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [settingsRes, bookingsRes] = await Promise.all([
        apiClient.get('/settings'),
        apiClient.get('/bookings/admin'),
      ]);

      setSettings(settingsRes.data);

      const mapped: Record<string, AppointmentInfo[]> = {};
      const data = bookingsRes.data || [];

      data.forEach((b: any) => {
        if (b.appointment) {
          const dateObj = new Date(b.appointment.appointmentDate);
          const dateStr = dateObj.toISOString().split('T')[0];

          const hours = dateObj.getHours().toString().padStart(2, '0');
          const minutes = dateObj.getMinutes().toString().padStart(2, '0');
          const timeSlot = `${hours}:${minutes}`;

          if (!mapped[dateStr]) mapped[dateStr] = [];
          mapped[dateStr].push({
            bookingId: b.id,
            shortId: b.shortId,
            customerName: b.customer?.name || 'Customer',
            customerPhone: b.customer?.phone || '',
            designName: b.design?.name || 'Custom Garment',
            measurementMethod: b.measurementMethod || 'SHOP',
            measurementProfileName: b.measurement?.profileName,
            timeSlot,
            bookingStatus: b.status,
            appointmentStatus: b.appointment.status,
          });
        }
      });
      setAppointments(mapped);
    } catch (err) {
      console.error('Failed to load calendar scheduling resources', err);
      setError('Failed to load calendar scheduling slots.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCalendarData();
  }, []);

  // Filter helper based on statusFilter dropdown
  const filterAppointments = (list: AppointmentInfo[]) => {
    return list.filter((item) => {
      switch (statusFilter) {
        case 'UPCOMING':
          return (
            ['PENDING', 'APPROVED'].includes(item.bookingStatus) &&
            ['SCHEDULED', 'RESCHEDULED', 'ARRIVED'].includes(item.appointmentStatus)
          );
        case 'PENDING':
          return item.bookingStatus === 'PENDING';
        case 'APPROVED':
          return item.bookingStatus === 'APPROVED';
        case 'CONVERTED':
          return item.bookingStatus === 'CONVERTED';
        case 'CANCELLED':
          return (
            ['REJECTED', 'CANCELLED'].includes(item.bookingStatus) ||
            item.appointmentStatus === 'CANCELLED'
          );
        case 'ALL':
        default:
          return true;
      }
    });
  };

  // Helper: Generate dynamic time slots synchronized with ShopSettings
  const getTimeSlotsForDate = (dateStr: string) => {
    if (!settings || !settings.businessHours) {
      return ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    }

    const dateObj = new Date(dateStr);
    const dayOfWeek = dateObj.getDay();
    const daySchedule = settings.businessHours.find((bh) => bh.dayOfWeek === dayOfWeek);

    if (!daySchedule || !daySchedule.isOpen) {
      return [];
    }

    const [openH, openM] = daySchedule.openTime.split(':').map((x) => parseInt(x, 10) || 0);
    const [closeH, closeM] = daySchedule.closeTime.split(':').map((x) => parseInt(x, 10) || 0);
    const duration = settings.appointmentDuration || 30;

    let currentMinutes = openH * 60 + openM;
    const closeMinutes = closeH * 60 + closeM;
    const slots: string[] = [];

    while (currentMinutes <= closeMinutes) {
      const h = Math.floor(currentMinutes / 60).toString().padStart(2, '0');
      const m = (currentMinutes % 60).toString().padStart(2, '0');
      slots.push(`${h}:${m}`);
      currentMinutes += duration > 0 ? duration : 30;
    }

    return slots;
  };

  // Helper: Check if date string matches a registered Holiday
  const getHolidayForDate = (dateStr: string): Holiday | null => {
    if (!settings || !settings.holidays) return null;
    const match = settings.holidays.find((h) => {
      const hDate = new Date(h.holidayDate).toISOString().split('T')[0];
      return hDate === dateStr;
    });
    return match || null;
  };

  // Calendar month calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const rawDateAppts = appointments[selectedDateStr] || [];
  const selectedDateAppointments = filterAppointments(rawDateAppts);
  const activeTimeSlots = getTimeSlotsForDate(selectedDateStr);
  const selectedHoliday = getHolidayForDate(selectedDateStr);

  const getStatusBadgeStyle = (bStatus: string) => {
    switch (bStatus) {
      case 'PENDING':
        return 'bg-amber-100 text-amber-700';
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-700';
      case 'CONVERTED':
        return 'bg-indigo-100 text-indigo-700';
      case 'REJECTED':
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Filter Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">Boutique Appointments Calendar</h1>
          <p className="text-xs text-stone-600 mt-1">
            Dynamic consultation slots synchronized with shop operating hours &amp; holidays
          </p>
        </div>

        {/* Appointment Status Filter dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="calendarStatusFilter" className="text-xs font-bold text-stone-600 shrink-0">
            Filter:
          </label>
          <select
            id="calendarStatusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs font-semibold text-stone-900 bg-white"
          >
            <option value="UPCOMING">Upcoming Active (Default)</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved Consultations</option>
            <option value="CONVERTED">Converted to Orders</option>
            <option value="CANCELLED">Cancelled / Rejected</option>
            <option value="ALL">All Schedules</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-650 rounded-2xl text-xs text-center font-medium">
          {error}
        </div>
      )}

      {loading && Object.keys(appointments).length === 0 ? (
        <div className="text-center py-12 text-xs text-stone-600">Loading appointments planner...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Monthly grid calendar (Left 8 columns) */}
          <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-stone-800 font-serif">
                {currentDate.toLocaleString([], { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  aria-label="Previous Month"
                  className="w-9 h-9 border border-stone-300 rounded-full flex items-center justify-center hover:bg-stone-50 transition-colors text-sm text-stone-700 cursor-pointer"
                >
                  ←
                </button>
                <button
                  onClick={handleNextMonth}
                  aria-label="Next Month"
                  className="w-9 h-9 border border-stone-300 rounded-full flex items-center justify-center hover:bg-stone-50 transition-colors text-sm text-stone-700 cursor-pointer"
                >
                  →
                </button>
              </div>
            </div>

            {/* Calendar Days Header */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-stone-600 uppercase tracking-wider">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {daysArray.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-14 sm:h-16 bg-stone-50/50 rounded-xl" />;
                }

                const monthStr = (month + 1).toString().padStart(2, '0');
                const dayStr = day.toString().padStart(2, '0');
                const dDateStr = `${year}-${monthStr}-${dayStr}`;

                const rawList = appointments[dDateStr] || [];
                const filteredList = filterAppointments(rawList);
                const apptCount = filteredList.length;

                const isSelected = selectedDateStr === dDateStr;
                const dateObj = new Date(year, month, day);
                const dayOfWeek = dateObj.getDay();

                const holiday = getHolidayForDate(dDateStr);
                const daySchedule = settings?.businessHours?.find((bh) => bh.dayOfWeek === dayOfWeek);
                const isStoreClosed = (!daySchedule || !daySchedule.isOpen) && !holiday;

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => setSelectedDateStr(dDateStr)}
                    aria-label={`Date ${dDateStr}, ${
                      holiday ? `Holiday: ${holiday.name}` : isStoreClosed ? 'Closed' : `${apptCount} appointments`
                    }`}
                    className={`h-14 sm:h-16 p-1.5 sm:p-2 rounded-xl flex flex-col justify-between border transition-all text-left relative cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20'
                        : holiday
                        ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                        : isStoreClosed
                        ? 'bg-stone-100/60 border-stone-200 text-stone-600'
                        : 'border-stone-200 bg-white hover:border-rose-300'
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-bold text-xs text-stone-800">{day}</span>
                      {holiday && (
                        <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-amber-200 text-amber-800 uppercase shrink-0">
                          Holiday
                        </span>
                      )}
                    </div>

                    {/* Daily Indicators */}
                    {!holiday && isStoreClosed && (
                      <span className="text-[8px] font-bold text-stone-600 block self-end">CLOSED</span>
                    )}

                    {!holiday && !isStoreClosed && apptCount > 0 && (
                      <div className="flex items-center gap-1 self-end">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block shrink-0" />
                        <span className="text-[9px] font-extrabold text-rose-600">
                          {apptCount}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar Visual Legend */}
            <div className="pt-3 border-t border-stone-100 flex flex-wrap gap-4 text-[11px] text-stone-600 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md border-2 border-rose-500 bg-rose-50/20 block" />
                <span>Selected Date</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 block" />
                <span>Active Appointment</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-100 border border-amber-200 block" />
                <span>Holiday Closure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-stone-100 border border-stone-200 block" />
                <span>Regular Closed Day</span>
              </div>
            </div>
          </div>

          {/* Time Slots Drawer (Right 4 columns) */}
          <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-stone-800 font-serif">Time Slots Planner</h2>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Schedule for:{' '}
                <span className="font-bold text-stone-850">
                  {new Date(selectedDateStr).toLocaleDateString([], {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </p>
            </div>

            {/* Holiday or Closed Notice */}
            {selectedHoliday ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                <span className="font-bold block">🎉 Shop Closed for Holiday</span>
                <p className="font-semibold text-amber-800">{selectedHoliday.name}</p>
                {selectedHoliday.description && (
                  <p className="text-[10px] text-amber-700">{selectedHoliday.description}</p>
                )}
              </div>
            ) : activeTimeSlots.length === 0 ? (
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-600 text-center font-medium">
                The boutique is closed on this day. No slots available.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {activeTimeSlots.map((ts) => {
                  const booking = selectedDateAppointments.find((a) => a.timeSlot === ts);
                  return (
                    <div
                      key={ts}
                      className={`p-3.5 rounded-2xl border text-xs flex flex-col justify-between gap-2 transition-all ${
                        booking
                          ? 'border-stone-300 bg-stone-50/70 shadow-2xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-stone-900 text-xs">{ts}</span>
                        {booking ? (
                          <span
                            className={`px-2 py-0.5 rounded font-extrabold text-[8px] uppercase tracking-wider ${getStatusBadgeStyle(
                              booking.bookingStatus
                            )}`}
                          >
                            {booking.bookingStatus}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-extrabold text-[8px] rounded uppercase tracking-wider">
                            Available
                          </span>
                        )}
                      </div>

                      {booking && (
                        <div className="space-y-1.5 pt-1 border-t border-stone-200/60">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold text-stone-850">{booking.customerName}</p>
                              {booking.customerPhone && (
                                <p className="text-[10px] text-stone-600">{booking.customerPhone}</p>
                              )}
                            </div>
                            <span className="text-[10px] font-bold text-stone-600">{booking.shortId}</span>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-stone-600 font-medium">
                            <span>Style: {booking.designName}</span>
                            <span className="font-semibold text-stone-700">
                              {booking.measurementMethod === 'ONLINE'
                                ? `Online (${booking.measurementProfileName || 'Default'})`
                                : 'In-Store'}
                            </span>
                          </div>

                          <div className="pt-1 flex justify-end">
                            <Link
                              href="/admin/bookings"
                              className="text-[10px] text-rose-600 font-bold hover:underline"
                            >
                              Manage Booking →
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
