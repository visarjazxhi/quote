import { NextRequest, NextResponse } from "next/server";

import { ForecastDatabaseService } from "@/lib/forecast/services/database";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      description,
      type,
      value,
      accountIds,
      startDate,
      endDate,
      status,
    } = body;

    if (
      !name ||
      !type ||
      value === undefined ||
      !accountIds ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    const scenario = await ForecastDatabaseService.saveScenarioConfig(id, {
      name,
      description,
      type,
      value: parseFloat(value),
      accountIds,
      startDate,
      endDate,
      status: status ?? "active",
    });

    return NextResponse.json({
      success: true,
      data: scenario,
    });
  } catch (error) {
    console.error("Error creating scenario:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create scenario",
      },
      { status: 500 }
    );
  }
}
