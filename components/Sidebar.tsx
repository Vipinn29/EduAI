import Link from 'next/link';

const navItems = [
  { id: 'lessons', label: 'Lesson Generator', href: '/dashboard/lessons' },
  { id: 'homework', label: 'Homework Generator', href: '/dashboard/homework' },
  { id: 'comments', label: 'Report Comments', href: '/dashboard/comments' },
  { id: 'analysis', label: 'Student Analysis', href: '/dashboard/analysis' },
];

export default function Sidebar({
  className = '',
  mobile = false,
  onClose,
}: {
  className?: string;
  mobile?: boolean;
  onClose?: () => void;
}) {
  const base = mobile
    ? 'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 px-4 py-6 md:hidden'
    : 'w-64 bg-white border-r border-gray-100 min-h-screen px-4 py-6 hidden md:block';

  return (
    <aside className={`${base} ${className}`} aria-label="Sidebar">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Teacher AI</h2>
          <p className="text-sm text-gray-500">Assistant Dashboard</p>
        </div>
        {mobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            aria-label="Close sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link key={item.id} href={item.href} legacyBehavior>
            <a className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
              <span className="w-5 h-5 flex-none text-gray-400" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                </svg>
              </span>
              <span className="truncate">{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500">
        <p className="mb-1">Tip</p>
        <p className="text-xs">Use the generators to save time writing lesson plans and feedback.</p>
      </div>
    </aside>
  );
}
