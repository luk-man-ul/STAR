'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid 10-digit phone number'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactInput = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    setSubmitting(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    setSuccess(true);
    reset();
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-stone-900 font-serif">Contact Us</h1>
        <p className="text-stone-600 text-sm">
          Have queries about sizes, pricing, or custom designs? Get in touch with our boutique team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info (Left Column) */}
        <div className="lg:col-span-5 space-y-8 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-stone-800 font-serif mb-4">Store Details</h2>
            <div className="space-y-4 text-sm text-stone-600">
              <div>
                <p className="font-bold text-stone-800">📍 Address</p>
                <p className="mt-1 leading-relaxed">
                  12, Rose Villa, Malleshwaram,<br />
                  Bangalore, Karnataka - 560003
                </p>
              </div>

              <div>
                <p className="font-bold text-stone-800">📞 Telephone</p>
                <p className="mt-1">+91 98765 43210</p>
              </div>

              <div>
                <p className="font-bold text-stone-800">✉️ Email Address</p>
                <p className="mt-1">hello@starstitcher.com</p>
              </div>

              <div>
                <p className="font-bold text-stone-800">🕒 Boutique Hours</p>
                <p className="mt-1">
                  Monday - Saturday: 10:00 AM - 8:30 PM<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-150 space-y-4">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider">Direct Chat</h3>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-3 px-6 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold transition-all active:scale-98 text-sm"
            >
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Contact Form (Right Column) */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-stone-800 font-serif">Send Us a Message</h2>
            <p className="text-stone-600 text-xs mt-1">We will respond within 24 business hours.</p>
          </div>

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl text-sm font-medium">
              🎉 Message submitted successfully! Our boutique assistants will contact you soon.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">Full Name</label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 placeholder:text-stone-500 bg-white"
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">Phone Number</label>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 placeholder:text-stone-500 bg-white"
                />
                {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">Email Address</label>
              <input
                type="email"
                {...register('email')}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 placeholder:text-stone-500 bg-white"
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">Subject</label>
              <input
                type="text"
                {...register('subject')}
                placeholder="Stitching query / Sizing help"
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 placeholder:text-stone-500 bg-white"
              />
              {errors.subject && <p className="text-xs text-rose-500 mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">Message Description</label>
              <textarea
                {...register('message')}
                rows={4}
                placeholder="Write your custom requests or questions here..."
                className="w-full px-4 py-3 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm text-stone-900 placeholder:text-stone-500 bg-white"
              />
              {errors.message && <p className="text-xs text-rose-500 mt-1">{errors.message.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting}
                className="h-12 px-8 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold transition-all active:scale-98 text-sm disabled:opacity-50"
              >
                {submitting ? 'Submitting Message...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
