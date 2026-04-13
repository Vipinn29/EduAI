import { NextResponse, NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getToken } from "next-auth/jwt";
import { authConfig } from "@/lib/auth";

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

    // NOTE: we're no longer using OpenAI.  the application has been
    // switched to a generic AI chatbot service that supports educational
    // API keys.  The environment variable name has been updated so it's
    // clear to users what to provide.
    //
    // For example, you could sign up at Hugging Face and use the
    // inference API.  Set HUGGINGFACE_API_KEY (or EDU_CHATBOT_KEY) and the
    // code below will POST to a model of your choice.
    const chatbotKey = process.env.EDU_CHATBOT_KEY || process.env.HUGGINGFACE_API_KEY;
    if (!chatbotKey) {
      return NextResponse.json({ error: 'AI chatbot key not configured' }, { status: 500 });
    }

    // Build the request for the third‑party service.  Adjust the URL/model
    // according to whatever provider you choose.  The example below targets
    // the Hugging Face *inference* API, which requires the `api-inference`
    // hostname and returns generated text in a `generated_text` field.
    //
    // If you are actually using an OpenAI-style key (e.g. starting with
    // "sk-"/"gsk-"), you may want to switch back to the OpenAI endpoint or
    // use a different provider entirely.  Replace the URL below accordingly.
    // Hugging Face recently migrated from the old `api-inference` host to
    // the new "router" service.  Update your URLs accordingly – the router
    // endpoint path is `/api/models/{model}` and accepts the same JSON body
    // as before.  You can also use `https://router.huggingface.co` with any
    // inference key.
    // Groq API endpoint for fast LLM inference. The key format (gsk_...)
    // indicates you have a Groq API key. Groq offers free educational access
    // with their fast inference servers.
    // Check https://console.groq.com/docs/models for current available models
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
          // enforced system persona for lesson formatting requirements
          {
            role: 'system',
            content: `You are an experienced Indian school teacher following CBSE and NEP 2020 guidelines.\n
Respond in simple language and structure your output with headings:\n- Learning Objectives\n- Introduction\n- Explanation\n- Activity\n- Homework\n Create practical, classroom-ready lesson plans suitable for Indian students.\n Keep explanations simple, interactive, and time-structured.\n
Focus on engagement, examples, and learning outcomes.`,
          },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 1000,
      }),
    });

    if (!res.ok) {
      // capture the body for debugging; it may be plain text or JSON
      const errText = await res.text();
      console.error('generate-lesson fetch failed', { status: res.status, body: errText });
      return NextResponse.json({ error: errText || `HTTP ${res.status}` }, { status: res.status });
    }

    const data = await res.json();

    // Groq API returns OpenAI-compatible format: { choices: [{ message: { content: '...' } }] }
    let output = '';
    if (data?.choices?.[0]?.message?.content) {
      output = data.choices[0].message.content;
    } else if (typeof data === 'string') {
      output = data;
    }

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
    const headersList = request.headers;
    const cookieHeader = headersList.get('cookie') || '';
    // console.log('Cookie header length:', cookieHeader.length > 0);
    const token = await getToken({ 
      req: {
        headers: {
          cookie: cookieHeader,
        },
      } as any, 
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
