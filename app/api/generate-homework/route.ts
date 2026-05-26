import { NextResponse } from 'next/server';
import { getOpenAIClient, DEFAULT_MODEL, TEACHER_SYSTEM_MESSAGE } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { classLevel, subject, topic, difficulty } = body;

    if (!classLevel || !subject || !topic || !difficulty) {
      return NextResponse.json({ error: 'Missing parameters; please include classLevel, subject, topic and difficulty' }, { status: 400 });
    }

    // allow difficulty strings/numbers, but mostly keep as provided
    difficulty = String(difficulty);

    const userPrompt = `Generate a homework worksheet for class ${classLevel}, subject ${subject}, topic ${topic} with difficulty level ${difficulty}.`;

    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: `${TEACHER_SYSTEM_MESSAGE}\n\nFor homework worksheets, create:\n- 5 MCQs\n- 3 short answer questions\n- 2 application-based questions\n\nProvide answers separately at the end.`,
        },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1000,
    });

    const output = response.choices[0]?.message?.content || '';

    return NextResponse.json({ homework: output });
  } catch (err: any) {
    console.error('generate-homework error', {
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
