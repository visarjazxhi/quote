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

// export type Service = ServiceWithOptions; // Only one type of service now
export type Service = ServiceWithOptions | ServiceWithFixedCost; // Add the new type

export interface ServiceSection {
  id: string;
  name: string;
  services: Service[];
}

export interface ServiceWithFixedCost {
  id: string;
  name: string;
  description: string;
  type: "fixedCost"; // New type for fixed costs
  value?: number; // The fixed cost value input by the user
}


interface EstimationStore {
  sections: ServiceSection[];
  toggleService: (sectionId: string, serviceId: string) => void;
  updateOption: (sectionId: string, serviceId: string, option: string) => void;
  updateQuantity: (sectionId: string, serviceId: string, quantity: number) => void;
  updateFixedCost: (sectionId: string, serviceId: string, value: number) => void; // New function
  totalCost: () => number;
  addSection: (name: string) => void;
}

export const useEstimationStore = create<EstimationStore>((set, get) => ({
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
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "xero-setup",
          name: "Set up on XPM",
          description: "Setting up client accounts on Xero Practice Manager.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "ato-nomination",
          name: "ATO Nomination",
          description: "Nomination on ATO as the client's tax agent.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "asic-onboarding",
          name: "ASIC Onboarding",
          description: "Onboarding clients with the ASIC",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "engagement",
          name: "Engagement",
          description: "Client engagement and interaction services.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "job-flow-management",
          name: "Job Flow Management",
          description: "Managing workflow and job assignments.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "data-collection-review",
          name: "Data Collection & Review",
          description: "Gathering and reviewing client data.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "cleardocs",
          name: "New client - Cleardocs",
          description: "Setting up new clients from Cleardocs.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
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
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "tfn-application",
          name: "TFN Application",
          description: "Applying for a Tax File Number (TFN).",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "gst-application",
          name: "GST Application",
          description:
            "Applying for Goods and Services Tax (GST) registration.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "stamp-duty-application",
          name: "Stamp Duty Application",
          description: "Applying for stamp duty on State Revenue Office (SRO).",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
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
          id: "annual-accounts-preparation",
          name: "Annual Accounts Preparation",
          description: "Preparation of annual financial accounts.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "tax-return-preparation",
          name: "Tax Return Preparation",
          description: "Preparation and lodgment of tax returns.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "taxable-payments-report",
          name: "Taxable Payments Report",
          description:
            "Preparation and submission of taxable payments reports.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "workcover-application",
          name: "Workcover Application Only",
          description: "Assistance with Workcover application.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "payroll-tax-lodgement",
          name: "Payroll Tax Lodgement & Reconciliation",
          description: "Processing and lodging payroll tax reconciliation.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "admin-emails-reports",
          name: "Admin, Emails, ATO, IAA, ASIC Reports",
          description:
            "Administrative support including email management and regulatory reporting.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "ato-liaison",
          name: "ATO Liaison",
          description:
            "Communication and liaison with the Australian Taxation Office.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "correspondence",
          name: "Correspondence",
          description: "Handling business correspondence and communication.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "annual-accounts-review",
          name: "Annual Accounts Review",
          description: "Review of financial accounts and reports.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "client-meeting",
          name: "Client Meeting",
          description:
            "Business consultation and strategy meeting with clients.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "other",
          name: "Other",
          description: "Any other additional services required.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "client-outboarding",
          name: "Client Out Boarding",
          description: "Handling client transitions and offboarding processes.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
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
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "other-asic-administration",
          name: "Other ASIC Administration",
          description:
            "Handling other administrative tasks related to ASIC compliance.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "client-meeting",
          name: "Client Meeting",
          description: "Consultation and advisory meetings with clients.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "client-outboarding",
          name: "Client Out Boarding",
          description: "Managing the transition and offboarding of clients.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
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
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "quarterly-bas-gst-reconciliation",
          name: "Quarterly BAS incl. GST Reconciliation",
          description:
            "Preparation and lodgment of quarterly Business Activity Statements including GST reconciliation.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "ias-preparation",
          name: "IAS Preparation",
          description:
            "Preparation and lodgment of Instalment Activity Statements.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "other-as-administration",
          name: "Other AS Administration",
          description:
            "Handling other administrative tasks related to Activity Statements.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "client-outboarding",
          name: "Client Out Boarding",
          description: "Managing the transition and offboarding of clients.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
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
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "bookkeeping-bank-reconciliation",
          name: "Bookkeeping - Bank Reconciliation",
          description:
            "Reconciling bank transactions to ensure accuracy in financial records.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "bookkeeping-attendance-general",
          name: "Bookkeeping Attendance - General",
          description: "General bookkeeping attendance and support.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "data-entry-bank-coding-reconciliation",
          name: "Data Entry and Bank Coding and Reconciliation",
          description:
            "Processing data entry, bank transaction coding, and reconciliation.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "payroll-process-aba-file",
          name: "Payroll Process and ABA File Preparation",
          description:
            "Processing payroll and preparing ABA files for direct payments.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "stp-filing",
          name: "STP Filing",
          description:
            "Processing and lodging Single Touch Payroll (STP) reports.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "super-process-lodgement",
          name: "Super Process and Lodgement",
          description:
            "Processing and lodging superannuation payments for employees.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "xero-bookkeeping-support",
          name: "Xero Bookkeeping Support",
          description:
            "Providing support and assistance for Xero bookkeeping tasks.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "xero-setup",
          name: "Xero Setup",
          description:
            "Setting up Xero accounts and configurations for business needs.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "xero-training",
          name: "Xero Training",
          description: "Providing training sessions on using Xero effectively.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "accounts-payable-batch-preparation",
          name: "Accounts Payable and Batch Preparation",
          description:
            "Processing accounts payable and preparing batch payments.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
        },
        {
          id: "accounts-receivable-debt-reconciliation",
          name: "Accounts Receivable and Outstanding Debt Reconciliation",
          description:
            "Managing accounts receivable and reconciling outstanding debts.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined,
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
          description: "Comprehensive strategies to help you achieve a comfortable and secure retirement.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined
        },
        {
          id: "investment-advisory",
          name: "Investment Advisory",
          description: "Guidance on investment strategies, portfolio management, and risk assessment.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined
        },
        {
          id: "superannuation-strategies",
          name: "Superannuation Strategies",
          description: "Maximizing your superannuation contributions and tax benefits for long-term wealth building.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined
        },
        {
          id: "tax-effective-investing",
          name: "Tax-Effective Investing",
          description: "Structuring your investments to minimize tax liabilities and maximize returns.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined
        },
        {
          id: "estate-planning",
          name: "Estate Planning",
          description: "Ensuring a smooth transfer of wealth through wills, trusts, and tax-efficient strategies.",
          type: "withOptions",
          options: [
            { value: "admin", label: "Admin", rate: 75 },
            { value: "junior", label: "Junior Accountant", rate: 100 },
            { value: "standard", label: "Standart", rate: 150 },
            { value: "intermediate", label: "Intermediate Accountant", rate: 200 },
            { value: "senior", label: "Senior Manager", rate: 400 },
            { value: "partner", label: "Partner", rate: 600 },
          ],
          selectedOption: undefined,
          quantity: undefined
        }
      ],
    },

        {
      id: "fixed-costs",
      name: "Adjustments",
      services: [
        {
          id: "fixed-cost-1",
          name: "Additional Fixed Cost",
          description: "Any additional fixed cost.",
          type: "fixedCost",
          value: undefined, // Initially undefined
        },
        {
          id: "fixed-cost-2",
          name: "Discounts",
          description: "Enter a negative amount for a discount.",
          type: "fixedCost",
          value: undefined, // Initially undefined
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
    //       options: [{ value: "junior", label: "Junior Accountant", rate: 75 },
    //       { value: "standard", label: "Standard", rate: 150},
    //       { value: "senior", label: "Senior Accountant", rate: 300},
    //       { value: "partner", label: "Partner Rate", rate: 600},
    //       ],
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
                  ? service.type === "withOptions"
                    ? {
                        ...service,
                        selectedOption:
                          service.selectedOption === undefined
                            ? service.options[0].value
                            : undefined,
                        quantity: service.quantity === undefined ? 1 : undefined,
                      }
                    : service.type === "fixedCost"
                    ? {
                        ...service,
                        value: service.value === undefined ? 0 : undefined, // Default to 0
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
  updateFixedCost: (sectionId, serviceId, value) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              services: section.services.map((service) =>
                service.id === serviceId && service.type === "fixedCost"
                  ? { ...service, value: value} // >= 0 ? value : 0 } // Prevent negative values
                  : service
              ),
            }
          : section
      ),
    })),
  totalCost: () => {
    const { sections } = get();
    return sections.reduce((sectionTotal, section) => {
      return (
        sectionTotal +
        section.services.reduce((serviceTotal, service) => {
          if (service.type === "withOptions" && service.selectedOption && service.quantity) {
            const selectedOption = service.options.find(
              (opt) => opt.value === service.selectedOption
            );
            if (selectedOption) {
              return serviceTotal + selectedOption.rate * service.quantity; // Rate * Quantity
            }
          } else if (service.type === "fixedCost" && service.value !== undefined) {
            return serviceTotal + service.value; // Add fixed cost value
          }
          return serviceTotal;
        }, 0)
      );
    }, 0);
  },
  addSection: (name) =>
    set((state) => ({
      sections: [
        ...state.sections,
        { id: Date.now().toString(), name, services: [] },
      ],
    })),
}));
