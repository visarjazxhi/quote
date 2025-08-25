import { NextRequest, NextResponse } from "next/server";

import { ForecastDatabaseService } from "@/lib/forecast/services/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const forecast = await ForecastDatabaseService.getForecast(id);

    if (!forecast) {
      return NextResponse.json(
        {
          success: false,
          error: "Forecast not found",
        },
        { status: 404 }
      );
    }

    // Convert to FinancialData format for the frontend
    const financialData =
      ForecastDatabaseService.convertToFinancialData(forecast);

    return NextResponse.json({
      success: true,
      data: {
        forecast,
        financialData,
      },
    });
  } catch (error) {
    console.error("Error fetching forecast:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch forecast",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { financialData } = body;

    if (!financialData) {
      return NextResponse.json(
        {
          success: false,
          error: "Financial data is required",
        },
        { status: 400 }
      );
    }

    await ForecastDatabaseService.saveFinancialData(id, financialData);

    return NextResponse.json({
      success: true,
      message: "Forecast updated successfully",
    });
  } catch (error) {
    console.error("Error updating forecast:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update forecast",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ForecastDatabaseService.deleteForecast(id);

    return NextResponse.json({
      success: true,
      message: "Forecast deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting forecast:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete forecast",
      },
      { status: 500 }
    );
  }
}
