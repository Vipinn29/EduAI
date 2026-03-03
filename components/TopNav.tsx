import { useState } from 'react';
import Image from 'next/image';

export default function TopNav({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSidebar}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-gray-800">Dashboard</h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <button className="px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition">Settings</button>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 bg-white border border-gray-100 px-3 py-1 rounded-full hover:shadow-sm transition"
              >
                <Image src="/avatar-placeholder.svg" alt="avatar" width={32} height={32} className="rounded-full object-cover" />
                <span className="text-sm text-gray-700">Ms. Taylor</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-sm py-1">
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" href="#">Profile</a>
                  <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" href="#">Logout</a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
