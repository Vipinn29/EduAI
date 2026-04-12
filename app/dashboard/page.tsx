"use client";

import Link from 'next/link';
import Card from '@/components/Card';
import Skeleton from '@/components/Skeleton';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback, useRef } from 'react';

interface UserLessonsData {
  lessons: Lesson[];
  totalCount: number;
}

interface Lesson {
  id: string;
  title: string;
  preview: string;
  date: string;
}

interface GlobalStats {
  totalLessons: number;
}

export default function Dashboard() {
  const [globalStats, setGlobalStats] = useState<GlobalStats>({ totalLessons: 0 });
  const [lessonsData, setLessonsData] = useState<UserLessonsData>({ lessons: [], totalCount: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState('');

  const { data: session, status } = useSession();

  const isLoggedIn = !!session;

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        setLoadingStats(true);
        setError('');
        const res = await fetch('/api/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setGlobalStats({ totalLessons: data.totalLessons || 0 });
      } catch (err: any) {
        setError(err.message || 'Failed to load stats');
      } finally {
        setLoadingStats(false);
      }
    };

    fetchGlobalStats();
  }, []);

  const fetchLessons = useCallback(async () => {
    if (status === 'loading' || !session) return;
    try {
      setLoadingLessons(true);
      setError('');
      const res = await fetch('/api/user-lessons');
      if (!res.ok) throw new Error('Failed to fetch lessons');
      const data: UserLessonsData = await res.json();
      setLessonsData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load your lessons');
    } finally {
      setLoadingLessons(false);
    }
  }, [status, session]);

  useEffect(() => {
    fetchLessons();
  }, [status, session, refreshTrigger, fetchLessons]);

  // Polling for new lessons every 30s when logged in
  // const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   if (isLoggedIn && fetchLessons) {
  //     pollIntervalRef.current = setInterval(fetchLessons, 30000);
  //   }
  //   return () => {
  //     if (pollIntervalRef.current) {
  //       clearInterval(pollIntervalRef.current);
  //     }
  //   };
  // }, [isLoggedIn, fetchLessons]);

  if (status === "loading") {
    return (
      <div className="space-y-12 p-8 min-h-screen">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="max-w-sm mx-auto mb-12">
          <Skeleton className="h-64 w-80 mx-auto rounded-2xl p-8" />
        </div>
      </div>
    );
  }

  const notLoggedIn = !isLoggedIn;

  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header - Always shown */}
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
          Teacher Dashboard
        </h1>
        {/* <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Platform lessons generated: <span className="font-bold text-2xl text-blue-600">{globalStats.totalLessons.toLocaleString()}</span>
        </p> */}
      </div>

      {/* Global Stats Card - Always shown */}
      {/* <div className="max-w-sm mx-auto mb-12">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border-0">
          <div className="p-8 text-center">
            <div className="text-6xl mb-6">📊</div>
            <h2 className="text-3xl font-bold mb-2">Global Lessons</h2>
            <div className="text-5xl font-black mb-4">{globalStats.totalLessons.toLocaleString()}</div>
            <p className="text-lg opacity-90">Total generated on platform</p>
          </div>
        </Card>
      </div> */}

      {/* Not logged in section */}
      {notLoggedIn && (
        <section className="text-center py-20 bg-white rounded-2xl shadow-lg border max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to EduAI Dashboard</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Explore all tools below. <span className="font-semibold text-emerald-600">Login anytime</span> to save your lessons and view personal history.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Go to Login
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </section>
      )}

      {/* Logged in user section */}
      {isLoggedIn && (
        <>
          {/* User Stats Card */}
          {/* <div className="max-w-sm mx-auto mb-12">
            <Card className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border-0">
              <div className="p-8 text-center">
                <div className="text-6xl mb-6">📚</div>
                <h2 className="text-3xl font-bold mb-2">You generated</h2>
                <div className="text-5xl font-black mb-4">{lessonsData.totalCount}</div>
                <p className="text-lg opacity-90">You generated {lessonsData.totalCount} lessons</p>
              </div>
            </Card>
          </div> */}

          {/* User Lesson History */}
          <section>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Lessons</h2>
                <p className="text-lg text-gray-600">Your generated lessons history</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/dashboard/lessons" className="text-emerald-600 hover:text-emerald-700 font-semibold text-lg transition-colors">
                  Create New +
                </Link>
                <button
                  onClick={() => setRefreshTrigger(prev => prev + 1)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm flex items-center gap-1"
                  title="Refresh lessons list"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {loadingLessons ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{error}</h3>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
                >
                  Retry
                </button>
              </div>
            ) : lessonsData.lessons.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg border p-12">
                <div className="w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📚</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No lessons yet</h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  Generate your first lesson using the tools below.
                </p>
                <Link href="/dashboard/lessons" className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                  Create Lesson
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {lessonsData.lessons.map((lesson) => (
                  <Card key={lesson.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border-gray-200 overflow-hidden">
                    <div className="p-6 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                          Lesson
                        </span>
                        <span className="text-sm text-gray-500">{lesson.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-gray-600 mb-6 flex-1 line-clamp-3 leading-relaxed">
                        {lesson.preview}
                      </p>
                      <div className="mt-auto border-t pt-4">
                        <Link
                          href={`/dashboard/lessons/${lesson.id}`}
                          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold text-sm transition-colors"
                        >
                          View Lesson
                          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* Features Grid - Always shown */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Quick Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {[
            { id: 'lessons', title: 'Lesson Generator', description: 'Create structured lessons with objectives and activities.', href: '/dashboard/lessons', icon: '📚', color: 'from-blue-500 to-blue-600' },
            { id: 'homework', title: 'Homework', description: 'Custom worksheets with answers.', href: '/dashboard/homework', icon: '✏️', color: 'from-purple-500 to-purple-600' },
            { id: 'activities', title: 'Activities', description: 'Quick classroom engagement (10 min).', href: '/dashboard/activities', icon: '🎮', color: 'from-green-500 to-green-600' },
            { id: 'comments', title: 'Report Comments', description: 'Professional report card comments.', href: '/dashboard/comments', icon: '📝', color: 'from-orange-500 to-orange-600' },
            { id: 'analysis', title: 'Student Analysis', description: 'AI-powered student improvement recommendations.', href: '/dashboard/analysis', icon: '📊', color: 'from-pink-500 to-pink-600' },
          ].map((feature) => (
            <Link key={feature.id} href={feature.href} className="group">
              <Card className={`h-full bg-gradient-to-br ${feature.color} text-white p-0 overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]`}>
                <div className="relative h-full flex flex-col p-8">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">{feature.icon}</div>
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-white/90 text-lg mb-8 flex-1">{feature.description}</p>
                  <div className="flex items-center font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300">
                    Explore
                    <svg className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

