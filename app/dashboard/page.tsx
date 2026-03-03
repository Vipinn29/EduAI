'use client';

import Link from 'next/link';
import Card from '@/components/Card';

export default function Dashboard() {
  const features = [
    {
      id: 'lessons',
      title: 'Lesson Generator',
      description: 'Create structured lessons with learning objectives, explanations, activities, and homework.',
      href: '/dashboard/lessons',
      icon: '📚',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'homework',
      title: 'Homework Generator',
      description: 'Generate customized homework worksheets with difficulty levels and answers.',
      href: '/dashboard/homework',
      icon: '✏️',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'activities',
      title: 'Activity Generator',
      description: 'Design quick interactive classroom activities (under 10 minutes) to boost engagement.',
      href: '/dashboard/activities',
      icon: '🎮',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'comments',
      title: 'Report Comments',
      description: 'Generate professional and personalized report card comments quickly.',
      href: '/dashboard/comments',
      icon: '📝',
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'analysis',
      title: 'Student Analysis',
      description: 'Analyze student marks and get AI-powered recommendations for improvement.',
      href: '/dashboard/analysis',
      icon: '📊',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">Teacher Dashboard</h1>
        <p className="text-lg text-gray-600">AI-powered tools to enhance your teaching experience</p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {features.map((feature) => (
          <Link key={feature.id} href={feature.href} className="group">
            <div className="h-full transition-all duration-300 ease-out hover:scale-105">
              <Card className={`h-full bg-gradient-to-br ${feature.color} p-0 overflow-hidden hover:shadow-xl`}>
                <div className="relative h-full flex flex-col p-6 text-white">
                  {/* Icon */}
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm opacity-90 leading-relaxed mb-4">{feature.description}</p>

                  {/* Arrow indicator */}
                  <div className="mt-auto flex items-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Get Started
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* Hover background accent */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white pointer-events-none transition-opacity duration-300" />
                </div>
              </Card>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-12">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Quick Tip</h3>
        <p className="text-blue-800">
          Click on any tool above to start creating. All generators follow CBSE and NEP 2020 guidelines with simple, child-friendly language.
        </p>
      </div>
    </div>
  );
}
