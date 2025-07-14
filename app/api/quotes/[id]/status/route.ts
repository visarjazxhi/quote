import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/quotes/[id]/status - Update quote status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body as { status: "DRAFT" | "DOWNLOADED" | "SENT" };

    if (!["DRAFT", "DOWNLOADED", "SENT"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be DRAFT, DOWNLOADED, or SENT" },
        { status: 400 }
      );
    }

    const quote = await prisma.quote.update({
      where: { id },
      data: { status },
      include: {
        entities: true,
        services: true,
      },
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error updating quote status:", error);
    return NextResponse.json(
      { error: "Failed to update quote status" },
      { status: 500 }
    );
  }
}
