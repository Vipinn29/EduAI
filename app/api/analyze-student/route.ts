import { NextResponse } from 'next/server';
import { getOpenAIClient, DEFAULT_MODEL, TEACHER_SYSTEM_MESSAGE } from '@/lib/openai';

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

    try {
      const client = getOpenAIClient();
      const prompt = `Given marks for Maths: ${maths}, Science: ${science}, English: ${english}, identify the weak subjects and provide brief recommendations. Respond in JSON with keys "weakSubjects" (array) and "recommendations" (string).`;

      const response = await client.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: `${TEACHER_SYSTEM_MESSAGE}\n\nProvide a JSON output with weakSubjects and recommendations based solely on the marks provided.`,
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 200,
      });

      const text = response.choices[0]?.message?.content || '';

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
