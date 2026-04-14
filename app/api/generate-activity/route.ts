import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { classLevel, subject, topic } = body;

    if (!classLevel || !subject || !topic) {
      return NextResponse.json({ error: 'Missing parameters; please include classLevel, subject and topic' }, { status: 400 });
    }

    const userPrompt = `Create one short interactive classroom activity for class ${classLevel}, subject ${subject}, topic ${topic}. The activity must require minimal materials, involve student participation, take under 10 minutes, and improve concept understanding. Use simple language and include headings.`;

    const chatbotKey = process.env.EDU_CHATBOT_KEY || process.env.HUGGINGFACE_API_KEY;
    if (!chatbotKey) {
      // fallback simple built-in activity if no AI key provided
      const fallback = `Activity Title: Quick ${topic} Relay\n\nMaterials: Paper, pencil (one per student)\n\nTime: 8 minutes\n\nProcedure:\n1. Divide students into small groups.\n2. Give each group a short problem related to ${topic}.\n3. One student from each group runs to the board and writes one step/answer, then tags next student.\n4. Continue until the problem is complete.\n\nLearning Outcome:\nStudents practise ${topic} in a fast, collaborative setting, reinforcing steps and improving understanding.`;
      return NextResponse.json({ activity: fallback });
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
            content: `You are an innovative classroom activity designer. Respond in simple language. Provide one short interactive classroom activity that:\n- requires minimal materials\n- involves student participation\n- takes under 10 minutes\n- improves concept understanding\nFormat the response with clear headings such as Activity Title, Materials, Time, Procedure, Learning Outcome.\n
            Rules:\n
- No markdown symbols (#, *)\n
- Use lists or bullet points where appropriate\n`,
          },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('generate-activity fetch failed', { status: res.status, body: errText });
      return NextResponse.json({ error: errText || `HTTP ${res.status}` }, { status: res.status });
    }

    const data = await res.json();
    let output = '';
    if (data?.choices?.[0]?.message?.content) {
      output = data.choices[0].message.content;
    } else if (typeof data === 'string') {
      output = data;
    }

    // final safety: if the AI returned nothing, provide a simple fallback
    if (!output || output.trim() === '') {
      output = `Activity Title: Quick ${topic} Relay\n\nMaterials: Paper, pencil (one per student)\n\nTime: 8 minutes\n\nProcedure:\n1. Divide students into small groups.\n2. Give each group a short problem related to ${topic}.\n3. One student from each group runs to the board and writes one step/answer, then tags next student.\n4. Continue until the problem is complete.\n\nLearning Outcome:\nStudents practise ${topic} in a fast, collaborative setting, reinforcing steps and improving understanding.`;
    }

    return NextResponse.json({ activity: output });
  } catch (err: any) {
    console.error('generate-activity error', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
