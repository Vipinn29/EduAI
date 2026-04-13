import { NextResponse } from 'next/server';

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

    const chatbotKey = process.env.EDU_CHATBOT_KEY || process.env.HUGGINGFACE_API_KEY;
    if (!chatbotKey) {
      return NextResponse.json({ error: 'AI chatbot key not configured' }, { status: 500 });
    }

    const groqModel = 'llama-3.3-70b-versatile';
    const groqUrl = 'https://api.groq.com/openai/v1/chat/completions';

    const res = await fetch(groqUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${chatbotKey}`,
      },
      body: JSON.stringify({
        model: groqModel,
        messages: [
          {
            role: 'system',
            content: `You are a professional school teacher writing report card remarks.\n

Write:
- Positive and constructive comment
- Professional tone
- 3–4 lines
- Encouraging but honest\n
Rules:\n
- No markdown symbols (#, *, -)\n
- Use lists or bullet points where appropriate\n`,
          },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 300,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('generate-comment fetch failed', { status: res.status, body: errText });
      return NextResponse.json({ error: errText || `HTTP ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    let output = '';
    if (data?.choices?.[0]?.message?.content) {
      output = data.choices[0].message.content;
    } else if (typeof data === 'string') {
      output = data;
    }

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
