import { create } from "zustand";

// Centralized rate definitions
export const STANDARD_RATES = {
  admin: { value: "admin", label: "Admin", rate: 75 },
  junior: { value: "junior", label: "Junior Accountant", rate: 100 },
  standard: { value: "standard", label: "Standard", rate: 150 },
  intermediate: {
    value: "intermediate",
    label: "Intermediate Accountant",
    rate: 200,
  },
  accountant: { value: "accountant", label: "Accountant", rate: 300 },
  senior: { value: "senior", label: "Senior Manager", rate: 400 },
  partner: { value: "partner", label: "Partner", rate: 600 },
} as const;

export const getStandardRateOptions = (): ServiceOption[] => {
  return Object.values(STANDARD_RATES);
};

export const getCustomRateOptions = (
  rateKeys: (keyof typeof STANDARD_RATES)[]
): ServiceOption[] => {
  return rateKeys.map((key) => STANDARD_RATES[key]);
};

export interface ServiceOption {
  value: string;
  label: string;
  rate: number;
}

export interface ServiceWithOptions {
  id: string;
  name: string;
  description: string;
  type: "withOptions";
  rateOptions?: ServiceOption[]; // Optional custom rates, defaults to standard rates
  selectedOption?: string;
  quantity?: number;
  customRate?: number;
  useCustomRate?: boolean;
}

export interface ServiceWithFixedCost {
  id: string;
  name: string;
  description: string;
  type: "fixedCost";
  value?: number;
}

export interface ServiceWithManualInput {
  id: string;
  name: string;
  description: string;
  type: "manualInput";
  customDescription?: string;
  customAmount?: number;
  customRate?: number;
}

export interface ServiceWithRnD {
  id: string;
  name: string;
  description: string;
  type: "rnD";
  rdExpenses?: number; // Total R&D expenses (GST excluded)
}

export type Service =
  | ServiceWithOptions
  | ServiceWithFixedCost
  | ServiceWithManualInput
  | ServiceWithRnD;

export interface ServiceSection {
  id: string;
  name: string;
  services: Service[];
}

export interface Entity {
  id: string;
  name: string;
  entityType: string;
  businessType: string;
  hasXeroFile: boolean;
  accountingSoftware?: string;
}

export interface ClientInfo {
  clientGroup: string;
  address: string;
  contactPerson: string;
  entities: Entity[];
}

export interface Discount {
  description: string;
  amount: number;
}

export interface EstimationStore {
  sections: ServiceSection[];
  clientInfo: ClientInfo;
  discount: Discount;
  feesCharged: number;
  toggleService: (sectionId: string, serviceId: string) => void;
  updateOption: (sectionId: string, serviceId: string, option: string) => void;
  updateQuantity: (
    sectionId: string,
    serviceId: string,
    quantity: number
  ) => void;
  updateCustomRate: (
    sectionId: string,
    serviceId: string,
    rate: number
  ) => void;
  toggleCustomRate: (sectionId: string, serviceId: string) => void;
  updateFixedCost: (
    sectionId: string,
    serviceId: string,
    value: number
  ) => void;
  updateManualInput: (
    sectionId: string,
    serviceId: string,
    field: "customDescription" | "customAmount" | "customRate",
    value: string | number
  ) => void;
  updateRnDExpenses: (
    sectionId: string,
    serviceId: string,
    expenses: number
  ) => void;
  updateClientGroup: (clientGroup: string) => void;
  updateClientAddress: (address: string) => void;
  updateContactPerson: (contactPerson: string) => void;
  addEntity: () => void;
  removeEntity: (entityId: string) => void;
  updateEntity: (
    entityId: string,
    field: keyof Entity,
    value: string | boolean
  ) => void;

  updateDiscount: (field: keyof Discount, value: string | number) => void;
  updateFeesCharged: (amount: number) => void;
  totalCost: () => number;
  addSection: (name: string) => void;
  getServiceOptions: (sectionId: string, serviceId: string) => ServiceOption[];
}

