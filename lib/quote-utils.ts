import type { EstimationStore, Service, ServiceSection } from "./store";

import { useEstimationStore } from "./store";

// Database types (matching Prisma schema)
interface DbQuote {
  id: string;
  createdAt: string;
  updatedAt: string;
  clientGroup: string | null;
  address: string | null;
  contactPerson: string | null;
  status: "DRAFT" | "DOWNLOADED" | "SENT";
  discountDescription: string | null;
  discountAmount: number;
  feesCharged: number;
  entities: Array<{
    id: string;
    name: string;
    entityType: string;
    businessType: string;
    hasXeroFile: boolean;
    accountingSoftware: string | null;
  }>;
  services: Array<{
    id: string;
    serviceId: string;
    sectionId: string;
    serviceName: string;
    serviceType: "WITH_OPTIONS" | "FIXED_COST" | "MANUAL_INPUT" | "RND";
    selectedOption: string | null;
    quantity: number | null;
    customRate: number | null;
    useCustomRate: boolean;
    feedsRange: string | null;
    employeesRange: string | null;
    fixedValue: number | null;
    customDescription: string | null;
    customAmount: number | null;
    customRateManual: number | null;
    rdExpenses: number | null;
  }>;
}

export function convertDbQuoteToStore(
  dbQuote: DbQuote
): Partial<EstimationStore> {
  // Get the current store state to use as a base
  const currentStore = useEstimationStore.getState();

  // Get the current store state to use as a base;

  // Start with the current store sections as a base
  const updatedSections: ServiceSection[] = currentStore.sections.map(
    (section) => ({
      ...section,
      services: section.services.map((service) => {
        // Find matching database service
        const dbService = dbQuote.services.find(
          (s) => s.sectionId === section.id && s.serviceId === service.id
        );

        if (!dbService) {
          // Return service in unselected state
          return {
            ...service,
            selectedOption: undefined,
            quantity: undefined,
            customRate: undefined,
            useCustomRate: false,
            value: undefined,
            customDescription: undefined,
            customAmount: undefined,
            rdExpenses: undefined,
          };
        }

        // Convert database service back to store format
        const updatedService: Service = { ...service };

        switch (dbService.serviceType) {
          case "WITH_OPTIONS":
            if (updatedService.type === "withOptions") {
              updatedService.selectedOption =
                dbService.selectedOption ?? undefined;
              updatedService.quantity = dbService.quantity ?? undefined;
              updatedService.customRate = dbService.customRate ?? undefined;
              updatedService.useCustomRate = dbService.useCustomRate;
              updatedService.feedsRange = dbService.feedsRange ?? undefined;
              updatedService.employeesRange =
                dbService.employeesRange ?? undefined;
            }
            break;

          case "FIXED_COST":
            if (updatedService.type === "fixedCost") {
              updatedService.value = dbService.fixedValue ?? undefined;
            }
            break;

          case "MANUAL_INPUT":
            if (updatedService.type === "manualInput") {
              updatedService.customDescription =
                dbService.customDescription ?? undefined;
              updatedService.customAmount = dbService.customAmount ?? undefined;
              updatedService.customRate =
                dbService.customRateManual ?? undefined;
            }
            break;

          case "RND":
            if (updatedService.type === "rnD") {
              updatedService.rdExpenses = dbService.rdExpenses ?? undefined;
            }
            break;
        }

        return updatedService;
      }),
    })
  );

  return {
    sections: updatedSections,
    clientInfo: {
      clientGroup: dbQuote.clientGroup || "",
      address: dbQuote.address || "",
      contactPerson: dbQuote.contactPerson || "",
      entities: dbQuote.entities.map((entity) => ({
        id: entity.id,
        name: entity.name,
        entityType: entity.entityType,
        businessType: entity.businessType,
        hasXeroFile: entity.hasXeroFile,
        accountingSoftware: entity.accountingSoftware || undefined,
      })),
    },
    discount: {
      description: dbQuote.discountDescription || "",
      amount: dbQuote.discountAmount,
    },
    feesCharged: dbQuote.feesCharged,
  };
}

