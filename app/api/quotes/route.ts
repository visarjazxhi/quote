import { NextRequest, NextResponse } from "next/server";

import type { EstimationStore } from "@/lib/store";
import { prisma } from "@/lib/db";

// GET /api/quotes - List all quotes
export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      include: {
        entities: true,
        services: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}

// POST /api/quotes - Create a new quote
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeData } = body as { storeData: EstimationStore };

    // Extract client info
    const { clientInfo, discount, feesCharged, sections } = storeData;

    // Create the quote with related data
    const quote = await prisma.quote.create({
      data: {
        clientGroup: clientInfo.clientGroup || null,
        address: clientInfo.address || null,
        contactPerson: clientInfo.contactPerson || null,
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
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    );
  }
}
