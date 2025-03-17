import {
    UserCheck,
    ClipboardCheck,
    Book,
    ShieldCheck,
    Shield,
    PieChart,
    FileText,
    Scroll,
    Inbox,
    DollarSign,
    Scale,
    BarChart2,
    Code,
    Coins,
    Receipt,
  } from "lucide-react";
  import type React from "react"
  
  // Update the Integration type to include optional file and website fields
  export type Integration = {
    id: string
    name: string
    description: string
    category: string
    icon: React.ComponentType
    color: string
    fileUrl?: string // Optional file URL for download
    websiteUrl?: string // Optional website URL
  }
  
  export const categories = [
    "All",
    "Advisory",
    "Auditing",
    "Bookkeeping",
    "Compliance",
    "Insurance",
    "Investments",
    "Invoicing",
    "Legislation",
    "Lodgements",
    "Payroll",
    "Regulations",
    "Reporting",
    "Software",
    "Superannuation",
    "Taxation",
    
  ]
  
  
  const colorPalette = [
    "#FF4A00",
    "#96BF48",
    "#E37400",
    "#FFE01B",
    "#F06A6A",
    "#FFCC22",
    "#6772E5",
    "#F22F46",
    "#2D8CFF",
    "#0061FF",
    "#00A1E0",
    "#D32D27",
    "#4CAF50",
    "#9C27B0",
    "#FF9800",
    "#795548",
    "#607D8B",
    "#3F51B5",
    "#00BCD4",
    "#FFC107",
  ]
  
  // Function to get a random color from the palette
  function getRandomColor() {
    return colorPalette[Math.floor(Math.random() * colorPalette.length)]
  }
  
  // Create manual integrations for each category
  export const integrations: Integration[] = [
    {
        id: "advisory-1",
        name: "ExpertConnect",
        description:
          "Consult with seasoned professionals across industries to guide strategic decision-making and optimize business outcomes.",
        category: "Advisory",
        icon: UserCheck,
        color: getRandomColor(),
        fileUrl: "/knowledge/advisory/expertconnect-guide.pdf",
        websiteUrl: "https://example.com/expertconnect",
      },
      {
        id: "auditing-1",
        name: "AuditEdge",
        description:
          "Perform thorough internal and external audits with automated compliance checks and real-time reporting.",
        category: "Auditing",
        icon: ClipboardCheck,
        color: getRandomColor(),
        fileUrl: "/knowledge/auditing/auditedge-intro.pdf",
        websiteUrl: "https://example.com/auditedge",
      },
      {
        id: "bookkeeping-1",
        name: "LedgerPlus",
        description:
          "Streamlined bookkeeping solution that simplifies data entry and automates reconciliation.",
        category: "Bookkeeping",
        icon: Book,
        color: getRandomColor(),
        fileUrl: "/knowledge/bookkeeping/ledgerplus-manual.pdf",
        websiteUrl: "https://example.com/ledgerplus",
      },
      {
        id: "compliance-1",
        name: "ReguGuard",
        description:
          "Proactive compliance tracking for regulatory requirements, reducing risk and preventing penalties.",
        category: "Compliance",
        icon: ShieldCheck,
        color: getRandomColor(),
        fileUrl: "/knowledge/compliance/reguguard-checklist.pdf",
        websiteUrl: "https://example.com/reguguard",
      },
      {
        id: "insurance-1",
        name: "SureShield",
        description:
          "Comprehensive insurance management platform for policy tracking, renewals, and claim oversight.",
        category: "Insurance",
        icon: Shield,
        color: getRandomColor(),
        fileUrl: "/knowledge/insurance/sureshield-overview.pdf",
        websiteUrl: "https://example.com/sureshield",
      },
      {
        id: "investments-1",
        name: "InvestiTrack",
        description:
          "Portfolio tracking and risk assessment tool for making data-driven investment decisions.",
        category: "Investments",
        icon: PieChart,
        color: getRandomColor(),
        fileUrl: "/knowledge/investments/investitrack-guide.pdf",
        websiteUrl: "https://example.com/investitrack",
      },
      {
        id: "invoicing-1",
        name: "BillFlow",
        description:
          "Automated invoicing system that streamlines billing cycles with reminders and payment integrations.",
        category: "Invoicing",
        icon: FileText,
        color: getRandomColor(),
        fileUrl: "/knowledge/invoicing/billflow-manual.pdf",
        websiteUrl: "https://example.com/billflow",
      },
      {
        id: "legislation-1",
        name: "LawLight",
        description:
          "Keep track of the latest legislative updates and industry-specific laws to ensure ongoing compliance.",
        category: "Legislation",
        icon: Scroll,
        color: getRandomColor(),
        fileUrl: "/knowledge/legislation/lawlight-ref.pdf",
        websiteUrl: "https://example.com/lawlight",
      },
      {
        id: "lodgements-1",
        name: "LodgeMaster",
        description:
          "Efficiently prepare and submit essential documents and forms to government entities and agencies.",
        category: "Lodgements",
        icon: Inbox,
        color: getRandomColor(),
        fileUrl: "/knowledge/lodgements/lodgemaster-checklist.pdf",
        websiteUrl: "https://example.com/lodgemaster",
      },
      {
        id: "payroll-1",
        name: "PayTrack",
        description:
          "Easily manage payroll operations, timesheets, and employee benefits with automatic tax calculations.",
        category: "Payroll",
        icon: DollarSign,
        color: getRandomColor(),
        fileUrl: "/knowledge/payroll/paytrack-guide.pdf",
        websiteUrl: "https://example.com/paytrack",
      },
      {
        id: "regulations-1",
        name: "StatuteScan",
        description:
          "Stay abreast of changing regulations in your industry with automated alerts and compliance recommendations.",
        category: "Regulations",
        icon: Scale,
        color: getRandomColor(),
        fileUrl: "/knowledge/regulations/statutescan-overview.pdf",
        websiteUrl: "https://example.com/statutescan",
      },
      {
        id: "reporting-1",
        name: "ReportPro",
        description:
          "Customizable reporting engine that aggregates data from multiple sources and visualizes key metrics.",
        category: "Reporting",
        icon: BarChart2,
        color: getRandomColor(),
        fileUrl: "/knowledge/reporting/reportpro-guide.pdf",
        websiteUrl: "https://example.com/reportpro",
      },
      {
        id: "software-1",
        name: "DevFlow",
        description:
          "End-to-end software lifecycle management, from requirements gathering to production deployment.",
        category: "Software",
        icon: Code,
        color: getRandomColor(),
        fileUrl: "/knowledge/software/devflow-documentation.pdf",
        websiteUrl: "https://example.com/devflow",
      },
      {
        id: "superannuation-1",
        name: "SuperPlan",
        description:
          "Track superannuation contributions, optimize fund allocations, and manage retirement portfolios.",
        category: "Superannuation",
        icon: Coins,
        color: getRandomColor(),
        fileUrl: "/knowledge/superannuation/superplan-factsheet.pdf",
        websiteUrl: "https://example.com/superplan",
      },
      {
        id: "taxation-1",
        name: "TaxPro",
        description:
          "Comprehensive tax management solution that handles return filing, credits, and deductions.",
        category: "Taxation",
        icon: Receipt,
        color: getRandomColor(),
        fileUrl: "/knowledge/taxation/taxpro-manual.pdf",
        websiteUrl: "https://example.com/taxpro",
      },
  ]
  
  