import Header from '@/components/Header';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-primary">EduAI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Experience the future of learning with our AI-powered educational platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button variant="primary">Get Started</Button>
              </Link>
              <Button variant="secondary">Learn More</Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card
                title="AI-Powered Learning"
                description="Personalized learning paths powered by advanced AI algorithms"
              >
                <p className="text-gray-600">
                  Get customized content recommendations based on your learning style and progress.
                </p>
              </Card>
              <Card
                title="Interactive Lessons"
                description="Engage with dynamic and interactive educational content"
              >
                <p className="text-gray-600">
                  Learn through hands-on exercises, quizzes, and real-world projects.
                </p>
              </Card>
              <Card
                title="Progress Tracking"
                description="Monitor your learning journey with detailed analytics"
              >
                <p className="text-gray-600">
                  Visualize your progress and identify areas for improvement.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of students already learning on EduAI
            </p>
            <Link href="/dashboard">
              <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Access Dashboard
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 EduAI. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
