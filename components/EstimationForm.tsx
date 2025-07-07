"use client";

import ClientInfoForm from "./ClientInfoForm";
import ClientWrapper from "./ClientWrapper";
import ServiceCard from "./ServiceCard";
import SummaryCard from "./SummaryCard";
import { motion } from "framer-motion";

// Service data structure
const serviceData = [
  {
    id: "admin",
    title: "Administration",
    services: [
      {
        id: "client-id",
        name: "Client ID",
        description: "Managing and assigning client identifiers.",
        basePrice: 50,
        category: "admin",
        timeEstimate: "30 mins",
        complexity: "Low" as const,
      },
      {
        id: "xero-setup",
        name: "Set up on XPM",
        description: "Setting up client accounts on Xero Practice Manager.",
        basePrice: 100,
        category: "admin",
        timeEstimate: "1 hour",
        complexity: "Medium" as const,
      },
      {
        id: "ato-nomination",
        name: "ATO Nomination",
        description: "Nomination on ATO as the client's tax agent.",
        basePrice: 75,
        category: "admin",
        timeEstimate: "45 mins",
        complexity: "Low" as const,
      },
      {
        id: "asic-onboarding",
        name: "ASIC Onboarding",
        description: "Onboarding clients with the ASIC",
        basePrice: 150,
        category: "admin",
        timeEstimate: "2 hours",
        complexity: "High" as const,
      },
      {
        id: "engagement",
        name: "Engagement",
        description: "Client engagement and interaction services.",
        basePrice: 200,
        category: "admin",
        timeEstimate: "3 hours",
        complexity: "Medium" as const,
      },
      {
        id: "job-flow-management",
        name: "Job Flow Management",
        description: "Managing workflow and job assignments.",
        basePrice: 120,
        category: "admin",
        timeEstimate: "2 hours",
        complexity: "Medium" as const,
      },
      {
        id: "data-collection-review",
        name: "Data Collection & Review",
        description: "Gathering and reviewing client data.",
        basePrice: 80,
        category: "admin",
        timeEstimate: "1.5 hours",
        complexity: "Low" as const,
      },
      {
        id: "cleardocs",
        name: "New client - Cleardocs",
        description: "Setting up new clients from Cleardocs.",
        basePrice: 100,
        category: "admin",
        timeEstimate: "1 hour",
        complexity: "Medium" as const,
      },
    ],
  },
  {
    id: "applications",
    title: "Applications",
    services: [
      {
        id: "abn-application",
        name: "ABN Application",
        description: "Applying for an Australian Business Number (ABN).",
        basePrice: 150,
        category: "applications",
        timeEstimate: "2 hours",
        complexity: "Medium" as const,
      },
      {
        id: "tfn-application",
        name: "TFN Application",
        description: "Applying for a Tax File Number (TFN).",
        basePrice: 100,
        category: "applications",
        timeEstimate: "1 hour",
        complexity: "Low" as const,
      },
      {
        id: "gst-application",
        name: "GST Application",
        description: "Applying for Goods and Services Tax (GST) registration.",
        basePrice: 200,
        category: "applications",
        timeEstimate: "2.5 hours",
        complexity: "Medium" as const,
      },
      {
        id: "stamp-duty-application",
        name: "Stamp Duty Application",
        description: "Applying for stamp duty on State Revenue Office (SRO).",
        basePrice: 250,
        category: "applications",
        timeEstimate: "3 hours",
        complexity: "High" as const,
      },
    ],
  },
  {
    id: "fs_preparation",
    title: "Financial Statement Preparation",
    services: [
      {
        id: "annual-accounts-preparation",
        name: "Annual Accounts Preparation",
        description: "Preparation of annual financial accounts.",
        basePrice: 500,
        category: "fs_preparation",
        timeEstimate: "8 hours",
        complexity: "High" as const,
      },
      {
        id: "tax-return-preparation",
        name: "Tax Return Preparation",
        description: "Preparation and lodgment of tax returns.",
        basePrice: 300,
        category: "fs_preparation",
        timeEstimate: "5 hours",
        complexity: "Medium" as const,
      },
      {
        id: "taxable-payments-report",
        name: "Taxable Payments Report",
        description: "Preparation and submission of taxable payments reports.",
        basePrice: 150,
        category: "fs_preparation",
        timeEstimate: "2 hours",
        complexity: "Medium" as const,
      },
      {
        id: "workcover-application",
        name: "Workcover Application Only",
        description: "Assistance with Workcover application.",
        basePrice: 200,
        category: "fs_preparation",
        timeEstimate: "3 hours",
        complexity: "Medium" as const,
      },
      {
        id: "payroll-tax-lodgement",
        name: "Payroll Tax Lodgement & Reconciliation",
        description: "Processing and lodging payroll tax reconciliation.",
        basePrice: 250,
        category: "fs_preparation",
        timeEstimate: "4 hours",
        complexity: "High" as const,
      },
      {
        id: "admin-emails-reports",
        name: "Admin, Emails, ATO, IAA, ASIC Reports",
        description:
          "Administrative support including email management and reports.",
        basePrice: 180,
        category: "fs_preparation",
        timeEstimate: "3 hours",
        complexity: "Medium" as const,
      },
      {
        id: "ato-liaison",
        name: "ATO Liaison",
        description:
          "Communication and liaison with the Australian Taxation Office.",
        basePrice: 120,
        category: "fs_preparation",
        timeEstimate: "2 hours",
        complexity: "Medium" as const,
      },
      {
        id: "correspondence",
        name: "Correspondence",
        description: "Handling business correspondence and communication.",
        basePrice: 80,
        category: "fs_preparation",
        timeEstimate: "1.5 hours",
        complexity: "Low" as const,
      },
      {
        id: "annual-accounts-review",
        name: "Annual Accounts Review",
        description: "Review of financial accounts and reports.",
        basePrice: 400,
        category: "fs_preparation",
        timeEstimate: "6 hours",
        complexity: "High" as const,
      },
      {
        id: "client-meeting",
        name: "Client Meeting",
        description: "Business consultation and strategy meeting with clients.",
        basePrice: 150,
        category: "fs_preparation",
        timeEstimate: "2 hours",
        complexity: "Medium" as const,
      },
      {
        id: "other",
        name: "Other",
        description: "Any other additional services required.",
        basePrice: 100,
        category: "fs_preparation",
        timeEstimate: "Variable",
        complexity: "Medium" as const,
      },
      {
        id: "client-outboarding",
        name: "Client Out Boarding",
        description: "Handling client transitions and offboarding processes.",
        basePrice: 200,
        category: "fs_preparation",
        timeEstimate: "3 hours",
        complexity: "Medium" as const,
      },
    ],
  },
  {
    id: "Corporate Secretarial Services",
    title: "Corporate Secretarial",
    services: [
      {
        id: "annual-review",
        name: "Annual Review",
        description: "Review of annual reports and compliance documents.",
        basePrice: 300,
        category: "Corporate Secretarial",
        timeEstimate: "4 hours",
        complexity: "High" as const,
      },
      {
        id: "other-asic-administration",
        name: "Other ASIC Administration",
        description:
          "Handling other administrative tasks related to ASIC compliance.",
        basePrice: 150,
        category: "Corporate Secretarial",
        timeEstimate: "2 hours",
        complexity: "Medium" as const,
      },
      {
        id: "client-meeting",
        name: "Client Meeting",
        description: "Consultation and advisory meetings with clients.",
        basePrice: 150,
        category: "Corporate Secretarial",
        timeEstimate: "2 hours",
        complexity: "Medium" as const,
      },
      {
        id: "client-outboarding",
        name: "Client Out Boarding",
        description: "Managing the transition and offboarding of clients.",
        basePrice: 200,
        category: "Corporate Secretarial",
        timeEstimate: "3 hours",
        complexity: "Medium" as const,
      },
    ],
  },
  {
    id: "Activity Statement Preparation ",
    title: "Activity Statements",
    services: [
      {
        id: "monthly-bas-gst-reconciliation",
        name: "Monthly BAS incl. GST Reconciliation",
        description:
          "Preparation and lodgment of monthly Business Activity Statements.",
        basePrice: 200,
        category: "Activity Statements",
        timeEstimate: "3 hours",
        complexity: "Medium" as const,
      },
      {
        id: "quarterly-bas-gst-reconciliation",
        name: "Quarterly BAS incl. GST Reconciliation",
        description:
          "Preparation and lodgment of quarterly Business Activity Statements.",
        basePrice: 150,
        category: "Activity Statements",
        timeEstimate: "2.5 hours",
        complexity: "Medium" as const,
      },
      {
        id: "ias-preparation",
        name: "IAS Preparation",
        description:
          "Preparation and lodgment of Instalment Activity Statements.",
        basePrice: 100,
        category: "Activity Statements",
        timeEstimate: "1.5 hours",
        complexity: "Low" as const,
      },
      {
        id: "other-as-administration",
        name: "Other AS Administration",
        description:
          "Handling other administrative tasks related to Activity Statements.",
        basePrice: 120,
        category: "Activity Statements",
        timeEstimate: "2 hours",
        complexity: "Medium" as const,
      },
      {
        id: "client-outboarding",
        name: "Client Out Boarding",
        description: "Managing the transition and offboarding of clients.",
        basePrice: 200,
        category: "Activity Statements",
        timeEstimate: "3 hours",
        complexity: "Medium" as const,
      },
    ],
  },
  {
    id: "Bookkeeping ",
    title: "Bookkeeping Services",
    services: [
      {
        id: "bookkeeping-ar-ap-journal-reports",
        name: "Bookkeeping - AR, AP, Journal, Reports etc",
        description:
          "Managing accounts receivable, accounts payable, journals, and reports.",
        basePrice: 400,
        category: "Bookkeeping Services",
        timeEstimate: "6 hours",
        complexity: "High" as const,
      },
      {
        id: "bookkeeping-bank-reconciliation",
        name: "Bookkeeping - Bank Reconciliation",
        description:
          "Reconciling bank transactions to ensure accuracy in financial records.",
        basePrice: 150,
        category: "Bookkeeping Services",
        timeEstimate: "2 hours",
        complexity: "Medium" as const,
      },
      {
        id: "bookkeeping-attendance-general",
        name: "Bookkeeping Attendance - General",
        description: "General bookkeeping attendance and support.",
        basePrice: 100,
        category: "Bookkeeping Services",
        timeEstimate: "1.5 hours",
        complexity: "Low" as const,
      },
      {
        id: "data-entry-bank-coding-reconciliation",
        name: "Data Entry and Bank Coding and Reconciliation",
        description:
          "Processing data entry, bank transaction coding, and reconciliation.",
        basePrice: 120,
        category: "Bookkeeping Services",
        timeEstimate: "2 hours",
        complexity: "Medium" as const,
      },
      {
        id: "payroll-process-aba-file",
        name: "Payroll Process and ABA File Preparation",
        description:
          "Processing payroll and preparing ABA files for direct payments.",
        basePrice: 200,
        category: "Bookkeeping Services",
        timeEstimate: "3 hours",
        complexity: "Medium" as const,
      },
      {
        id: "stp-filing",
        name: "STP Filing",
        description:
          "Processing and lodging Single Touch Payroll (STP) reports.",
        basePrice: 80,
        category: "Bookkeeping Services",
        timeEstimate: "1 hour",
        complexity: "Low" as const,
      },
      {
        id: "super-process-lodgement",
        name: "Super Process and Lodgement",
        description:
          "Processing and lodging superannuation payments for employees.",
        basePrice: 150,
        category: "Bookkeeping Services",
        timeEstimate: "2 hours",
        complexity: "Medium" as const,
      },
      {
        id: "xero-bookkeeping-support",
        name: "Xero Bookkeeping Support",
        description:
          "Providing support and assistance for Xero bookkeeping tasks.",
        basePrice: 100,
        category: "Bookkeeping Services",
        timeEstimate: "1.5 hours",
        complexity: "Low" as const,
      },
      {
        id: "xero-setup",
        name: "Xero Setup",
        description:
          "Setting up Xero accounts and configurations for businesses.",
        basePrice: 200,
        category: "Bookkeeping Services",
        timeEstimate: "3 hours",
        complexity: "High" as const,
      },
      {
        id: "xero-training",
        name: "Xero Training",
        description: "Providing training sessions on using Xero effectively.",
        basePrice: 150,
        category: "Bookkeeping Services",
        timeEstimate: "2 hours",
        complexity: "Medium" as const,
      },
      {
        id: "accounts-payable-batch-preparation",
        name: "Accounts Payable and Batch Preparation",
        description:
          "Processing accounts payable and preparing batch payments.",
        basePrice: 120,
        category: "Bookkeeping Services",
        timeEstimate: "2 hours",
        complexity: "Medium" as const,
      },
      {
        id: "accounts-receivable-debt-reconciliation",
        name: "Accounts Receivable and Outstanding Debt Reconciliation",
        description:
          "Managing accounts receivable and reconciling outstanding debts.",
        basePrice: 150,
        category: "Bookkeeping Services",
        timeEstimate: "2.5 hours",
        complexity: "Medium" as const,
      },
    ],
  },
  {
    id: "financial-planning",
    title: "Financial Advisory",
    services: [
      {
        id: "retirement-planning",
        name: "Retirement Planning",
        description:
          "Comprehensive strategies to help you achieve a comfortable retirement.",
        basePrice: 500,
        category: "financial-advisory",
        timeEstimate: "4-6 hours",
        complexity: "High" as const,
      },
      {
        id: "investment-advisory",
        name: "Investment Advisory",
        description:
          "Guidance on investment strategies, portfolio management, and risk assessment.",
        basePrice: 400,
        category: "financial-advisory",
        timeEstimate: "3-4 hours",
        complexity: "High" as const,
      },
      {
        id: "superannuation-strategies",
        name: "Superannuation Strategies",
        description:
          "Maximizing your superannuation contributions and tax benefits.",
        basePrice: 350,
        category: "financial-advisory",
        timeEstimate: "3 hours",
        complexity: "Medium" as const,
      },
      {
        id: "tax-effective-investing",
        name: "Tax-Effective Investing",
        description:
          "Structuring your investments to minimize tax liabilities.",
        basePrice: 300,
        category: "financial-advisory",
        timeEstimate: "2-3 hours",
        complexity: "Medium" as const,
      },
      {
        id: "estate-planning",
        name: "Estate Planning",
        description:
          "Ensuring a smooth transfer of wealth through wills, trusts, and estate structures.",
        basePrice: 600,
        category: "financial-advisory",
        timeEstimate: "5-7 hours",
        complexity: "High" as const,
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function EstimationForm() {
  return (
    <ClientWrapper
      fallback={
        <div
          className="container mx-auto p-6 space-y-6"
          suppressHydrationWarning
        >
          <div className="animate-pulse space-y-4" suppressHydrationWarning>
            <div
              className="h-8 bg-muted rounded w-1/3"
              suppressHydrationWarning
            />
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              suppressHydrationWarning
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-muted rounded"
                  suppressHydrationWarning
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto p-6"
        suppressHydrationWarning
      >
        <div className="space-y-6" suppressHydrationWarning>
          <ClientInfoForm />

          <div
            className="grid grid-cols-1 xl:grid-cols-4 gap-4"
            suppressHydrationWarning
          >
            <div
              className="col-span-1 xl:col-span-3 space-y-8"
              suppressHydrationWarning
            >
              {serviceData.map((section) => (
                <motion.div
                  key={section.id}
                  variants={sectionVariants}
                  className="mb-8"
                  suppressHydrationWarning
                >
                  <h2
                    className="text-2xl font-bold mb-6 text-primary"
                    suppressHydrationWarning
                  >
                    {section.title}
                  </h2>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    suppressHydrationWarning
                  >
                    {section.services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        sectionId={section.id}
                        service={service}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="col-span-1" suppressHydrationWarning>
              <SummaryCard />
            </div>
          </div>
        </div>
      </motion.div>
    </ClientWrapper>
  );
}
