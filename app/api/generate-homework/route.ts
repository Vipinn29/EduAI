import { NextResponse } from 'next/server';

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

    const chatbotKey = process.env.EDU_CHATBOT_KEY || process.env.HUGGINGFACE_API_KEY;
    if (!chatbotKey) {
      return NextResponse.json({ error: 'AI chatbot key not configured' }, { status: 500 });
    }

    const groqModel = 'llama-3.3-70b-versatile';
    const openaiUrl = 'https://api.openai.com/v1/chat/completions';

    const res = await fetch(openaiUrl, {
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
            content: `You are an experienced Indian school teacher following CBSE and NEP 2020 guidelines.\n\nRespond in simple language and structure your output with headings:\n- Worksheet\n- Answers \n
            behave like a school exam paper creator.\n

Include:
- 5 MCQs
- 3 short answer questions
- 2 application-based questions

\nKeep questions curriculum aligned and age appropriate.
Provide answers separately at the end.`,
          },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 1000,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('generate-homework fetch failed', { status: res.status, body: errText });
      return NextResponse.json({ error: errText || `HTTP ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    let output = '';
    if (data?.choices?.[0]?.message?.content) {
      output = data.choices[0].message.content;
    } else if (typeof data === 'string') {
      output = data;
    }

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
