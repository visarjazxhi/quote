import {
  CloudUpload,
  Globe,
  MonitorCog,
  PersonStanding,
  PiggyBank,
  UserRoundCheck
  

} from "lucide-react"
import type React from "react"

// Define types for files and links
export type FileAttachment = {
  name: string
  url: string
  type?: string // Optional type for icon selection
}

export type WebsiteLink = {
  name: string
  url: string
}

// Update the Integration type to include arrays of files and links
export type Integration = {
  id: string
  name: string
  description: string
  category: string
  icon: React.ComponentType
  color: string
  files?: FileAttachment[] // Array of file attachments
  links?: WebsiteLink[] // Array of website links
}

export const categories = [
  "All",
  "Admin Templates",
  "Advisory",
  "Auditing",
  "Bookkeeping",
  "Calculators",
  "Compliance",
  "Insurance",
  "Investments",
  "Invoicing",
  "Legislation",
  "Lodgements",
  "Payroll",
  "Practice Management",
  "Regulations",
  "Reporting",
  "Software",
  "Superannuation",
  "Taxation",
  "Useful Links",
]



const colorPalette = [
  "#FF4A00",
  "#96BF48",
  "#E37400",
  // "#FFE01B",
  "#F06A6A",
  // "#FFCC22",
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

  //TEMPLATE
  // {
  //   id: "",
  //   name: "",
  //   description:
  //     "",
  //   category: "",
  //   icon: ,
  //   color: getRandomColor(),
  //   files: [
  //     { name: "", url: "", type: "" },
  //     { name: "", url: "", type: "" },
  //   ],
  //   links: [
  //     { name: "", url: "" },
  //     { name: "", url: "" },
  //   ],
  // },

  // Advisory Template Section



  // Auditing Template Section
  // Admin Templates Section
  {
    id: "admin-templates-1",
    name: "Client Setup - Admin Tasks",
    description:
      "This is a template for setting up a new client in our systems. It includes a list of admin tasks that need to be completed.",
    category: "Admin Templates",
    icon: PersonStanding,
    color: getRandomColor(),
    files: [
      { name: "Admin Tasks.pdf", url: "knowledge/Admin Templates/Admin Tasks-2.pdf", type: "pdf" },
    ],

  },
  {
    id: "admin-templates-2",
    name: "Agent Nomination Instructions - Integritas",
    description:
      "This document provides instructions for nominating Integritas as your tax agent. It includes a list of tasks that need to be completed.",
    category: "Admin Templates",
    icon: PersonStanding,
    color: getRandomColor(),
    files: [
      { name: "IAA-Agent Nomination Instructions", url: "knowledge/Admin Templates/Agent Nomination - Integritas.pdf", type: "pdf" },
    ],

  },
  {
    id: "admin-templates-3",
    name: "Agent Nomination Instructions - Taxtalk",
    description:
      "This document provides instructions for nominating Taxtalk as your tax agent. It includes a list of tasks that need to be completed.",
    category: "Admin Templates",
    icon: PersonStanding,
    color: getRandomColor(),
    files: [
      { name: "TT-Agent Nomination Instructions", url: "knowledge/Admin Templates/Agent Nomination - Taxtalk.pdf", type: "pdf" },
    ],

  },
  {
    id: "admin-templates-4",
    name: "ATO Correspondence Instructions",
    description:
      "These are the instructions for managing ATO correspondence. It includes the process that the client needs to follow when they receive a letter from the ATO.",
    category: "Admin Templates",
    icon: PersonStanding,
    color: getRandomColor(),
    files: [
      { name: "ATO correspondence- How you will receive it.pdf", url: "knowledge/Admin Templates/ATO correspondence- How you will receive it.pdf", type: "pdf" },
    ],

  },
  // Bookkeeping Template Section
  // Calculators Template Section
  // Compliance Template Section
  {
    id: "compliance-1",
    name: "ASIC 201 - Company Registration Form",
    description:
      "This is the ASIC Form 201 for registering a company. It also includes the instructions to complete the form in a fillable PDF format.",
    category: "Compliance",
    icon: UserRoundCheck,
    color: getRandomColor(),
    files: [
      { name: "ASIC 201 Application Form.pdf", url: "knowledge/Compliance/ASIC 201 Application Form.pdf", type: "pdf" },
      { name: "Instruction - ASIC 201 Application Form.pdf", url: "knowledge/Compliance/Instructions - ASIC 201 Application Form.pdf", type: "pdf" },

    ],

  },
  // Insurance Template Section
  // Investments Template Section
  // Invoicing Template Section
  // Legislation Template Section
  // Lodgements Template Section
  {
    id: "lodgements-1",
    name: "Agent Deferral Application",
    description:
      "This is the form to apply for a deferral of lodgement of activity statements or other forms.",
    category: "Lodgements",
    icon: CloudUpload,
    color: getRandomColor(),
    files: [
      { name: "Agent Deferral Application.xlsx", url: "knowledge/Lodgements/Agent Deferral Application.xlsx", type: "xlsx" },

    ],

  },
  // Payroll Template Section
  // Practice Management Template Section
  {
    id: "practice-management-1",
    name: "Xero Practice Manager",
    description:
      "Xero Practice Manager is a powerful tool for managing your practice. Click here to access the XPM login page.",
    category: "Practice Management",
    icon: MonitorCog,
    color: getRandomColor(),
    links: [
      { name: "Open XPM", url: "https://app.practicemanager.xero.com/my/overview.aspx" },
    ],
  },
  {
    id: "practice-management-2",
    name: "ATO Agent Portal",
    description:
      "Manage your clients and lodgements through the ATO Agent Portal.",
    category: "Practice Management",
    icon: MonitorCog,
    color: getRandomColor(),
    links: [
      { name: "Open Agent Portal", url: "https://onlineservices.ato.gov.au/onlineservices/home.aspx#agentSelector" },
    ],
  },
  {
    id: "practice-management-3",
    name: "ATO SmartDocs",
    description:
      "ATO Smartdocs is a tool to help you create and manage your client documents and correspondence with the ATO.", 
    category: "Practice Management",
    icon: MonitorCog,
    color: getRandomColor(),
    links: [
      { name: "Open ATO SmartDocs", url: "https://login.ipracticehub.com/" },
    ],
  },
  {
    id: "practice-management-4",
    name: "ASIC Connect",
    description:
      "Access the ASIC Connect portal to manage your company registrations and lodgements.",
    category: "Practice Management",
    icon: MonitorCog,
    color: getRandomColor(),
    links: [
      { name: "Access ASIC", url: "https://asic.gov.au/online-services/registered-agents/" },
    ],
  },
  {
    id: "practice-management-5",
    name: "ABN Lookup",
    description:
      "Search the ABN Lookup database to find ABN details for Australian businesses.",
    category: "Practice Management",
    icon: MonitorCog,
    color: getRandomColor(),
    links: [
      { name: "Open ABN Lookup", url: "https://abr.business.gov.au/" },
    ],
  },
  {
    id: "practice-management-6",
    name: "Ignition",
    description:
      "Ignition is a tool to help you manage your client engagements and create proposals.",
    category: "Practice Management",
    icon: MonitorCog,
    color: getRandomColor(),
    links: [
      { name: "Open Ignition", url: "https://www.ignitionapp.com/" },
    ],
  },
  {
    id: "practice-management-7",
    name: "Castle Corp",
    description:
      "Castle Corporate is Australia’s trusted supplier of legal structures. Accountants, financial planners and advisors rely on us to propel their practices and reduce risk.",
    category: "Practice Management",
    icon: MonitorCog,
    color: getRandomColor(),
    links: [
      { name: "Open CastleCorp", url: "https://www.castlecorp.com.au/" },
    ],
  },
  {
    id: "practice-management-8",
    name: "Syft Analytics",
    description:
      "Syft Analytics is used by accountants and advisors to provide insights into their clients' financial data.",
    category: "Practice Management",
    icon: MonitorCog,
    color: getRandomColor(),
    links: [
      { name: "Open SyftAnalytics", url: "https://www.syftanalytics.com/" },
    ],
  },
  {
    id: "practice-management-9",
    name: "Dext",
    description:
      "Dext is used to automate data extraction and categorisation for your clients' financial documents.",
    category: "Practice Management",
    icon: MonitorCog,
    color: getRandomColor(),
    links: [
      { name: "Open Dext", url: "https://dext.com/au" },
    ],
  },
  {
    id: "practice-management-10",
    name: "SuiteFiles",
    description:
      "SuiteFiles is a cloud-based document management system that will help you organise and share your files.",
    category: "Practice Management",
    icon: MonitorCog,
    color: getRandomColor(),
    links: [
      { name: "Open SuiteFiles", url: "https://taxtalkaus.sharepoint.com/" },
    ],
  },
  {
    id: "practice-management-11",
    name: "CAS 360",
    description:
      "CAS 360 is a cloud-based company compliance software that will help you manage your company compliance.",
    category: "Practice Management",
    icon: MonitorCog,
    color: getRandomColor(),
    links: [
      { name: "Open CAS360", url: "https://cas360.com/" },
    ],
  },
  {
    id: "practice-management-12",
    name: "FuseSign",
    description:
      "FuseSign is a digital signature tool that will help you get documents signed quickly and securely.",
    category: "Practice Management",
    icon: MonitorCog,
    color: getRandomColor(),
    links: [
      { name: "Open FuseSign", url: "https://www.fusesign.com/" },
    ],
  },
  {
    id: "practice-management-13",
    name: "Fiscal Finance",
    description:
      "Fiscal Finance has a set of tools to help you manage your clients' financial data.",
    category: "Practice Management",
    icon: MonitorCog,
    color: getRandomColor(),
    links: [
      { name: "Open Fiscal Finance", url: "https://fsdb2.com/software/html5.html" },
    ],
  },
  // Regulations Template Section
  // Reporting Template Section
  // Software Template Section
  // Superannuation Template Section
  // Taxation Template Section
  {
    id: "taxation-1",
    name: "AirBNB Tax Guide",
    description:
      "This guide provides information on how to report your income and expenses from renting out your property on AirBNB.",
    category: "Taxation",
    icon: PiggyBank,
    color: getRandomColor(),
    files: [
      { name: "Airbnb Tax guide.pdf", url: "knowledge/Taxation/Airbnb Tax guide.pdf", type: "pdf" },
    ],

  },
  {
    id: "taxation-2",
    name: "Record Keeping",
    description:
      "This document provides information on the record keeping requirements for individuals and businesses in order to meet their tax obligations.",
    category: "Taxation",
    icon: PiggyBank,
    color: getRandomColor(),
    files: [
      { name: "ATO Advise for record keeping.pdf", url: "knowledge/Taxation/ATO Advise for record keeping.pdf", type: "pdf" },
    ],

  },
  // Useful Links Template Section
    {
    id: "useful-links-1",
    name: "Taxtalk Website",
    description:
      "Navigate to the Taxtalk website to access a range of useful resources and tools.",
    category: "Useful Links",
    icon: Globe,
    color: getRandomColor(),
    links: [
      { name: "Website", url: "https://taxtalk.com.au" },
    ],
  },
  {
    id: "useful-links-2",
    name: "Integritas Website",
    description:
      "Navigate to the Integritas website to access a range of useful resources and tools.",
    category: "Useful Links",
    icon: Globe,
    color: getRandomColor(),
    links: [
      { name: "Website", url: "https://integritas.com.au" },
    ],
  },
  {
    id: "useful-links-3",
    name: "MorganWealth Website",
    description:
      "MorganWealth is a financial planning and wealth management firm. Navigate to their website to learn more.",
    category: "Useful Links",
    icon: Globe,
    color: getRandomColor(),
    links: [
      { name: "Open Website", url: "https://morganwealth.com.au" },
    ],
  },
  {
    id: "useful-links-4",
    name: "Calendly Appointments - Domenic ",
    description:
      "Book an appointment with Domenic using the Calendly booking system.",
    category: "Useful Links",
    icon: Globe,
    color: getRandomColor(),
    links: [
      { name: "Book an appointment", url: "https://calendly.com/taxtalkdb" },
    ],
  },



]

