import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import SavePDFButton from '@/components/SavePDFButton';
import PrintButton from '@/components/PrintButton';

interface LessonPageProps {
  params: { id: string };
}

async function getLesson(id: string, userId: string) {
  const lesson = await prisma.lesson.findFirst({
    where: {
      id,
      userId,
    },
  });
  return lesson;
}

interface LessonMetadata {
  title?: string;
  classLevel: number;
  subject: string;
  chapter: string;
  duration: number;
}

interface Lesson {
  id: string;
  content: string;
  metadata: LessonMetadata;
  createdAt: string;
}

export default async function LessonPage({ params }: LessonPageProps) {
  // Get cookie header for NextAuth token (in cookie header, not authorization)
  const cookieHeader = headers().get('cookie') || '';
  if (!cookieHeader) {
    notFound();
  }

  // Decode simple token or use existing API pattern (user-lessons works)
  // For simplicity, fetch session via API (already working per logs)
  const sessionRes = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/session`, {
    headers: {
      cookie: cookieHeader
    }
  });
  const session = await sessionRes.json();
  
  if (!session?.user?.id) {
    notFound();
  }
  
  const userId = session.user.id;
  const lesson = await getLesson(params.id, userId);
  
  if (!lesson) {
    notFound();
  }

  let metadata: LessonMetadata;
  try {
    metadata = typeof lesson.metadata === 'string' 
      ? JSON.parse(lesson.metadata) 
      : lesson.metadata;
  } catch {
    metadata = { classLevel: 0, subject: 'Unknown', chapter: 'Unknown', duration: 0 };
  }

  const title = metadata.title || 'Untitled Lesson';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div id="pdf-content" className="printable-content max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <a href="/dashboard" className="pdf-ignore inline-flex items-center mb-8 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
          ← Back to Dashboard
        </a>

        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
            <div className="flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent mb-4">
                {title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <span>📚 Class {metadata.classLevel}</span>
                <span>📖 {metadata.subject}</span>
                <span>📂 {metadata.chapter}</span>
                <span>⏱️ {metadata.duration} min</span>
                <span>📅 {new Date(lesson.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
            </div>
        <div className="flex gap-3 mt-4 lg:mt-0">
          <SavePDFButton 
            className="pdf-ignore"
            content={lesson.content}
            metadata={metadata}
            featureType="lesson"
          />
          <PrintButton className="no-print pdf-ignore" />
        </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="p-8 prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-a:text-emerald-600 leading-relaxed">
            <div className="whitespace-pre-wrap">
              {lesson.content}
            </div>
          </div>
        </div>

        {/* Print styles in globals.css */}
      </div>
    </div>
  );
}
