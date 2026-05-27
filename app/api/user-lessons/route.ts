import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";


export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    // Decode the NextAuth JWT from the request cookies.
    // IMPORTANT: for Credentials+JWT strategy, `sub` is the user id by default.
    // We also expose `token.id` via jwt() callback.
    const token = await getToken({
      req: {
        headers: {
          cookie: cookieHeader,
        },
      } as any,
      secret: process.env.NEXTAUTH_SECRET,
      // Explicitly specify the auth cookie name so we read the correct cookie in Vercel/serverless.
      // NextAuth default is `next-auth.session-token` for App Router + JWT strategy.
      // If your cookie name differs, adjust it here.
      cookieName: '__Secure-authjs.session-token',
    });



    console.log('[user-lessons] cookie length:', cookieHeader.length);
    console.log('[user-lessons] Token extracted:', token ? { id: token.id, sub: token.sub, email: token.email, iat: token.iat, exp: token.exp } : 'null');

    // Prefer callback-added token.id, fallback to token.sub.
    const userId = (token?.id as string | undefined) ?? (token?.sub as string | undefined);
    console.log('[user-lessons] UserId resolved:', userId || 'EMPTY');


    if (!userId) {
      console.log('[user-lessons] ⚠️ No userId - returning empty lessons');
      return NextResponse.json({ lessons: [], totalCount: 0 });
    }

    const lessons = await prisma.lesson.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        content: true,
        metadata: true,
        createdAt: true,
      },
    });

    const totalCount = await prisma.lesson.count({ where: { userId } });
    console.log('[user-lessons] ✓ Found', lessons.length, 'lessons for user', userId, 'Total count:', totalCount);

    // Format lessons
    const formattedLessons = lessons.map((lesson) => {
      const metadata = (lesson.metadata as any) || {};
      const title = (metadata as any).title || `Class ${(metadata as any).classLevel || ''} ${(metadata as any).subject || ''}: ${(metadata as any).chapter || 'Untitled'}`.trim();
      const preview = (lesson.content || "").slice(0, 150) + (lesson.content && lesson.content.length > 150 ? "..." : "");
      return {
        id: lesson.id,
        title,
        preview,
        date: lesson.createdAt.toISOString().split("T")[0],
      };
    });

    console.log('[user-lessons] Returning formatted lessons:', formattedLessons.length);
    return NextResponse.json({ lessons: formattedLessons, totalCount });
  } catch (error: any) {
    console.error("[user-lessons] ✗ API error:", error);
    console.error('[user-lessons] Returning error response');
    return NextResponse.json({ lessons: [], error: "Internal server error" }, { status: 500 });
  }
}

