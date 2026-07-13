'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

interface AppointmentInfo {
  bookingId: string;
  shortId: string;
  customerName: string;
  designName: string;
  timeSlot: string; // e.g. "14:00"
  status: string;
}

export default function AdminCalendarPage() {
  const [appointments, setAppointments] = useState<Record<string, AppointmentInfo[]>>({});
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);

  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/bookings/admin');
      const data = response.data;
      
      const mapped: Record<string, AppointmentInfo[]> = {};
      data.forEach((b: any) => {
        if (b.appointment && (b.status === 'APPROVED' || b.status === 'PENDING')) {
          const dateObj = new Date(b.appointment.appointmentDate);
          const dateStr = dateObj.toISOString().split('T')[0];
          
          const hours = dateObj.getHours().toString().padStart(2, '0');
          const minutes = dateObj.getMinutes().toString().padStart(2, '0');
          const timeSlot = `${hours}:${minutes}`;

          if (!mapped[dateStr]) mapped[dateStr] = [];
          mapped[dateStr].push({
            bookingId: b.id,
            shortId: b.shortId,
            customerName: b.customer.name,
            designName: b.design.name,
            timeSlot,
            status: b.appointment.status,
          });
        }
      });
      setAppointments(mapped);
    } catch (err) {
      console.error('Failed to load calendar scheduling slots', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray: (number | null)[] = [];
  // Fill leading empty cells
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null);
  }
  // Fill day numbers
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const selectedDateAppointments = appointments[selectedDateStr] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-850 font-serif">Boutique Appointments Calendar</h1>
        <p className="text-xs text-stone-500 mt-1">
          Monitor sizing consultation slots (Working hours: Mon - Sat, 10:00 AM - 8:30 PM)
        </p>
      </div>

      {loading && Object.keys(appointments).length === 0 ? (
        <div className="text-center py-12 text-xs text-stone-500">Loading appointments planner...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Monthly grid calendar (Left 8 columns) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-stone-800 font-serif">
                {currentDate.toLocaleString([], { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="w-9 h-9 border border-stone-300 rounded-full flex items-center justify-center hover:bg-stone-50 transition-colors text-sm"
                >
                  ←
                </button>
                <button
                  onClick={handleNextMonth}
                  className="w-9 h-9 border border-stone-300 rounded-full flex items-center justify-center hover:bg-stone-50 transition-colors text-sm"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-500 uppercase tracking-wider">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {daysArray.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-16 bg-stone-50/50 rounded-xl" />;
                }

                const dDateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const hasAppointments = !!appointments[dDateStr];
                const isSelected = selectedDateStr === dDateStr;
                const isSunday = new Date(year, month, day).getDay() === 0;

                return (
                  <button
                    key={`day-${day}`}
                    onClick={() => setSelectedDateStr(dDateStr)}
                    className={`h-16 p-2 rounded-xl flex flex-col justify-between border transition-all text-left relative ${
                      isSelected
                        ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50/20'
                        : isSunday
                        ? 'bg-rose-50/10 border-stone-150 text-stone-400 cursor-not-allowed'
                        : 'border-stone-200 bg-white hover:border-rose-300'
                    }`}
                    disabled={isSunday}
                  >
                    <span className="font-bold text-xs">{day}</span>
                    {hasAppointments && !isSunday && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 block self-end" />
                    )}
                    {isSunday && (
                      <span className="text-[8px] font-bold text-stone-400 block self-end">CLOSED</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots Drawer (Right 4 columns) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-stone-850 font-serif">Time Slots Planner</h2>
              <p className="text-[11px] text-stone-500">
                Schedules for:{' '}
                <span className="font-bold text-stone-800">
                  {new Date(selectedDateStr).toLocaleDateString([], {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </p>
            </div>

            <div className="space-y-3">
              {timeSlots.map((ts) => {
                const booking = selectedDateAppointments.find((a) => a.timeSlot === ts);
                return (
                  <div
                    key={ts}
                    className={`p-3 rounded-2xl border text-xs flex justify-between items-center transition-all ${
                      booking
                        ? 'border-rose-200 bg-rose-50/30'
                        : 'border-stone-200 bg-stone-50/30'
                    }`}
                  >
                    <span className="font-bold text-stone-700">{ts}</span>
                    {booking ? (
                      <div className="text-right">
                        <p className="font-bold text-stone-850">{booking.customerName}</p>
                        <p className="text-[10px] text-stone-500">
                          {booking.designName} | {booking.shortId}
                        </p>
                      </div>
                    ) : (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 font-bold text-[9px] rounded uppercase tracking-wider">
                        Available
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
