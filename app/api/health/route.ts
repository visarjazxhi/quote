import { NextResponse } from "next/server";
import { connectWithDiagnostics } from "@/lib/db";

export async function GET() {
  try {
    console.log("🏥 Health check endpoint called");

    const dbResult = await connectWithDiagnostics();

    if (dbResult.success) {
      return NextResponse.json({
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + "...",
        },
      });
    } else {
      return NextResponse.json(
        {
          status: "unhealthy",
          database: "disconnected",
          error: dbResult.error,
          code: dbResult.code,
          details: dbResult.details,
          timestamp: new Date().toISOString(),
          environment: {
            nodeEnv: process.env.NODE_ENV,
            hasDatabaseUrl: !!process.env.DATABASE_URL,
            databaseUrlPrefix:
              process.env.DATABASE_URL?.substring(0, 20) + "...",
          },
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "error",
        database: "unknown",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + "...",
        },
      },
      { status: 500 }
    );
  }
}
