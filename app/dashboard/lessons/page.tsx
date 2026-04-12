"use client";

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';
import SavePDFButton from '@/components/SavePDFButton';
import { useAuthCheck } from '@/lib/hooks/useAuth';

const classes = Array.from({ length: 12 }, (_, i) => i + 1);
const durations = ['15 min', '30 min', '45 min', '60 min'];

export default function LessonGenerator() {
  const { requireAuth } = useAuthCheck();
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
      if (!res.ok) throw new Error('Failed to generate');
      const data = await res.json();
      setResult(data.lesson);
      if (data.saved) {
        setToast('✅ Lesson saved to your dashboard!');
        // Optional: refresh dashboard lessons list
        window.dispatchEvent(new CustomEvent('lessonsRefresh'));
      } else {
        setToast('⚠️ Lesson generated but not saved (login required)');
      }
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
      setToast('Generation failed');
    } finally {
      setLoading(false);
    }
  }

  // Legacy handleSave removed - SavePDFButton handles everything

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast('Copied!');
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    if (result && resultRef.current) resultRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [result]);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        AI Lesson Generator
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8 bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl shadow-2xl">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Class</label>
          <select
            value={classLevel}
            onChange={(e) => setClassLevel(Number(e.target.value))}
            disabled={loading}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
          >
            <option value="">Select class...</option>
            {classes.map((c) => <option key={c} value={c}>Class {c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={loading}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
            placeholder="Mathematics, Science, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Chapter/Topic</label>
          <input
            type="text"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            disabled={loading}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
            placeholder="Linear Equations in Two Variables"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            disabled={loading}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
          >
            <option value="">Select duration...</option>
            {durations.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        variant="primary"
        size="lg"
        disabled={loading || !classLevel || !subject || !chapter || !duration}
        className="w-full max-w-2xl mx-auto block shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating Lesson Plan...
          </>
        ) : (
          'Generate Complete Lesson Plan'
        )}
      </Button>

      {loading && (
        <Card className="animate-pulse">
          <Skeleton className="h-96 w-full" />
        </Card>
      )}

      {result && (
        <div ref={resultRef}>
          <Card className="group relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all">
            <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <Button variant="secondary" size="sm" onClick={() => copyToClipboard(result)}>
                Copy
              </Button>
              <SavePDFButton 
                content={result || ''}
                metadata={{ classLevel, subject, chapter, duration }}
                featureType="lesson"
              />
            </div>
            
            <div className="p-8 prose prose-headings:text-gray-900 prose-p:text-gray-700 max-w-none">
              <pre className="whitespace-pre-wrap bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-dashed border-green-200">
                {result}
              </pre>
            </div>
          </Card>
        </div>
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}

