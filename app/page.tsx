"use client";

import Button from '@/components/Button';
import Link from 'next/link';
import Card from '@/components/Card';
import { useState, useEffect } from 'react';

export default function Home() {
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/stats', {
  credentials: 'include',
});
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setTotalLessons(data.totalLessons || 0);
      } catch {
        setTotalLessons(0);
      } finally {
        setLoading(false);
      }
    };
    fetchTotal();
  }, []);

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">
        <section className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="animate-slide-in-up">
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              AI-Powered <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Teaching Assistant</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Create lessons, homework, activities, and student feedback in minutes using AI powered by CBSE and NEP 2020 guidelines.
            </p>
             <div className="flex justify-center gap-4 flex-wrap">
      <Link href="/dashboard">
        <Button className="px-8 py-3 text-lg shadow-lg hover:scale-105 transition">
          Get Started →
        </Button>
      </Link>

      <Link href="/dashboard">
        <Button variant="secondary" className="px-8 py-3 text-lg">
          Explore Tools
        </Button>
      </Link>
    </div>
          </div>
        </section>

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 mt-12">
  <div className="max-w-6xl mx-auto">

    {/* Heading */}
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-white mb-2">
        Built for Modern Educators
      </h2>
      <p className="text-blue-100 text-lg">
        AI-powered tools trusted by teachers across India
      </p>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

      {/* Lessons */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:scale-105 transition">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-3xl font-bold text-white">{loading ? "..." : `${totalLessons}+`}</p>
        <p className="text-blue-100 mt-1">Lessons Generated</p>
      </div>

      {/* Speed */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:scale-105 transition">
        <div className="text-4xl mb-2">⚡</div>
        <p className="text-3xl font-bold text-white">&lt; 5 sec</p>
        <p className="text-blue-100 mt-1">Response Time</p>
      </div>

      {/* Trust */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg hover:scale-105 transition">
        <div className="text-4xl mb-2">🎓</div>
        <p className="text-3xl font-bold text-white">100+</p>
        <p className="text-blue-100 mt-1">Teachers Trust EduAI</p>
      </div>

    </div>

    {/* Bottom trust line */}
    <div className="text-center mt-10">
      <p className="text-blue-100 text-sm">
        Designed for Indian classrooms • CBSE • State Boards • Smart Teaching
      </p>
    </div>

  </div>
</div>

        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything a Teacher Needs</h2>
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

        {/* SOCIAL PROOF */}
  <section className="max-w-4xl mx-auto px-6 py-8 text-center">
    <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Loved by Teachers</h2>
    <p className="text-black-600 text-lg">
      “EduAI saved me hours every week. Lesson planning is now effortless.”
    </p>
    <p className="mt-4 text-sm text-black-500">— School Teacher, India</p>
  </section>

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

      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <p>&copy; 2026 EduAI. All rights reserved.</p>
        <p className="text-sm opacity-80 mt-2">Made with ❤️ by Vipin Gupta</p>
      </footer>
    </>
  );
}

