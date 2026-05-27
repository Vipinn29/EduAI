import { NextResponse, NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getToken } from "next-auth/jwt";
import { authConfig } from "@/lib/auth";
import { getOpenAIClient, DEFAULT_MODEL, TEACHER_SYSTEM_MESSAGE } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { classLevel, subject, chapter, duration } = body;

    // basic validation: require all fields and ensure duration is a positive number
    if (!classLevel || !subject || !chapter || duration == null) {
      return NextResponse.json({ error: 'Missing parameters; please include classLevel, subject, chapter and duration' }, { status: 400 });
    }

    // accept duration as a number or string like "15", "15 min", "15mins" etc.
    if (typeof duration === 'string') {
      // extract leading number
      const parsed = parseInt(duration, 10);
      duration = isNaN(parsed) ? null : parsed;
    }

    if (typeof duration !== 'number' || duration <= 0) {
      return NextResponse.json({ error: 'Duration must be a positive number (minutes). You may pass a string like "15" or "15 min".' }, { status: 400 });
    }

    // The user prompt which will be presented to the AI model.  We keep
    // the actual classroom instructions separate so that we can insert a
    // clear system message describing the teacher persona below.
    const userPrompt = `Create a detailed lesson plan for class ${classLevel}, subject ${subject}, chapter ${chapter}. Duration: ${duration} minutes.`;

    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: `${TEACHER_SYSTEM_MESSAGE}\n\nFor lesson plans, structure your output with headings:\n- Learning Objectives\n- Introduction\n- Explanation\n- Activity\n- Homework`,
        },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1000,
    });

    const output = response.choices[0]?.message?.content || '';

    // Validate generated content
    if (output.length > 10000) {
      console.error('Generated content too long:', output.length);
      return NextResponse.json({ error: 'Generated lesson too long (max 10k chars)' }, { status: 413 });
    }
    if (!output.trim()) {
      console.error('Generated empty lesson');
      return NextResponse.json({ error: 'Generated empty lesson' }, { status: 500 });
    }

    let saved = false;
    let savedLesson = null;
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    console.log('Token:', token ? { id: token.id, sub: token.sub, email: token.email } : 'null');
    const userId = token?.id as string || token?.sub as string;
    if (userId) {
      try {
        const title = `Class ${classLevel} ${subject} - ${chapter}`;
        const metadata = {
          title,
          classLevel,
          subject,
          chapter,
          duration,
        };
        savedLesson = await prisma.lesson.create({
          data: {
            content: output,
            metadata,
            userId,
          },
        });
        await prisma.user.update({
          where: { id: userId },
          data: { lessonCount: { increment: 1 } },
        });
        saved = true;
        console.log('Lesson saved for user:', userId, savedLesson.id);
      } catch (saveErr: any) {
        console.error('Prisma save failed for user', userId, {
          message: saveErr.message,
          code: saveErr.code,
          meta: saveErr.meta,
        });
      }
    }

    // Always increment global lessons counter
    const globalCounter = await prisma.globalCounter.upsert({
      where: { id: "global_lessons" },
      update: {
        count: {
          increment: 1
        }
      },
      create: {
        id: "global_lessons",
        count: 1
      },
    });

    return NextResponse.json({
      lesson: output,
      globalLessons: globalCounter.count,
      saved,
      savedLesson
    });
  } catch (err: any) {
    // log full error for debugging; some fetch failures come with little
    // message text, so we also include `err.name` and stack if available.
    console.error('generate-lesson error', {
      message: err.message,
      name: err.name,
      stack: err.stack,
      original: err,
    });

    // propagate a user-friendly message but keep the original for logs
    return NextResponse.json(
      { error: err.message || 'Internal error' },
      { status: 500 },
    );
  }
}
