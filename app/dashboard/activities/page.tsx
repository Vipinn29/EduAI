"use client";

import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import SavePDFButton from '@/components/SavePDFButton';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';

const classes = Array.from({ length: 12 }, (_, i) => i + 1);

export default function ActivityGenerator() {
  const [classLevel, setClassLevel] = useState<number | ''>('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setActivity(null);
    try {
      const res = await fetch('/api/generate-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classLevel, subject, topic }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate');
      }
      const data = await res.json();
      setActivity(data.activity);
    } catch (e: any) {
      setActivity(`Error: ${e.message}`);
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
      <h2 className="text-2xl font-semibold text-gray-900">Classroom Activity Generator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select
            value={classLevel}
            disabled={loading}
            onChange={(e) => setClassLevel(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
          >
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            disabled={loading}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            placeholder="e.g. Maths"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
          <input
            type="text"
            value={topic}
            disabled={loading}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            placeholder="e.g. Addition"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleGenerate}
          variant="primary"
          className="w-full md:w-auto"
          disabled={loading || !classLevel || !subject || !topic}
        >
          {loading ? 'Generating...' : 'Generate Activity'}
        </Button>
        {activity && (
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

      {activity && (
        <Card className="group relative whitespace-pre-line animate-slide-in-up">
          <h3 className="text-lg font-semibold mb-2">Activity</h3>
          <Button variant="secondary" size="sm" onClick={() => copyToClipboard(activity)} className="absolute top-6 right-6 opacity-0 group-hover:opacity-100">Copy</Button>
          <SavePDFButton 
            content={activity || ''}
            metadata={{ classLevel, subject, topic }}
            featureType="activity"
          />
          <p className="text-gray-700">{activity}</p>
        </Card>
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}
