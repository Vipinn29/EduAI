import { NextResponse } from 'next/server';
import { getOpenAIClient, DEFAULT_MODEL, TEACHER_SYSTEM_MESSAGE } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { classLevel, subject, topic } = body;

    if (!classLevel || !subject || !topic) {
      return NextResponse.json({ error: 'Missing parameters; please include classLevel, subject and topic' }, { status: 400 });
    }

    const userPrompt = `Create one short interactive classroom activity for class ${classLevel}, subject ${subject}, topic ${topic}. The activity must require minimal materials, involve student participation, take under 10 minutes, and improve concept understanding. Use simple language and include headings.`;

    const chatbotKey = process.env.OPENROUTER_API_KEY;
    if (!chatbotKey) {
      // fallback simple built-in activity if no AI key provided
      const fallback = `Activity Title: Quick ${topic} Relay\n\nMaterials: Paper, pencil (one per student)\n\nTime: 8 minutes\n\nProcedure:\n1. Divide students into small groups.\n2. Give each group a short problem related to ${topic}.\n3. One student from each group runs to the board and writes one step/answer, then tags next student.\n4. Continue until the problem is complete.\n\nLearning Outcome:\nStudents practise ${topic} in a fast, collaborative setting, reinforcing steps and improving understanding.`;
      return NextResponse.json({ activity: fallback });
    }

    const client = getOpenAIClient();

    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: 'system',
          content: `${TEACHER_SYSTEM_MESSAGE}\n\nYou are an innovative classroom activity designer. Provide one short interactive classroom activity that:\n- requires minimal materials\n- involves student participation\n- takes under 10 minutes\n- improves concept understanding\nFormat the response with clear headings such as Activity Title, Materials, Time, Procedure, Learning Outcome.`,
        },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 500,
    });

    const output = response.choices[0]?.message?.content || '';

    // final safety: if the AI returned nothing, provide a simple fallback
    if (!output || output.trim() === '') {
      const fallback = `Activity Title: Quick ${topic} Relay\n\nMaterials: Paper, pencil (one per student)\n\nTime: 8 minutes\n\nProcedure:\n1. Divide students into small groups.\n2. Give each group a short problem related to ${topic}.\n3. One student from each group runs to the board and writes one step/answer, then tags next student.\n4. Continue until the problem is complete.\n\nLearning Outcome:\nStudents practise ${topic} in a fast, collaborative setting, reinforcing steps and improving understanding.`;
      return NextResponse.json({ activity: fallback });
    }

    return NextResponse.json({ activity: output });
  } catch (err: any) {
    console.error('generate-activity error', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
