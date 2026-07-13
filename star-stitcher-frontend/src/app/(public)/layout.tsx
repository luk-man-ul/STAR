'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';
import { useSettingsStore } from '@/store/use-settings-store';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Design Gallery', href: '/designs' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const shopName = settings?.shopName || 'STAR STITCHER';
  const phone = settings?.phone || '+91 7306417315';
  const whatsapp = settings?.whatsapp || '+91 7306417315';
  const email = settings?.email || 'starstitcherladiescentre@gmail.com';
  const address = settings?.address || 'KRP Rao Road, Kasaragod, Kerala';

  return (
    <div className="flex flex-col min-h-screen bg-stone-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={shopName} className="h-8 w-auto object-contain" />
              ) : (
                <span className="text-xl font-bold tracking-wider text-rose-600 font-serif">
                  {shopName}
                </span>
              )}
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors hover:text-rose-600 ${
                      isActive ? 'text-rose-600' : 'text-stone-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <Link
                  href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-sm font-semibold transition-all active:scale-95 shadow-sm"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-sm font-semibold transition-all active:scale-95 shadow-sm"
                >
                  Book / Log In
                </Link>
              )}
            </div>

            {/* Mobile Hamburguer Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-rose-600 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-rose-50 text-rose-600' : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-stone-100">
              {user ? (
                <Link
                  href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-sm font-semibold"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-sm font-semibold"
                >
                  Book / Log In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            {settings?.logoUrl ? (
              <img src={settings.logoUrl} alt={shopName} className="h-8 w-auto object-contain" />
            ) : (
              <span className="text-xl font-bold tracking-wider text-white font-serif">
                {shopName}
              </span>
            )}
            <p className="text-sm text-stone-400 leading-relaxed">
              Premium ladies custom tailoring boutique in Kasaragod. Perfect fits, designer stitching, and order tracking.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-rose-400 transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Boutique Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Operating Hours</h4>
            <p className="text-sm leading-relaxed text-stone-300">
              Monday - Saturday: 10:00 AM - 6:30 PM<br />
              Sunday: Closed
            </p>
            <p className="text-sm text-stone-300">
              Email: {email}<br />
              Tel: {phone}
            </p>
          </div>

          {/* Column 4: WhatsApp Connection */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Store Location</h4>
            <p className="text-sm leading-relaxed text-stone-300">
              {address}
            </p>
            <div>
              <a
                href={`https://wa.me/${whatsapp.replace(/\+/g, '').replace(/\s/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold transition-colors"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-stone-800 text-center text-xs text-stone-500">
          &copy; {new Date().getFullYear()} {shopName}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
