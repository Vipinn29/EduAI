"use client";

import { useState, useRef, useEffect } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import SavePDFButton from '@/components/SavePDFButton';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';

import { useSession } from 'next-auth/react';

export default function StudentAnalysis() {
  const { data: session, status } = useSession();
  const isAuthenticated = !!session;
  const [maths, setMaths] = useState('');
  const recRef = useRef<HTMLDivElement | null>(null);
  const [science, setScience] = useState('');
  const [english, setEnglish] = useState('');
  const [loading, setLoading] = useState(false);
  const [weakSubjects, setWeakSubjects] = useState<string[] | null>(null);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (recommendations && recRef.current) {
      recRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [recommendations]);

  const handleSubmit = async () => {
    setLoading(true);
    setWeakSubjects(null);
    setRecommendations(null);
    setError(null);

    try {
      const res = await fetch('/api/analyze-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maths: Number(maths),
          science: Number(science),
          english: Number(english),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze');
      }
      setWeakSubjects(data.weakSubjects || []);
      setRecommendations(data.recommendations || '');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">
        Student Analysis
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maths marks
          </label>
          <input
            type="number"
            value={maths}
            disabled={loading}
            onChange={(e) => {
              let v = Number(e.target.value);
              if (v > 100) v = 100;
              if (v < 0) v = 0;
              setMaths(String(v));
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            placeholder="e.g. 78"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Science marks
          </label>
          <input
            type="number"
            value={science}
            disabled={loading}
            onChange={(e) => {
              let v = Number(e.target.value);
              if (v > 100) v = 100;
              if (v < 0) v = 0;
              setScience(String(v));
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            placeholder="e.g. 65"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            English marks
          </label>
          <input
            type="number"
            value={english}
            disabled={loading}
            onChange={(e) => {
              let v = Number(e.target.value);
              if (v > 100) v = 100;
              if (v < 0) v = 0;
              setEnglish(String(v));
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            placeholder="e.g. 82"
          />
        </div>
      </div>

      <div>
        <Button
          onClick={handleSubmit}
          variant="primary"
          className="w-full md:w-auto"
          disabled={
            loading || maths === '' || science === '' || english === '' || status === 'loading' || !isAuthenticated
          }
        >
          {loading ? 'Analyzing...' : 'Submit'}
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-6">
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {error && (
        <p className="text-red-600">Error: {error}</p>
      )}

      {weakSubjects && (
        <Card className="animate-slide-in-up">
          <h3 className="text-lg font-semibold mb-2">Weak Subjects</h3>
          <p>{weakSubjects.join(', ')}</p>
        </Card>
      )}

      {recommendations && (
        <div ref={recRef}>
          <Card className="whitespace-pre-line animate-slide-in-up">
            <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(recommendations);
                setToast('Copied to clipboard');
              }}
              className="absolute top-6 right-6"
            >
              Copy
            </Button>
            <SavePDFButton 
              content={recommendations || ''}
              metadata={{ maths, science, english }}
              featureType="analysis"
            />
            <p>{recommendations}</p>
          </Card>
        </div>
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}
