import { EmailTemplate } from "@/types/email-template";

{/*  // Example email templates
  {
    id: "",
    subject: "",
    body: "",
    attachments: [
      { name: "", url: "/attachments/" },
      { name: "", url: "/attachments/" },
    ],
    category: "Admin",
  },
  */}

export const emailTemplates: EmailTemplate[] = [
    // {/* Admin */} -   // {/* Admin */} -   // {/* Admin */}
    {
      id: "A1",
      subject: "Welcome to Our Platform",
      body: `
        <h3 style="font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">Welcome!</h3>
        <p style="font-size: 14px; color: #4a5568; margin: 0 0 10px 0;">Thank you for joining our platform. Here's what you need to know to get started:</p>
        <ul style="font-size: 14px; color: #4a5568; margin: 0 0 10px 0; padding-left: 20px;">
          <li>Complete your profile setup.</li>
          <li>Explore our features and tools.</li>
          <li>Reach out to support if you need help.</li>
        </ul>
        <p style="font-size: 14px; color: #4a5568; margin: 0 0 10px 0;">For more details, check out our <a href="#" style="color: #3b82f6; text-decoration: underline;">getting started guide</a>.</p>
        <p style="font-size: 14px; color: #4a5568; margin: 0;">Please attach the files you downloaded earlier.</p>
      `,
      attachments: [
        { name: "Getting Started Guide", url: "/attachments/getting-started.pdf" },
        { name: "Welcome PDF", url: "/attachments/welcome.pdf" },
      ],
      category: "Admin",
    },

  {
    id: "A2",
    subject: "Template 2",
    body: "Content of template 2...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Admin", 
  },

  {
    id: "A3",
    subject: "Template 3",
    body: "Content of template 3...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Admin", 
  },

  {
    id: "A4",
    subject: "Template 4",
    body: "Content of template 4...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Admin", 
  },

  {
    id: "A5",
    subject: "Template 5",
    body: "Content of template 5...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Admin", 
  },

  {
    id: "A6",
    subject: "Template 6",
    body: "Content of template 6...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Admin", 
  },

  {
    id: "A7",
    subject: "Template 7",
    body: "Content of template 7...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Admin", 
  },
  // {/* Accountants */} -   // {/* Accountants */} -   // {/* Accountants */}
  {
    id: "AC1",
    subject: "Template 1",
    body: "Content of template 1...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Accounting", 
  },
  {
    id: "AC2",
    subject: "Template 2",
    body: "Content of template 2...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Accounting", 
  },
  {
    id: "AC3",
    subject: "Template 3",
    body: "Content of template 3...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Accounting", 
  },
  {
    id: "AC4",
    subject: "Template 4",
    body: "Content of template 4...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Accounting", 
  },
  
   // {/* Bookkeeping */} -   // {/* Bookkeeping */} -   // {/* Bookkeeping */}
   {
    id: "B1",
    subject: "Template 1",
    body: "Content of template 1...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Bookkeeping", 
  },
  {
    id: "B2",
    subject: "Template 2",
    body: "Content of template 2...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Bookkeeping", 
  },
  {
    id: "B3",
    subject: "Template 3",
    body: "Content of template 3...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Bookkeeping", 
  },
  {
    id: "B4",
    subject: "Template 4",
    body: "Content of template 4...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Bookkeeping", 
  },
  {
    id: "B5",
    subject: "Template 5",
    body: "Content of template 5...",
    attachments: [
      { name: "Attachment", url: "/attachments/1.pdf" },
      { name: "Attachment", url: "/attachments/2.pdf" },
    ],
    category: "Bookkeeping", 
  },
];