import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { authConfig } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // Check auth cookie first
    const headersList = request.headers;
    const cookieHeader = headersList.get('cookie') || '';
    // console.log('User-lessons cookie length:', cookieHeader.length);
    const token = await getToken({ 
      req: {
        headers: {
          cookie: cookieHeader,
        },
      } as any,
      secret: process.env.NEXTAUTH_SECRET,
    });
    // console.log('User-lessons token:', token ? { id: token.id, sub: token.sub } : 'null');
    const userId = token?.id as string || token?.sub as string;

    if (!userId) {
      return NextResponse.json({ lessons: [], totalCount: 0 });
    }

    if (!userId) {
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

    return NextResponse.json({ lessons: formattedLessons, totalCount });
  } catch (error: any) {
    console.error("User lessons API error:", error);
    return NextResponse.json({ lessons: [], error: "Internal server error" }, { status: 500 });
  }
}

