import React from 'react';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile-first customer header placeholder */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-xl font-bold text-rose-600">Star Stitcher</span>
          <nav className="flex items-center gap-4 text-sm font-medium">
            {/* Header Navigation Placeholders */}
          </nav>
        </div>
      </header>
      
      <main className="flex-1 bg-stone-50 pb-20 md:pb-6">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav placeholder */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white/95 py-2 md:hidden">
        <div className="flex justify-around items-center text-xs font-medium text-stone-600">
          <button className="flex flex-col items-center">
            <span>🏠</span>
            <span>Home</span>
          </button>
          <button className="flex flex-col items-center">
            <span>👗</span>
            <span>Orders</span>
          </button>
          <button className="flex flex-col items-center">
            <span>📅</span>
            <span>Book</span>
          </button>
          <button className="flex flex-col items-center">
            <span>👤</span>
            <span>Profile</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
