import Header from '@/components/Header';
import Button from '@/components/Button';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="animate-slide-in-up">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Powered <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Teaching Assistant</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Create lessons, homework, activities, and student feedback in minutes using AI powered by CBSE and NEP 2020 guidelines.
            </p>
            <Link href="/dashboard">
              <Button variant="primary" className="px-8 py-3 text-lg">
                Enter Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Preview */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">5 Essential Tools for Teachers</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { emoji: '📚', name: 'Lessons' },
              { emoji: '✏️', name: 'Homework' },
              { emoji: '🎮', name: 'Activities' },
              { emoji: '📝', name: 'Comments' },
              { emoji: '📊', name: 'Analysis' },
            ].map((tool) => (
              <div key={tool.name} className="text-center p-4">
                <div className="text-5xl mb-3">{tool.emoji}</div>
                <p className="font-semibold text-gray-800">{tool.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 mt-12">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to save time grading and planning?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join teachers already using EduAI to enhance their classroom experience.
            </p>
            <Link href="/dashboard">
              <Button variant="secondary" className="px-8 py-3 text-lg">
                Start Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <p>&copy; 2026 EduAI. Empowering teachers with AI.</p>
      </footer>
    </>
  );
}
