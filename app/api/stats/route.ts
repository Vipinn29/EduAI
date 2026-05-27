import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const globalCounter = await prisma.globalCounter.findUnique({
      where: { id: "global_lessons" },
      select: { count: true },
    });

    return NextResponse.json({
      totalLessons: globalCounter?.count ?? 0,
    });
  } catch (error: any) {
    console.error("Stats API error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}