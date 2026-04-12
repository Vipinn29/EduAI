"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function TopNav({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  if (status === 'loading') {
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
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </header>
    );
  }

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
              <Link href="/dashboard/settings" className="px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition">Settings</Link>
            </div>

            <div className="relative">
              {session ? (
                <>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 bg-white border border-gray-100 px-3 py-1 rounded-full hover:shadow-sm transition-all"
                  >
                    <Image 
                      src={session.user?.image || "/avatar-placeholder.svg"} 
                      alt="avatar" 
                      width={32} 
                      height={32} 
                      className="rounded-full object-cover" 
                    />
                    <span className="text-sm text-gray-700 max-w-28 truncate">
                      {session.user?.name || session.user?.email || 'User'}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={dropdownOpen ? 'rotate-180' : ''}>
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-md shadow-lg z-50 py-1">
                      <Link 
                        href="/dashboard/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: '/' });
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
