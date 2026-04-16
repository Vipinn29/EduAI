import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const globalCounter = await prisma.globalCounter.upsert({
      where: { id: "global_lessons" },
      update: {},
      create: {
        id: "global_lessons",
        count: 0,
      },
    });

    return NextResponse.json({
      totalLessons: globalCounter.count,
    });
  } catch (error: any) {
    console.error("Stats API error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}