import Link from 'next/link';

const navItems = [
  { id: 'lessons', label: 'Lesson Generator', href: '/dashboard/lessons' },
  { id: 'homework', label: 'Homework Generator', href: '/dashboard/homework' },
  { id: 'activities', label: 'Activity Generator', href: '/dashboard/activities' },
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
    ? 'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 px-6 py-6 md:hidden transition-all duration-300'
    : 'w-64 bg-white border-r border-gray-200 min-h-screen px-6 py-6 hidden md:block transition-all duration-300 ease-out';

  return (
    <aside className={`${base} ${className}`} aria-label="Sidebar">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">EduAI</h2>
          <p className="text-xs text-gray-500 mt-1">Teacher Assistant</p>
        </div>
        {mobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors duration-300"
            aria-label="Close sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link key={item.id} href={item.href} legacyBehavior>
            <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 ease-out group">
              <span className="text-lg" aria-hidden>
                {item.label.split(' ')[0] === 'Lesson' && '📚'}
                {item.label.split(' ')[0] === 'Homework' && '✏️'}
                {item.label.split(' ')[0] === 'Activity' && '🎮'}
                {item.label.split(' ')[0] === 'Report' && '📝'}
                {item.label.split(' ')[0] === 'Student' && '📊'}
              </span>
              <span className="truncate font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-200 text-sm text-gray-600">
        <p className="font-semibold mb-2">💡 Tip</p>
        <p className="text-xs leading-relaxed opacity-75">All tools follow CBSE & NEP 2020 guidelines with simple language.</p>
      </div>
    </aside>
  );
}
