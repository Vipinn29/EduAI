import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    // ✅ Ensure global counter exists
    const globalCounter = await prisma.globalCounter.upsert({
      where: { id: "global_lessons" },
      update: {},
      create: {
        id: "global_lessons",
        count: 0,
      },
    });

    // ✅ Correct session (v5)
    const session = await auth();

    let userLessons = 0;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          _count: {
            select: { lessons: true },
          },
        },
      });

      userLessons = user?._count?.lessons || 0;
    }

    return NextResponse.json({
      totalLessons: globalCounter.count,
      userLessons,
      isAuthenticated: !!session,
    });
  } catch (error: any) {
    console.error("Stats API error:", error);

    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
