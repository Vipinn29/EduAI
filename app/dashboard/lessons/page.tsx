"use client";

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';

const classes = Array.from({ length: 12 }, (_, i) => i + 1);
const durations = ['15 min', '30 min', '45 min', '60 min'];

export default function LessonGenerator() {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;
  const [classLevel, setClassLevel] = useState<number | ''>('');
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classLevel, subject, chapter, duration }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate');
      }
      const data = await res.json();
      setResult(data.lesson);
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast('Copied!');
      setTimeout(() => setToast(null), 2000);
    } catch {
      setToast('Copy failed');
    }
  };

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  if (status === 'loading') return <div>Loading...</div>;
  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Login to generate and save lessons</h3>
        <Link href="/auth/login">
          <Button variant="primary" className="text-lg">Login to Get Started</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">Lesson Generator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
          <select
            value={classLevel}
            disabled={loading}
            onChange={(e) => setClassLevel(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            value={subject}
            disabled={loading}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mathematics"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
          <input
            type="text"
            value={chapter}
            disabled={loading}
            onChange={(e) => setChapter(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Linear Equations"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <select
            value={duration}
            disabled={loading}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select duration</option>
            {durations.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        variant="primary"
        size="lg"
        disabled={loading || !classLevel || !subject || !chapter || !duration}
        className="w-full max-w-md mx-auto block"
      >
        {loading ? 'Generating Lesson Plan...' : 'Generate Complete Lesson'}
      </Button>

      {loading && (
        <div className="flex justify-center py-12">
          <Skeleton className="h-96 w-full max-w-4xl" />
        </div>
      )}

      {result && (
        <div ref={resultRef} className="space-y-4">
          <Card className="relative p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Your Generated Lesson Plan</h3>
              <Button
                variant="secondary"
                onClick={() => copyToClipboard(result)}
              >
                📋 Copy Full Plan
              </Button>
            </div>
            <Button
              variant="primary"
              className="w-full mb-6"
              onClick={async () => {
                try {
                  await fetch('/api/save-lesson', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      content: result, 
                      classLevel, subject, chapter, duration 
                    }),
                  });
                  setToast('✅ Lesson saved to your history!');
                } catch (err) {
                  setToast('Save failed');
                }
              }}
            >
              💾 Save to My Lessons History
            </Button>
            <div className="prose prose-lg max-w-none bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border">
              <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed font-sans">
                {result}
              </pre>
            </div>
          </Card>
        </div>
      )}

      {toast && (
        <Toast message={toast} />
      )}
    </div>
  );
}

