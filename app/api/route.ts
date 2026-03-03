import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Welcome to EduAI API',
    version: '1.0.0',
    endpoints: {
      courses: '/api/courses',
      users: '/api/users',
      progress: '/api/progress',
      lessonGenerator: '/api/generate-lesson',
      homeworkGenerator: '/api/generate-homework',
      commentGenerator: '/api/generate-comment',
      analysis: '/api/analyze-student',
      activityGenerator: '/api/generate-activity',
    },
  });
}
