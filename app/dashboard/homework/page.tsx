"use client";

import { useState, useRef, useEffect } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';

const classes = Array.from({ length: 12 }, (_, i) => i + 1);
const difficulties = ['Easy', 'Medium', 'Hard'];

export default function HomeworkGenerator() {
  const [classLevel, setClassLevel] = useState<number | ''>('');
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [loading, setLoading] = useState(false);
  const [worksheet, setWorksheet] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null); // raw
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if ((worksheet || answers || result) && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [worksheet, answers, result]);

  async function handleGenerate() {
    setLoading(true);
    setWorksheet(null);
    setAnswers(null);
    setResult(null);
    try {
      const res = await fetch('/api/generate-homework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classLevel, subject, topic, difficulty }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate');
      }
      const data = await res.json();
      const text = data.homework || '';
      setResult(text);
      // try split into worksheet / answers
      const split = text.split(/Answers?[:\n]/i);
      if (split.length >= 2) {
        setWorksheet(split[0].trim());
        setAnswers(split.slice(1).join('Answers:').trim());
      }
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
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
        Homework Generator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            Subject
          </label>
          <input
            type="text"
            value={subject}
            disabled={loading}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            placeholder="e.g. Mathematics"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Topic
          </label>
          <input
            type="text"
            value={topic}
            disabled={loading}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
            placeholder="e.g. Addition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            value={difficulty}
            disabled={loading}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary"
          >
            <option value="">Select difficulty</option>
            {difficulties.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={handleGenerate}
          variant="primary"
          className="w-full md:w-auto"
          disabled={
            loading || !classLevel || !subject || !topic || !difficulty
          }
        >
          {loading ? 'Generating...' : 'Generate'}
        </Button>
        {result && (
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
          <Skeleton className="h-40 w-full" />
        </div>
      )}

      {worksheet && (
        <div ref={resultRef}>
          <Card className="whitespace-pre-line relative animate-slide-in-up">
            <h3 className="text-lg font-semibold mb-2">Worksheet</h3>
            <Button
              variant="secondary"
              onClick={() => copyToClipboard(worksheet)}
              className="absolute top-6 right-6"
            >
              Copy
            </Button>
            <p className="text-gray-700">{worksheet}</p>
          </Card>
        </div>
      )}

      {answers && (
        <div ref={resultRef}>
          <Card className="whitespace-pre-line relative animate-slide-in-up">
            <h3 className="text-lg font-semibold mb-2">Answers</h3>
            <Button
              variant="secondary"
              onClick={() => copyToClipboard(answers)}
              className="absolute top-6 right-6"
            >
              Copy
            </Button>
            <p className="text-gray-700">{answers}</p>
          </Card>
        </div>
      )}

      {!worksheet && result && (
        <div ref={resultRef}>
          <Card className="whitespace-pre-line animate-slide-in-up">
            <h3 className="text-lg font-semibold mb-2">Your Worksheet</h3>
            <p className="text-gray-700">{result}</p>
          </Card>
        </div>
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}
