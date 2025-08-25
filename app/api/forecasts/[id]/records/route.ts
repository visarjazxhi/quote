import { NextRequest, NextResponse } from "next/server";

import { ForecastDatabaseService } from "@/lib/forecast/services/database";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, accountIds, method, parameters, startDate, endDate, status } =
      body;

    if (!name || !accountIds || !method || !startDate || !endDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const record = await ForecastDatabaseService.saveForecastRecord(id, {
      name,
      accountIds,
      method,
      parameters: parameters ?? {},
      startDate,
      endDate,
      status: status ?? "active",
    });

    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error creating forecast record:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create forecast record",
      },
      { status: 500 }
    );
  }
}