export const useEstimationStore = create<EstimationStore>((set, get) => ({
  clientInfo: {
    clientGroup: "",
    address: "",
    contactPerson: "",
    entities: [
      {
        id: "1",
        name: "",
        entityType: "",
        businessType: "",
        hasXeroFile: false,
        accountingSoftware: "",
      },
    ],
  },
  discount: {
    description: "",
    amount: 0,
  },
  feesCharged: 0,
  sections: [
    {
      id: "admin",
      name: "Admin Services",
      services: [
        {
          id: "client-id",
          name: "Client ID",
          description: "Managing and assigning client identifiers.",
          type: "withOptions",
          // Uses standard rates by default
        },
        {
          id: "xero-setup",
          name: "Set up on XPM",
          description: "Setting up client accounts on Xero Practice Manager.",
          type: "withOptions",
        },
        {
          id: "ato-nomination",
          name: "ATO Nomination",
          description: "Nomination on ATO as the client's tax agent.",
          type: "withOptions",
        },
        {
          id: "asic-onboarding",
          name: "ASIC Onboarding",
          description: "Onboarding clients with the ASIC",
          type: "withOptions",
        },
        {
          id: "engagement",
          name: "Engagement",
          description: "Client engagement and interaction services.",
          type: "withOptions",
        },
        {
          id: "job-flow-management",
          name: "Job Flow Management",
          description: "Managing workflow and job assignments.",
          type: "withOptions",
        },
        {
          id: "data-collection-review",
          name: "Data Collection & Review",
          description: "Gathering and reviewing client data.",
          type: "withOptions",
        },
        {
          id: "cleardocs",
          name: "New client - Cleardocs",
          description: "Setting up new clients from Cleardocs.",
          type: "withOptions",
        },
        {
          id: "admin-other",
          name: "Other",
          description: "Any other administrative services required.",
          type: "manualInput",
        },
      ],
    },
    {
      id: "applications",
      name: "Applications",
      services: [
        {
          id: "abn-application",
          name: "ABN Application",
          description: "Applying for an Australian Business Number (ABN).",
          type: "withOptions",
          // Example of custom rates - excluding accountant level for basic applications
          rateOptions: getCustomRateOptions([
            "admin",
            "junior",
            "standard",
            "intermediate",
            "senior",
            "partner",
          ]),
        },
        {
          id: "tfn-application",
          name: "TFN Application",
          description: "Applying for a Tax File Number (TFN).",
          type: "withOptions",
          rateOptions: getCustomRateOptions([
            "admin",
            "junior",
            "standard",
            "intermediate",
            "senior",
            "partner",
          ]),
        },
        {
          id: "gst-application",
          name: "GST Application",
          description:
            "Applying for Goods and Services Tax (GST) registration.",
          type: "withOptions",
          rateOptions: getCustomRateOptions([
            "admin",
            "junior",
            "standard",
            "intermediate",
            "senior",
            "partner",
          ]),
        },
        {
          id: "stamp-duty-application",
          name: "Stamp Duty Application",
          description: "Applying for stamp duty on State Revenue Office (SRO).",
          type: "withOptions",
          rateOptions: getCustomRateOptions([
            "admin",
            "junior",
            "standard",
            "intermediate",
            "senior",
            "partner",
          ]),
        },
        {
          id: "applications-other",
          name: "Other",
          description: "Any other application services required.",
          type: "manualInput",
        },
      ],
    },
    {
      id: "fs_preparation",
      name: "Annual Financial Statements Preparation",
      services: [
        {
          id: "annual-accounts-preparation",
          name: "Annual Accounts Preparation",
          description: "Preparation of annual financial accounts.",
          type: "withOptions",
        },
        {
          id: "tax-return-preparation",
          name: "Tax Return Preparation",
          description: "Preparation and lodgment of tax returns.",
          type: "withOptions",
        },
        {
          id: "taxable-payments-report",
          name: "Taxable Payments Report",
          description:
            "Preparation and submission of taxable payments reports.",
          type: "withOptions",
        },
        {
          id: "workcover-application",
          name: "Workcover Application Only",
          description: "Assistance with Workcover application.",
          type: "withOptions",
        },
        {
          id: "payroll-tax-lodgement",
          name: "Payroll Tax Lodgement & Reconciliation",
          description: "Processing and lodging payroll tax reconciliation.",
          type: "withOptions",
        },
        {
          id: "admin-emails-reports",
          name: "Admin, Emails, ATO, IAA, ASIC Reports",
          description:
            "Administrative support including email management and regulatory reporting.",
          type: "withOptions",
        },
        {
          id: "ato-liaison",
          name: "ATO Liaison",
          description:
            "Communication and liaison with the Australian Taxation Office.",
          type: "withOptions",
        },
        {
          id: "correspondence",
          name: "Correspondence",
          description: "Handling business correspondence and communication.",
          type: "withOptions",
        },
        {
          id: "client-meeting",
          name: "Client Meeting",
          description:
            "Business consultation and strategy meeting with clients.",
          type: "withOptions",
        },
        {
          id: "other",
          name: "Other",
          description: "Any other additional services required.",
          type: "manualInput",
        },
        {
          id: "client-outboarding",
          name: "Client Out Boarding",
          description: "Handling client transitions and offboarding processes.",
          type: "withOptions",
        },
      ],
    },
    {
      id: "Corporate Secretarial Services",
      name: "Corporate Secretarial Services",
      services: [
        {
          id: "annual-review",
          name: "Annual Review",
          description: "Review of annual reports and compliance documents.",
          type: "withOptions",
        },
        {
          id: "other-asic-administration",
          name: "Other ASIC Administration",
          description:
            "Handling other administrative tasks related to ASIC compliance.",
          type: "withOptions",
        },
        {
          id: "client-meeting",
          name: "Client Meeting",
          description: "Consultation and advisory meetings with clients.",
          type: "withOptions",
        },
        {
          id: "client-outboarding",
          name: "Client Out Boarding",
          description: "Managing the transition and offboarding of clients.",
          type: "withOptions",
        },
        {
          id: "corporate-secretarial-other",
          name: "Other",
          description: "Any other corporate secretarial services required.",
          type: "manualInput",
        },
      ],
    },
    {
      id: "Activity Statement Preparation ",
      name: "Activity Statement Preparation ",
      services: [
        {
          id: "monthly-bas-gst-reconciliation",
          name: "Monthly BAS incl. GST Reconciliation",
          description:
            "Preparation and lodgment of monthly Business Activity Statements including GST reconciliation.",
          type: "withOptions",
        },
        {
          id: "quarterly-bas-gst-reconciliation",
          name: "Quarterly BAS incl. GST Reconciliation",
          description:
            "Preparation and lodgment of quarterly Business Activity Statements including GST reconciliation.",
          type: "withOptions",
        },
        {
          id: "ias-preparation",
          name: "IAS Preparation",
          description:
            "Preparation and lodgment of Instalment Activity Statements.",
          type: "withOptions",
        },
        {
          id: "other-as-administration",
          name: "Other AS Administration",
          description:
            "Handling other administrative tasks related to Activity Statements.",
          type: "withOptions",
        },
        {
          id: "client-outboarding",
          name: "Client Out Boarding",
          description: "Managing the transition and offboarding of clients.",
          type: "withOptions",
        },
        {
          id: "activity-statements-other",
          name: "Other",
          description: "Any other activity statement services required.",
          type: "manualInput",
        },
      ],
    },
    {
      id: "Bookkeeping ",
      name: "Bookkeeping ",
      services: [
        {
          id: "bookkeeping-ar-ap-journal-reports",
          name: "Bookkeeping - AR, AP, Journal, Reports etc",
          description:
            "Managing accounts receivable, accounts payable, journal entries, and financial reports.",
          type: "withOptions",
        },
        {
          id: "bookkeeping-bank-reconciliation",
          name: "Bookkeeping - Bank Reconciliation",
          description:
            "Reconciling bank transactions to ensure accuracy in financial records.",
          type: "withOptions",
        },
        {
          id: "bookkeeping-attendance-general",
          name: "Bookkeeping Attendance - General",
          description: "General bookkeeping attendance and support.",
          type: "withOptions",
        },
        {
          id: "data-entry-bank-coding-reconciliation",
          name: "Data Entry and Bank Coding and Reconciliation",
          description:
            "Processing data entry, bank transaction coding, and reconciliation.",
          type: "withOptions",
        },
        {
          id: "payroll-process-aba-file",
          name: "Payroll Process and ABA File Preparation",
          description:
            "Processing payroll and preparing ABA files for direct payments.",
          type: "withOptions",
        },
        {
          id: "stp-filing",
          name: "STP Filing",
          description:
            "Processing and lodging Single Touch Payroll (STP) reports.",
          type: "withOptions",
        },
        {
          id: "super-process-lodgement",
          name: "Super Process and Lodgement",
          description:
            "Processing and lodging superannuation payments for employees.",
          type: "withOptions",
        },
        {
          id: "xero-bookkeeping-support",
          name: "Xero Bookkeeping Support",
          description:
            "Providing support and assistance for Xero bookkeeping tasks.",
          type: "withOptions",
        },
        {
          id: "xero-setup",
          name: "Xero Setup",
          description:
            "Setting up Xero accounts and configurations for business needs.",
          type: "withOptions",
        },
        {
          id: "xero-training",
          name: "Xero Training",
          description: "Providing training sessions on using Xero effectively.",
          type: "withOptions",
        },
        {
          id: "accounts-payable-batch-preparation",
          name: "Accounts Payable and Batch Preparation",
          description:
            "Processing accounts payable and preparing batch payments.",
          type: "withOptions",
        },
        {
          id: "accounts-receivable-debt-reconciliation",
          name: "Accounts Receivable and Outstanding Debt Reconciliation",
          description:
            "Managing accounts receivable and reconciling outstanding debts.",
          type: "withOptions",
        },
        {
          id: "bookkeeping-other",
          name: "Other",
          description: "Any other bookkeeping services required.",
          type: "manualInput",
        },
      ],
    },
    {
      id: "advisory",
      name: "Advisory",
      services: [
        {
          id: "annual-accounts-review",
          name: "Annual Accounts Review",
          description: "Review of financial accounts and reports.",
          type: "withOptions",
          // Uses standard rates (including accountant level)
        },
        {
          id: "client-management-meeting",
          name: "Client Management Meeting",
          description: "Regular client management and relationship meetings.",
          type: "withOptions",
        },
        {
          id: "client-tax-planning-meeting",
          name: "Client Tax Planning Meeting",
          description: "Strategic tax planning meetings with clients.",
          type: "withOptions",
        },
        {
          id: "strategic-planning-forecast",
          name: "Strategic Planning & Forecast",
          description:
            "Business strategic planning and financial forecasting services.",
          type: "withOptions",
        },
        {
          id: "advisory-other",
          name: "Other",
          description: "Any other advisory services required.",
          type: "manualInput",
        },
      ],
    },
    {
      id: "startups",
      name: "Startups",
      services: [
        {
          id: "client-advise-meeting",
          name: "Client Advise Meeting",
          description: "Advisory meetings for startup clients.",
          type: "withOptions",
        },
        {
          id: "new-client-setup",
          name: "New Client Setup",
          description: "Complete setup process for new startup clients.",
          type: "withOptions",
        },
        {
          id: "cleardocs-startup",
          name: "ClearDocs",
          description: "ClearDocs services for startup clients.",
          type: "withOptions",
        },
        {
          id: "startups-other",
          name: "Other",
          description: "Any other startup services required.",
          type: "manualInput",
        },
      ],
    },
    {
      id: "financial-planning",
      name: "Financial Planning",
      services: [
        {
          id: "retirement-planning",
          name: "Retirement Planning",
          description:
            "Comprehensive strategies to help you achieve a comfortable and secure retirement.",
          type: "withOptions",
        },
        {
          id: "investment-advisory",
          name: "Investment Advisory",
          description:
            "Guidance on investment strategies, portfolio management, and risk assessment.",
          type: "withOptions",
        },
        {
          id: "superannuation-strategies",
          name: "Superannuation Strategies",
          description:
            "Maximizing your superannuation contributions and tax benefits for long-term wealth building.",
          type: "withOptions",
        },
        {
          id: "tax-effective-investing",
          name: "Tax-Effective Investing",
          description:
            "Structuring your investments to minimize tax liabilities and maximize returns.",
          type: "withOptions",
        },
        {
          id: "estate-planning",
          name: "Estate Planning",
          description:
            "Ensuring a smooth transfer of wealth through wills, trusts, and tax-efficient strategies.",
          type: "withOptions",
        },
        {
          id: "financial-planning-other",
          name: "Other",
          description: "Any other financial planning services required.",
          type: "manualInput",
        },
      ],
    },
    {
      id: "rnd",
      name: "R&D",
      services: [
        {
          id: "rnd-tax-incentive",
          name: "R&D Tax Incentive",
          description:
            "R&D tax incentive calculation and processing. Enter your total R&D expenses (GST excluded) to calculate the refund amount and our fees.",
          type: "rnD",
        },
      ],
    },
  ],

  // Helper method to get service options
  getServiceOptions: (sectionId, serviceId) => {
    const section = get().sections.find((s) => s.id === sectionId);
    if (!section) return [];

    const service = section.services.find((s) => s.id === serviceId);
    if (!service || service.type !== "withOptions") return [];

    // Return custom rates if defined, otherwise return standard rates
    return service.rateOptions || getStandardRateOptions();
  },

  toggleService: (sectionId, serviceId) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              services: section.services.map((service) =>
                service.id === serviceId
                  ? service.type === "withOptions"
                    ? {
                        ...service,
                        selectedOption:
                          service.selectedOption === undefined
                            ? (service.rateOptions ||
                                getStandardRateOptions())[0].value
                            : undefined,
                        quantity:
                          service.quantity === undefined ? 1 : undefined,
                      }
                    : service.type === "fixedCost"
                    ? {
                        ...service,
                        value: service.value === undefined ? 0 : undefined,
                      }
                    : service.type === "manualInput"
                    ? {
                        ...service,
                        customDescription:
                          service.customDescription === undefined
                            ? ""
                            : undefined,
                        customAmount:
                          service.customAmount === undefined ? 0 : undefined,
                        customRate:
                          service.customRate === undefined ? 0 : undefined,
                      }
                    : service.type === "rnD"
                    ? {
                        ...service,
                        rdExpenses:
                          service.rdExpenses === undefined ? 0 : undefined,
                      }
                    : service
                  : service
              ),
            }
          : section
      ),
    })),

  updateOption: (sectionId, serviceId, option) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              services: section.services.map((service) =>
                service.id === serviceId && service.type === "withOptions"
                  ? { ...service, selectedOption: option }
                  : service
              ),
            }
          : section
      ),
    })),

  updateQuantity: (sectionId, serviceId, quantity) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              services: section.services.map((service) =>
                service.id === serviceId && service.type === "withOptions"
                  ? { ...service, quantity: quantity }
                  : service
              ),
            }
          : section
      ),
    })),

  updateCustomRate: (sectionId, serviceId, rate) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              services: section.services.map((service) =>
                service.id === serviceId && service.type === "withOptions"
                  ? { ...service, customRate: rate }
                  : service
              ),
            }
          : section
      ),
    })),

  toggleCustomRate: (sectionId, serviceId) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              services: section.services.map((service) =>
                service.id === serviceId && service.type === "withOptions"
                  ? {
                      ...service,
                      useCustomRate: !service.useCustomRate,
                      customRate: !service.useCustomRate
                        ? 0
                        : service.customRate,
                    }
                  : service
              ),
            }
          : section
      ),
    })),

  updateFixedCost: (sectionId, serviceId, value) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              services: section.services.map((service) =>
                service.id === serviceId && service.type === "fixedCost"
                  ? { ...service, value: value }
                  : service
              ),
            }
          : section
      ),
    })),

  updateManualInput: (sectionId, serviceId, field, value) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              services: section.services.map((service) =>
                service.id === serviceId && service.type === "manualInput"
                  ? { ...service, [field]: value }
                  : service
              ),
            }
          : section
      ),
    })),

  updateRnDExpenses: (sectionId, serviceId, expenses) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              services: section.services.map((service) =>
                service.id === serviceId && service.type === "rnD"
                  ? { ...service, rdExpenses: expenses }
                  : service
              ),
            }
          : section
      ),
    })),

  updateFeesCharged: (amount) =>
    set(() => ({
      feesCharged: amount,
    })),

  totalCost: () => {
    const { sections, discount, getServiceOptions } = get();
    const sectionsTotal = sections.reduce((sectionTotal, section) => {
      return (
        sectionTotal +
        section.services.reduce((serviceTotal, service) => {
          if (
            service.type === "withOptions" &&
            service.selectedOption &&
            service.quantity
          ) {
            // Use custom rate if enabled, otherwise use selected option rate
            const rate =
              service.useCustomRate && service.customRate !== undefined
                ? service.customRate
                : getServiceOptions(section.id, service.id).find(
                    (opt) => opt.value === service.selectedOption
                  )?.rate || 0;

            return serviceTotal + rate * service.quantity;
          } else if (
            service.type === "fixedCost" &&
            service.value !== undefined
          ) {
            return serviceTotal + service.value;
          } else if (
            service.type === "manualInput" &&
            service.customAmount !== undefined &&
            service.customRate !== undefined
          ) {
            return serviceTotal + service.customAmount * service.customRate;
          } else if (
            service.type === "rnD" &&
            service.rdExpenses !== undefined &&
            service.rdExpenses > 0
          ) {
            // R&D calculation: expenses * 43.5% = refund amount
            const refundAmount = service.rdExpenses * 0.435;
            // Our fees: 10% of refund amount, minimum $2500
            const ourFees = Math.max(refundAmount * 0.1, 2500);
            return serviceTotal + ourFees;
          }
          return serviceTotal;
        }, 0)
      );
    }, 0);

    const discountAmount = discount.amount || 0;

    return Math.max(0, sectionsTotal - discountAmount);
  },

  addSection: (name) =>
    set((state) => ({
      sections: [
        ...state.sections,
        { id: Date.now().toString(), name, services: [] },
      ],
    })),

  updateClientGroup: (clientGroup) =>
    set((state) => ({
      clientInfo: {
        ...state.clientInfo,
        clientGroup,
      },
    })),

  updateClientAddress: (address) =>
    set((state) => ({
      clientInfo: {
        ...state.clientInfo,
        address,
      },
    })),

  updateContactPerson: (contactPerson) =>
    set((state) => ({
      clientInfo: {
        ...state.clientInfo,
        contactPerson,
      },
    })),

  addEntity: () =>
    set((state) => ({
      clientInfo: {
        ...state.clientInfo,
        entities: [
          ...state.clientInfo.entities,
          {
            id: Date.now().toString(),
            name: "",
            entityType: "",
            businessType: "",
            hasXeroFile: false,
            accountingSoftware: "",
          },
        ],
      },
    })),

  removeEntity: (entityId) =>
    set((state) => ({
      clientInfo: {
        ...state.clientInfo,
        entities: state.clientInfo.entities.filter(
          (entity) => entity.id !== entityId
        ),
      },
    })),

  updateEntity: (entityId, field, value) =>
    set((state) => ({
      clientInfo: {
        ...state.clientInfo,
        entities: state.clientInfo.entities.map((entity) =>
          entity.id === entityId ? { ...entity, [field]: value } : entity
        ),
      },
    })),

  updateDiscount: (field, value) =>
    set((state) => ({
      discount: {
        ...state.discount,
        [field]: value,
      },
    })),
}));
