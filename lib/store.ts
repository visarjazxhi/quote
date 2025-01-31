import { create } from "zustand";

export interface ServiceOption {
  value: string;
  label: string;
  rate: number; // Rate for this option
}

export interface ServiceWithOptions {
  id: string;
  name: string;
  description: string;
  type: "withOptions";
  options: ServiceOption[];
  selectedOption?: string;
  quantity?: number; // Quantity for the selected option
}

export type Service = ServiceWithOptions; // Only one type of service now

export interface ServiceSection {
  id: string;
  name: string;
  services: Service[];
}

interface EstimationStore {
  sections: ServiceSection[];
  toggleService: (sectionId: string, serviceId: string) => void;
  updateOption: (sectionId: string, serviceId: string, option: string) => void;
  updateQuantity: (sectionId: string, serviceId: string, quantity: number) => void;
  totalCost: () => number;
  addSection: (name: string) => void;
}

export const useEstimationStore = create<EstimationStore>((set, get) => ({
  sections: [
    {
      id: "onboarding",
      name: "Onboarding Services",
      services: [
        {
          id: "client-id",
          name: "Client Id",
          description: "Managing and assigning client identifiers.",
          type: "withOptions",
          options: [{ value: "standard", label: "Standard", rate: 300 },
          { value: "premium", label: "Premium", rate: 600},
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "engagement",
          name: "Engagement",
          description: "Client engagement and interaction services.",
          type: "withOptions",
          options: [{ value: "standard", label: "Standard", rate: 300 },
            { value: "premium", label: "Premium", rate: 600},
            ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "job-flow-management",
          name: "Job Flow Management",
          description: "Managing workflow and job assignments.",
          type: "withOptions",
          options: [{ value: "standard", label: "Standard", rate: 300 },
            { value: "premium", label: "Premium", rate: 600},
            ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "data-collection-review",
          name: "Data Collection & Review",
          description: "Gathering and reviewing client data.",
          type: "withOptions",
          options: [{ value: "standard", label: "Standard", rate: 300 },
            { value: "premium", label: "Premium", rate: 600},
            ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "admin-emails",
          name: "Admin, Emails, Collate Information",
          description: "Handling administrative tasks, emails, and information collation.",
          type: "withOptions",
          options: [{ value: "standard", label: "Standard", rate: 300 },
            { value: "premium", label: "Premium", rate: 600},
            ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "client-meeting",
          name: "Client Meeting",
          description: "Conducting and managing client meetings.",
          type: "withOptions",
          options: [{ value: "standard", label: "Standard", rate: 300 },
            { value: "premium", label: "Premium", rate: 600},
            ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "other",
          name: "Other",
          description: "Additional services as needed.",
          type: "withOptions",
          options: [{ value: "standard", label: "Standard", rate: 300 },
            { value: "premium", label: "Premium", rate: 600},
            ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "client-outboarding",
          name: "Client Out Boarding",
          description: "Handling client offboarding processes.",
          type: "withOptions",
          options: [{ value: "standard", label: "Standard", rate: 300 },
            { value: "premium", label: "Premium", rate: 600},
            ],
          selectedOption: undefined,
          quantity: undefined,
        },
      ],
    },
    {
      id: "fs_preparation",
      name: "Annual FS Preparation",
      services: [
        {
          "id": "annual-accounts-preparation",
          "name": "Annual Accounts Preparation",
          "description": "Preparation of annual financial accounts.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "tax-return-preparation",
          "name": "Tax Return Preparation",
          "description": "Preparation and lodgment of tax returns.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "taxable-payments-report",
          "name": "Taxable Payments Report",
          "description": "Preparation and submission of taxable payments reports.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "workcover-application",
          "name": "Workcover Application Only",
          "description": "Assistance with Workcover application.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "payroll-tax-lodgement",
          "name": "Payroll Tax Lodgement & Reconciliation",
          "description": "Processing and lodging payroll tax reconciliation.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "admin-emails-reports",
          "name": "Admin, Emails, ATO, IAA, ASIC Reports",
          "description": "Administrative support including email management and regulatory reporting.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "ato-liaison",
          "name": "ATO Liaison",
          "description": "Communication and liaison with the Australian Taxation Office.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "correspondence",
          "name": "Correspondence",
          "description": "Handling business correspondence and communication.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "annual-accounts-review",
          "name": "Annual Accounts Review",
          "description": "Review of financial accounts and reports.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "client-meeting",
          "name": "Client Meeting",
          "description": "Business consultation and strategy meeting with clients.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "other",
          "name": "Other",
          "description": "Any other additional services required.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "client-outboarding",
          "name": "Client Out Boarding",
          "description": "Handling client transitions and offboarding processes.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
      ],
    },
    {
      id: "Corporate Secretarial Services",
      name: "Corporate Secretarial Services",
      services: [
        {
          "id": "annual-review",
          "name": "Annual Review",
          "description": "Review of annual reports and compliance documents.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "other-asic-administration",
          "name": "Other ASIC Administration",
          "description": "Handling other administrative tasks related to ASIC compliance.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "client-meeting",
          "name": "Client Meeting",
          "description": "Consultation and advisory meetings with clients.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        },
        {
          "id": "client-outboarding",
          "name": "Client Out Boarding",
          "description": "Managing the transition and offboarding of clients.",
          "type": "withOptions",
          "options": [
            { "value": "standard", "label": "Standard", "rate": 300 },
            { "value": "premium", "label": "Premium", "rate": 600 }
          ],
          "selectedOption": undefined,
          "quantity": undefined
        }
      ],
    },
    {
  id: "",
  name: "",
  services: [
    {
      id: "",
      name: " ",
      description: " ",
      type: "withOptions",
      options: [{ value: "standard", label: "Standard", rate: 300 },
        { value: "premium", label: "Premium", rate: 600},
        ],
      selectedOption: undefined,
      quantity: undefined,
    },
  ],
},

    // Add other sections and services as needed
// Empty Service
// {
//   id: "",
//   name: "",
//   services: [
//     {
//       id: "",
//       name: " ",
//       description: " ",
//       type: "withOptions",
//       options: [{ value: "standard", label: "Standard", rate: 300 },
//         { value: "premium", label: "Premium", rate: 600},
//         ],
//       selectedOption: undefined,
//       quantity: undefined,
//     },
//   ],
// },



  ],
  toggleService: (sectionId, serviceId) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              services: section.services.map((service) =>
                service.id === serviceId
                  ? {
                      ...service,
                      selectedOption: service.selectedOption === undefined ? service.options[0].value : undefined,
                      quantity: service.quantity === undefined ? 1 : undefined, // Default quantity to 1
                    }
                  : service,
              ),
            }
          : section,
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
                  : service,
              ),
            }
          : section,
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
                  ? { ...service, quantity: quantity >= 0 ? quantity : 1 } // Prevent negative quantities
                  : service,
              ),
            }
          : section,
      ),
    })),
  totalCost: () => {
    const { sections } = get();
    return sections.reduce((sectionTotal, section) => {
      return (
        sectionTotal +
        section.services.reduce((serviceTotal, service) => {
          if (service.type === "withOptions" && service.selectedOption && service.quantity) {
            const selectedOption = service.options.find((opt) => opt.value === service.selectedOption);
            if (selectedOption) {
              return serviceTotal + selectedOption.rate * service.quantity; // Rate * Quantity
            }
          }
          return serviceTotal;
        }, 0)
      );
    }, 0);
  },
  addSection: (name) =>
    set((state) => ({
      sections: [...state.sections, { id: Date.now().toString(), name, services: [] }],
    })),
}));