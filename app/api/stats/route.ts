import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const runtime = "nodejs"; // keep this

export async function GET() {
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

    // ✅ Check session via cookies (simple & stable)
    const cookieStore = cookies();

    const hasSession =
      cookieStore.get("__Secure-next-auth.session-token") ||
      cookieStore.get("next-auth.session-token");

    let userLessons = 0;

    // ❗ TEMP: don't query user here (avoid crash)
    // You can move user stats to separate API later

    return NextResponse.json({
      totalLessons: globalCounter.count,
      userLessons,
      isAuthenticated: !!hasSession,
    });
  } catch (error: any) {
    console.error("Stats API error:", error);

    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}