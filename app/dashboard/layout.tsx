"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-all duration-300" onClick={() => setMobileOpen(false)} />
            <Sidebar mobile onClose={() => setMobileOpen(false)} />
          </div>
        )}

        <div className="flex-1 min-h-screen flex flex-col">
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
