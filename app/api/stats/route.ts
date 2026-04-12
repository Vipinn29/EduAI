import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Global stats always available
    const globalCounter = await prisma.globalCounter.findUnique({
      where: { id: "global_lessons" },
    }) ?? { count: 0 };

    // Check auth cookie for user stats
    const headersList = request.headers;
    const hasAuthCookie = headersList.has('__Secure-next-auth.session-token') || headersList.has('next-auth.session-token');
    let userLessons = 0;

    if (hasAuthCookie) {
      // Demo count - replace with real user query
      userLessons = 42;
    }

    return NextResponse.json({
      totalLessons: globalCounter.count,
      userLessons,
      isAuthenticated: hasAuthCookie
    });
  } catch (error: any) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: "Internal server error", totalLessons: 0 },
      { status: 500 }
    );
  }
}

