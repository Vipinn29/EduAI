"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import Button from '@/components/Button';

interface Lesson {
  id: string;
  title: string;
  preview: string;
  date: string;
}

interface UserLessonsData {
  lessons: Lesson[];
  totalCount: number;
}

export default function LessonsHistory() {
  const [lessonsData, setLessonsData] = useState<UserLessonsData>({ lessons: [], totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session } = useSession();

  const fetchLessons = async () => {
    if (!session) return;
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/user-lessons');
      if (!res.ok) throw new Error('Failed to fetch lessons');
      const data: UserLessonsData = await res.json();
      setLessonsData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [session]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-6">⚠️</div>
        <h3 className="text-xl font-bold mb-4">{error}</h3>
        <Button onClick={fetchLessons}>Retry</Button>
      </div>
    );
  }

  if (lessonsData.lessons.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
          <span className="text-2xl">📚</span>
        </div>
        <h3 className="text-2xl font-bold mb-4">No lessons yet</h3>
        <p className="text-gray-600 mb-8">Your saved lessons will appear here.</p>
        <Link href="/dashboard/lessons" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700">
          Generate Lesson
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Lessons History</h1>
          <p className="text-lg text-gray-600">{lessonsData.totalCount} lessons saved</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-lg transition-all border border-gray-200 hover:border-gray-300"
          >
            ← Back to Dashboard
          </Link>
          <Button onClick={fetchLessons} variant="secondary">
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessonsData.lessons.map((lesson) => (
          <Card key={lesson.id} className="group hover:shadow-xl h-full">
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                  Lesson
                </span>
                <span className="text-sm text-gray-500">{lesson.date}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600">
                {lesson.title}
              </h3>
              <p className="text-gray-600 mb-6 flex-1 line-clamp-3">
                {lesson.preview}
              </p>
              <Link
                href={`/dashboard/lessons/${lesson.id}`}
                className="mt-auto inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
              >
                View Lesson
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
