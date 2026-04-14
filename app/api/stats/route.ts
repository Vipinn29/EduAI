import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
  try {
    // ✅ Always safe global counter
    const globalCounter = await prisma.globalCounter.upsert({
      where: { id: "global_lessons" },
      update: {},
      create: {
        id: "global_lessons",
        count: 0,
      },
    });

    // ✅ Safe session extraction (no crash)
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    let userLessons = 0;

    try {
      if (token?.email) {
        const user = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: {
            _count: {
              select: { lessons: true },
            },
          },
        });

        userLessons = user?._count?.lessons || 0;
      }
    } catch (err) {
      console.error("USER STATS ERROR:", err);
    }

    return NextResponse.json({
      totalLessons: globalCounter.count,
      userLessons,
      isAuthenticated: !!token,
    });
  } catch (error: any) {
    console.error("Stats API error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}