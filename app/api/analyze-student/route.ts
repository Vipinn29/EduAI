import { NextResponse } from 'next/server';

interface Marks {
  maths: number;
  science: number;
  english: number;
}

function simpleAnalysis(marks: Marks) {
  const weak: string[] = [];
  if (marks.maths < 40) weak.push('Maths');
  if (marks.science < 40) weak.push('Science');
  if (marks.english < 40) weak.push('English');
  if (weak.length === 0) {
    // take the lowest score as weak
    const entries = Object.entries(marks) as [keyof Marks, number][];
    entries.sort((a, b) => a[1] - b[1]);
    weak.push(entries[0][0]);
  }
  const recommendations = weak
    .map((sub) => `Spend extra time reviewing ${sub} concepts and practice more problems.`)
    .join(' ');
  return { weakSubjects: weak, recommendations };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { maths, science, english } = body;

    if (
      maths == null ||
      science == null ||
      english == null ||
      isNaN(maths) ||
      isNaN(science) ||
      isNaN(english)
    ) {
      return NextResponse.json({ error: 'Please provide numeric marks for maths, science and english' }, { status: 400 });
    }

    maths = Number(maths);
    science = Number(science);
    english = Number(english);

    // attempt AI analysis
    let weakSubjects: string[] = [];
    let recommendations = '';

    const chatbotKey = process.env.EDU_CHATBOT_KEY || process.env.HUGGINGFACE_API_KEY;
    if (!chatbotKey) {
      // fall back to simple logic immediately
      return NextResponse.json(simpleAnalysis({ maths, science, english }));
    }

    try {
      const prompt = `Given marks for Maths: ${maths}, Science: ${science}, English: ${english}, identify the weak subjects and provide brief recommendations. Respond in JSON with keys \"weakSubjects\" (array) and \"recommendations\" (string).`;
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
              content: `You are an experienced Indian school teacher following CBSE and NEP 2020 guidelines.\n\nProvide a JSON output with weakSubjects and recommendations based solely on the marks provided.`,
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 200,
        }),
      });

      if (!res.ok) {
        throw new Error(`AI service returned ${res.status}`);
      }

      const data = await res.json();
      let text = '';
      if (data?.choices?.[0]?.message?.content) {
        text = data.choices[0].message.content;
      } else if (typeof data === 'string') {
        text = data;
      }
      // try parse JSON
      try {
        const json = JSON.parse(text);
        weakSubjects = Array.isArray(json.weakSubjects) ? json.weakSubjects : [];
        recommendations = typeof json.recommendations === 'string' ? json.recommendations : '';
      } catch (parseErr) {
        // fallback if JSON parse fails
        ({ weakSubjects, recommendations } = simpleAnalysis({ maths, science, english }));
      }

    } catch (aiErr) {
      console.error('analysis AI error', aiErr);
      ({ weakSubjects, recommendations } = simpleAnalysis({ maths, science, english }));
    }

    return NextResponse.json({ weakSubjects, recommendations });
  } catch (err: any) {
    console.error('analyze-student error', err);
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
