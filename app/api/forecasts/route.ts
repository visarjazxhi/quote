import { NextRequest, NextResponse } from "next/server";

import { ForecastDatabaseService } from "@/lib/forecast/services/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const forecasts = await ForecastDatabaseService.getForecasts(
      userId ?? undefined
    );

    return NextResponse.json({
      success: true,
      data: forecasts,
    });
  } catch (error) {
    console.error("Error fetching forecasts:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch forecasts",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      companyName,
      industry,
      businessType,
      establishedYear,
      employeeCount,
      taxRate,
      targetIncome,
      userId,
    } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Forecast name is required",
        },
        { status: 400 }
      );
    }

    const forecast = await ForecastDatabaseService.createForecast({
      name,
      description,
      companyName,
      industry,
      businessType,
      establishedYear: establishedYear ? parseInt(establishedYear) : undefined,
      employeeCount: employeeCount ? parseInt(employeeCount) : undefined,
      taxRate: taxRate ? parseFloat(taxRate) : undefined,
      targetIncome: targetIncome ? parseFloat(targetIncome) : undefined,
      userId,
    });

    return NextResponse.json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    console.error("Error creating forecast:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create forecast",
      },
      { status: 500 }
    );
  }
}
