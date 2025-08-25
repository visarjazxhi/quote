import { NextRequest, NextResponse } from "next/server";

import type { EstimationStore } from "@/lib/store";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// HEAD /api/quotes/[id] - Check if a quote exists (used by QuoteManager)
export async function HEAD(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const quote = await prisma.quote.findUnique({
      where: { id },
      select: { id: true }, // Only select the ID to minimize data transfer
    });

    if (!quote) {
      return new Response(null, { status: 404 });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("Error checking quote existence:", error);

    // Check if it's a database connection error
    if (error instanceof Error) {
      if (
        error.message.includes("connect") ||
        error.message.includes("database")
      ) {
        return new Response(null, { status: 503 });
      }
    }

    return new Response(null, { status: 500 });
  }
}

// GET /api/quotes/[id] - Get a specific quote
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        entities: true,
        services: true,
        jobTeam: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error fetching quote:", error);

    // Check if it's a database connection error
    if (error instanceof Error) {
      if (
        error.message.includes("connect") ||
        error.message.includes("database")
      ) {
        return NextResponse.json(
          {
            error:
              "Database connection failed. Please check your database configuration.",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to fetch quote",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PUT /api/quotes/[id] - Update a specific quote
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { storeData } = body as { storeData: EstimationStore };

    // Extract client info
    const { clientInfo, discount, feesCharged, sections } = storeData;

    // First, delete existing entities and services
    await prisma.entity.deleteMany({
      where: { quoteId: id },
    });
    await prisma.quoteService.deleteMany({
      where: { quoteId: id },
    });

    // Update the quote with new data
    const quote = await prisma.quote.update({
      where: { id },
      data: {
        clientGroup: clientInfo.clientGroup || null,
        address: clientInfo.address || null,
        contactPerson: clientInfo.contactPerson || null,
        jobTeamId: clientInfo.jobTeam?.id || null,
        discountDescription: discount.description || null,
        discountAmount: discount.amount || 0,
        feesCharged: feesCharged || 0,
        entities: {
          create: clientInfo.entities.map((entity) => ({
            name: entity.name,
            entityType: entity.entityType,
            businessType: entity.businessType,
            hasXeroFile: entity.hasXeroFile,
            accountingSoftware: entity.accountingSoftware || null,
          })),
        },
        services: {
          create: sections.flatMap((section) =>
            section.services
              .filter((service) => {
                // Only include selected services
                return (
                  (service.type === "withOptions" &&
                    service.selectedOption !== undefined) ||
                  (service.type === "fixedCost" &&
                    service.value !== undefined) ||
                  (service.type === "manualInput" &&
                    service.customDescription !== undefined) ||
                  (service.type === "rnD" && service.rdExpenses !== undefined)
                );
              })
              .map((service) => ({
                serviceId: service.id,
                sectionId: section.id,
                serviceName: service.name,
                serviceType:
                  service.type === "withOptions"
                    ? "WITH_OPTIONS"
                    : service.type === "fixedCost"
                    ? "FIXED_COST"
                    : service.type === "manualInput"
                    ? "MANUAL_INPUT"
                    : "RND",
                // withOptions fields
                selectedOption:
                  service.type === "withOptions"
                    ? service.selectedOption
                    : null,
                quantity:
                  service.type === "withOptions" ? service.quantity : null,
                customRate:
                  service.type === "withOptions" ? service.customRate : null,
                useCustomRate:
                  service.type === "withOptions"
                    ? service.useCustomRate
                    : false,
                // fixedCost fields
                fixedValue: service.type === "fixedCost" ? service.value : null,
                // manualInput fields
                customDescription:
                  service.type === "manualInput"
                    ? service.customDescription
                    : null,
                customAmount:
                  service.type === "manualInput" ? service.customAmount : null,
                customRateManual:
                  service.type === "manualInput" ? service.customRate : null,
                // R&D fields
                rdExpenses: service.type === "rnD" ? service.rdExpenses : null,
              }))
          ),
        },
      },
      include: {
        entities: true,
        services: true,
        jobTeam: {
          include: {
            members: true,
          },
        },
      },
    });

    return NextResponse.json(quote);
  } catch (error) {
    console.error("Error updating quote:", error);

    // Check if it's a database connection error
    if (error instanceof Error) {
      if (
        error.message.includes("connect") ||
        error.message.includes("database")
      ) {
        return NextResponse.json(
          {
            error:
              "Database connection failed. Please check your database configuration.",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to update quote",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE /api/quotes/[id] - Delete a specific quote
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.quote.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Quote deleted successfully" });
  } catch (error) {
    console.error("Error deleting quote:", error);

    // Check if it's a database connection error
    if (error instanceof Error) {
      if (
        error.message.includes("connect") ||
        error.message.includes("database")
      ) {
        return NextResponse.json(
          {
            error:
              "Database connection failed. Please check your database configuration.",
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to delete quote",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