export async function saveQuoteToDatabase(quoteId?: string): Promise<string> {
  const storeData = useEstimationStore.getState();

  const url = quoteId ? `/api/quotes/${quoteId}` : "/api/quotes";
  const method = quoteId ? "PUT" : "POST";

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ storeData }),
  });

  if (!response.ok) {
    throw new Error(`Failed to ${quoteId ? "update" : "create"} quote`);
  }

  const savedQuote = await response.json();
  return savedQuote.id;
}

export async function loadQuoteFromDatabase(quoteId: string): Promise<void> {
  const response = await fetch(`/api/quotes/${quoteId}`);

  if (!response.ok) {
    throw new Error("Failed to load quote");
  }

  const dbQuote: DbQuote = await response.json();
  const storeData = convertDbQuoteToStore(dbQuote);

  // Update the store with the loaded data
  const store = useEstimationStore.getState();

  if (storeData.clientInfo) {
    store.updateClientGroup(storeData.clientInfo.clientGroup);
    store.updateClientAddress(storeData.clientInfo.address);
    store.updateContactPerson(storeData.clientInfo.contactPerson);

    // Set entities directly with loaded data, creating new IDs
    const entitiesWithNewIds = storeData.clientInfo.entities.map(
      (entityData, index) => ({
        ...entityData,
        id: `loaded-${Date.now()}-${index}`, // Generate unique IDs for loaded entities
        accountingSoftware: entityData.accountingSoftware || "", // Ensure accountingSoftware is never undefined
      })
    );

    store.setEntities(entitiesWithNewIds);
  }

  if (storeData.discount) {
    store.updateDiscount("description", storeData.discount.description);
    store.updateDiscount("amount", storeData.discount.amount);
  }

  if (storeData.feesCharged !== undefined) {
    store.updateFeesCharged(storeData.feesCharged);
  }

  // Update sections and services
  if (storeData.sections) {
    storeData.sections.forEach((sectionData) => {
      sectionData.services.forEach((serviceData) => {
        const sectionId = sectionData.id;
        const serviceId = serviceData.id;

        // Apply service data based on type
        switch (serviceData.type) {
          case "withOptions":
            if (serviceData.selectedOption !== undefined) {
              store.updateOption(
                sectionId,
                serviceId,
                serviceData.selectedOption
              );
              if (serviceData.quantity !== undefined) {
                store.updateQuantity(
                  sectionId,
                  serviceId,
                  serviceData.quantity
                );
              }
              if (
                serviceData.useCustomRate &&
                serviceData.customRate !== undefined
              ) {
                store.toggleCustomRate(sectionId, serviceId);
                store.updateCustomRate(
                  sectionId,
                  serviceId,
                  serviceData.customRate
                );
              }
            }
            break;

          case "fixedCost":
            if (serviceData.value !== undefined) {
              store.updateFixedCost(sectionId, serviceId, serviceData.value);
            }
            break;

          case "manualInput":
            if (serviceData.customDescription !== undefined) {
              store.updateManualInput(
                sectionId,
                serviceId,
                "customDescription",
                serviceData.customDescription
              );
              if (serviceData.customAmount !== undefined) {
                store.updateManualInput(
                  sectionId,
                  serviceId,
                  "customAmount",
                  serviceData.customAmount
                );
              }
              if (serviceData.customRate !== undefined) {
                store.updateManualInput(
                  sectionId,
                  serviceId,
                  "customRate",
                  serviceData.customRate
                );
              }
            }
            break;

          case "rnD":
            if (serviceData.rdExpenses !== undefined) {
              store.updateRnDExpenses(
                sectionId,
                serviceId,
                serviceData.rdExpenses
              );
            }
            break;
        }
      });
    });
  }
}
