import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Always ensure row exists
    const globalCounter = await prisma.globalCounter.upsert({
      where: { id: "global_lessons" },
      update: {},
      create: {
        id: "global_lessons",
        count: 0,
      },
    });

    // Auth check (optional)
    const headersList = request.headers;
    const hasAuthCookie =
      headersList.has("__Secure-next-auth.session-token") ||
      headersList.has("next-auth.session-token");

    let userLessons = 0;

    if (hasAuthCookie) {
      userLessons = 42; // placeholder
    }

    return NextResponse.json({
      totalLessons: globalCounter.count,
      userLessons,
      isAuthenticated: hasAuthCookie,
    });
  } catch (error: any) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      {
        error: error.message, // 👈 show real error
        totalLessons: 0,
      },
      { status: 500 }
    );
  }
}