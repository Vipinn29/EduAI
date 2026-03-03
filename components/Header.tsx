import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            EduAI
          </Link>
          <div className="flex gap-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
