import { NextResponse } from 'next/server';
import { getOpenAIClient, DEFAULT_MODEL, TEACHER_SYSTEM_MESSAGE } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { studentName, classLevel, performance, strengths, areas } = body;

    if (!studentName || !classLevel || !performance || !strengths || !areas) {
      return NextResponse.json({
        error: 'Missing parameters; please include studentName, classLevel, performance, strengths and areas',
      }, { status: 400 });
    }

    const userPrompt = `Write a professional 3-4 line report comment for student ${studentName} from class ${classLevel}. Performance level: ${performance}. Strengths: ${strengths}. Areas to improve: ${areas}.`;

    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: `${TEACHER_SYSTEM_MESSAGE}\n\nYou are a professional school teacher writing report card remarks.

Write:
- Positive and constructive comment
- Professional tone
- 3–4 lines
- Encouraging but honest`,
        },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 300,
    });

    const output = response.choices[0]?.message?.content || '';

    return NextResponse.json({ comment: output });
  } catch (err: any) {
    console.error('generate-comment error', {
      message: err.message,
      name: err.name,
      stack: err.stack,
      original: err,
    });
    return NextResponse.json(
      { error: err.message || 'Internal error' },
      { status: 500 },
    );
  }
}
