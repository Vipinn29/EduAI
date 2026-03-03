"use client";

import { useState, useRef, useEffect } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';

const classes = Array.from({ length: 12 }, (_, i) => i + 1);
const performanceLevels = ['Excellent', 'Good', 'Average', 'Needs Improvement'];

export default function CommentGenerator() {
  const [studentName, setStudentName] = useState('');
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [classLevel, setClassLevel] = useState<number | ''>('');
  const [performance, setPerformance] = useState('');
  const [strengths, setStrengths] = useState('');
  const [areas, setAreas] = useState('');
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (comment && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comment]);

  async function handleGenerate() {
    setLoading(true);
    setComment(null);
    try {
      const res = await fetch('/api/generate-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName, classLevel, performance, strengths, areas }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate');
      }
      const data = await res.json();
      setComment(data.comment);
    } catch (e: any) {
      setComment(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string | null) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setToast('Copied to clipboard');
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">
        Report Comment Generator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student Name
          </label>
          <input
            type="text"
            value={studentName}
            disabled={loading}
            onChange={(e) => setStudentName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            placeholder="e.g. Aman Kumar"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Class
          </label>
          <select
            value={classLevel}
            disabled={loading}
            onChange={(e) => setClassLevel(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
          >
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Performance Level
          </label>
          <select
            value={performance}
            disabled={loading}
            onChange={(e) => setPerformance(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
          >
            <option value="">Select level</option>
            {performanceLevels.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Strengths
          </label>
          <textarea
            value={strengths}
            disabled={loading}
            onChange={(e) => setStrengths(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            rows={3}
            placeholder="List student strengths"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Areas to Improve
          </label>
          <textarea
            value={areas}
            disabled={loading}
            onChange={(e) => setAreas(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            rows={3}
            placeholder="Mention areas that need improvement"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleGenerate}
          variant="primary"
          className="w-full md:w-auto"
          disabled={
            loading ||
            !studentName ||
            !classLevel ||
            !performance ||
            !strengths ||
            !areas
          }
        >
          {loading ? 'Generating...' : 'Generate'}
        </Button>
        {comment && (
          <Button
            onClick={handleGenerate}
            variant="secondary"
            className="w-full md:w-auto"
            disabled={loading}
          >
            Regenerate
          </Button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-6">
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {comment && (
        <div ref={resultRef}>
          <Card className="whitespace-pre-line relative animate-slide-in-up">
            <h3 className="text-lg font-semibold mb-2">Report Comment</h3>
            <Button
              variant="secondary"
              onClick={() => copyToClipboard(comment)}
              className="absolute top-6 right-6"
            >
              Copy
            </Button>
            <p className="text-gray-700">{comment}</p>
          </Card>
        </div>
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}
