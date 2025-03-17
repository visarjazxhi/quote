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
    // {/* Accounting */} -   // {/* Accounting */} -   // {/* Accounting */}
    {
      id: "Accounting1",
      subject: "Follow up account overdue for [entity] Job No. [job number]",
      body: `
Hi 
Hope all is well. 

This is a friendly reminder that although reminders have been sent , the following invoice remains unpaid.
Invoice No: 
Invoice Due Date: 
Invoice Amount: $

We understand that oversights happen but would appreciate prompt payment of this amount as our payment terms are 7 Days. 
If you have any questions in relation to this invoice or need another copy, please let me know.
Look forward to hearing back from you. 

      `,
      attachments: [

      ],
      category: "Accounting",
    },

    {
      id: "Accounting2",
      subject: "Maximize Your Tax Deductions with a Tax Depreciation Schedule | Application",
      body: `
Hi [Client's Name],
If you own an investment property, a Tax Depreciation Schedule can help you maximize your tax deductions by outlining the wear and tear on your property that can be claimed as depreciation. Essentially, it’s a detailed report that allows you to claim deductions on the declining value of your property’s structure and assets—helping you reduce your taxable income and increase your cash flow.
To make this process easy, we’ve partnered with Duo Tax, one of Australia’s leading quantity surveying firms, to provide our clients with a discounted rate on their depreciation schedules.
Start your application here:
Be specific on which clients you are referring to. Taxtalk or Integritas | remove one 
Taxtalk Pty Ltd Depreciation Start Form - https://duotax.secure.force.com/StartForm?accid=0017F00000odUK5
Integritas Accountants And Advisers Pty Ltd Depreciation Start Form - https://duotax.secure.force.com/StartForm?accid=0019q000002nqNO
If you have any questions or need further assistance, feel free to reach out—we’re here to help.
Best regards,
[Your Name]
      `,
      attachments: [

      ],
      category: "Accounting",
    },

// {/* Admin */} -   // {/* Admin */} -   // {/* Admin */}
{
  id: "Admin1",
  subject: "Accessing, Downloading & Signing Documents in Xero",
  body: `
Hi [Client's Name],
I hope you're doing well.
To help you navigate Xero more easily, here’s a quick video tutorial on how to access, download, and e-sign documents:
📹 Watch here - https://youtu.be/TDTrMI-N9fU
Having Trouble Logging In?
If you share a laptop or computer, you might occasionally run into login issues. This is due to Xero’s enhanced security measures, designed to protect your account from cyber threats.
If clicking the 'Review Documents' button in the email doesn’t work, try this instead:
1️⃣ Go to Xero Portal - https://portal.xero.com/
2️⃣ Log in using the same email address where the documents were sent
3️⃣ This is the same as clicking 'Review Documents' in your email—once logged in, your documents should appear.
Still Having Issues?
Because Xero runs in your web browser, sometimes a quick cache refresh or clearing your browser cache can resolve login problems. Here’s how to do it:
•	Google Chrome - https://support.google.com/accounts/answer/32050?hl=en&co=GENIE.Platform%3DDesktop
•	Microsoft Edge - https://support.microsoft.com/en-au/microsoft-edge/view-and-delete-browser-history-in-microsoft-edge-00cf7943-a9e1-975a-a33d-ac10ce454ca4
•	Firefox - https://support.mozilla.org/en-US/kb/how-clear-firefox-cache
•	Safari - https://support.apple.com/en-au/guide/safari/sfri47acf5d6/mac
If you’re still having trouble, feel free to call us at 1300 829 825—we’re happy to assist!
Best regards,

  `,
  attachments: [

  ],
  category: "Admin",
},
{
  id: "Admin2",
  subject: "Important Steps for Agent-Client Linking",
  body: `
Subject: Action Required: Authorising Us as Your Agent for Seamless Service
Dear [Client's Name],
I hope you’re doing well.
To ensure we can effectively manage your account and provide you with seamless service, we need you to authorize us as your agent. This will allow us to access your portal and link your account with our services.
Here’s how to set it up:
1.	Log in to Online Services for Business
2.	Navigate to: Profile > Agent details > Add
3.	Search for agent: Type "Integritas Accountants and Advisers Pty Ltd" or enter our agent number 25683530
4.	Complete the Declaration
5.	Click Submit
If you don’t have a myGovID yet, I’ve attached a step-by-step guide to help you set it up. If you already have one, you can skip steps 1-3 in the guide.
Once you’ve completed the nomination, please let us know so we can finalize the setup on our end.
We appreciate your prompt attention to this, as it helps us ensure a smooth and uninterrupted service for you. If you have any questions or run into any issues, please don’t hesitate to reach out—we’re here to help!

  `,
  attachments: [
    { name: "Agent Nomination Instructions", url: "/attachments/admin/Agent Nomination Instructions.pdf" },
  ],
  category: "Admin",
},
{
  id: "Admin3",
  subject: "Important: Scope of Services & Modifications",
  body: `
Dear [Client's Name],
I hope you're doing well.
I wanted to send a friendly reminder regarding our policy on modifications or extensions to the originally agreed Scope of Services.
The initial engagement, as outlined in our proposal, was carefully tailored to meet your specific tax, accounting, and compliance needs. This Scope of Services defines all agreed-upon services, deliverables, and associated costs to ensure transparency and alignment.
Making Changes to the Scope
To maintain efficiency and clarity, any proposed alterations or extensions to the scope will need to be:
✅ Discussed and mutually agreed upon before work begins.
✅ Formalized in a "Service Extension Agreement," which will outline:
•	The proposed changes
•	Any impact on project timelines
•	Any additional costs (if applicable)
We will only proceed with additional work once we have received your approval of the revised scope.
Next Steps
We value open communication and believe that clear expectations lead to the best outcomes. If you have any questions or require further clarification about our policy on scope modifications, please don’t hesitate to reach out.
We appreciate your understanding and look forward to continuing to support you.
Best regards,

  `,
  attachments: [

  ],
  category: "Admin",
},
{
  id: "Admin4",
  subject: " Practice ignition - overview and next steps",
  body: `
https://www.youtube.com/watch?v=FWUWX5g3JjM – 3 mins 
https://www.youtube.com/watch?v=-y_LeohIDTk – 10 mins 
https://support.practiceignition.com/en/articles/4170519-presentation - how clients view proposals 

  `,
  attachments: [

  ],
  category: "Admin",
},
{
  id: "Admin5",
  subject: "Secure Email Portal – Accessing Your Documents",
  body: `
Hi [Client's Name],
We take the security of your sensitive information seriously, which is why we send attachments through our secure email portal to protect them from unauthorized access.
How Our Process Works:
•	You will receive an email from hub.ddslive.center@ddslive.com.au containing a secure link at the bottom of the page.
•	To view and download the document, you will need a PIN number, which will be sent to your mobile.
•	Without the PIN, you will not be able to access the document.
If you have any questions or run into any issues accessing your document, please don’t hesitate to reach out. You can contact us at 1300 TAXTALK (1300 829 825)—we’re happy to help!
Best regards,

  `,
  attachments: [

  ],
  category: "Admin",
},


// {/* Bookkeeping */} -   // {/* Bookkeeping */} -   // {/* Bookkeeping */}
{
  id: "Bookkeeping1",
  subject: "ATO Payment Plan Request – Action Required by [Due Date]",
  body: `
Dear [Client's Name],
I hope you're doing well.
Attached is your Payment Plan Request Form for you to complete and return to our office by the end of the business day.
Once we receive your request, we’ll liaise with the ATO on your behalf to arrange and activate your payment plan. While we will communicate your proposed payment commitment, the ATO may either confirm the plan or suggest a revised amount. If any adjustments are required, we’ll discuss them with you before finalizing anything.
If there are any changes to your circumstances in the meantime, or if you have any questions, please don’t hesitate to reach out—we’re here to help!
Best regards,
  `,
  attachments: [
    { name: "ATO Debt Plan", url: "/attachments/bookkeeping/ATO Debt Plan Arrangment.docx" },

  ],
  category: "Bookkeeping",
},

{
  id: "Bookkeeping2",
  subject: "Introduction – Bookkeeping Assistance for [Client Name]",
  body: `
Good Afternoon [Consultant's Name],
I’d like to introduce you to [Client Name], a long-time friend and valued client of mine.
[Client Name] is in the process of setting up a [Company/Trust/Other] in the [Industry] and requires your expert bookkeeping assistance.
They will be setting up [specific setup details, e.g., Xero, MYOB, QuickBooks, etc.] but will need some guidance and coaching along the way.
Could you please connect and arrange a time to discuss their requirements?
[Client Name], [Consultant's Name] is highly experienced and will be able to guide you through the process seamlessly.
Let me know if you have any questions. Happy to assist!
Best regards,

  `,
  attachments: [

  ],
  category: "Bookkeeping",
},

// {/* Compliance */} -   // {/* Compliance */} -   // {/* Compliance */}
{
  id: "Complicance1",
  subject: "Director identification number (DIN)",
  body: `
Dear [Recipient's Name],
As a company director, you are required to apply for your own Director ID. This is a unique identifier that verifies your identity and helps prevent fraudulent directorships. Similar to a Tax File Number (TFN), it stays with you permanently, even if you change companies.
How to Apply for Your Director ID
The fastest way to apply is online using the myGovID app to log in to ABRS Online. Unfortunately, our office cannot apply on your behalf, but we are happy to assist you through the process.
You can find a step-by-step guide here: [Apply for your Director ID](insert link).
What You Need Before Applying
To apply online, you must have a myGovID with at least Standard identity strength. If you haven’t set up a myGovID yet, you can do so here: [Set up myGovID](insert link).
Alternative Application Methods
If you are unable to apply online:
•	If you live in Australia: Call 13 62 50 for assistance.
•	If you live outside Australia: Call +61 1300 829 825, and you will be sent a link to complete the application manually.
If you have any questions or need help with your application, please feel free to reach out.
Best regards,

  `,
  attachments: [

  ],
  category: "Compliance",
},

{
  id: "Complicance2",
  subject: "Understanding Your ASIC Annual Review Process and Fees",
  body: `
Dear [Client's Name],
Thank you for reaching out. I appreciate the opportunity to clarify the ASIC annual review process and associated fees to ensure your company's compliance and avoid any unnecessary penalties.
Annual Review Fees
Each year, ASIC requires companies to pay an annual review fee to maintain their registration. For a proprietary company, the current fee is $321. Shortly after your company's annual review date—which typically aligns with your company's registration date—you will receive an annual statement from ASIC. This statement includes your company's current details, an invoice for the annual review fee, and your corporate key. icaresmsf.com.au+3sprintlaw.com.au+3growsmsf.com.au+3ASIC+1sprintlaw.com.au+1
Our office facilitates this process by sending all necessary documents to you via DocuSign. The most recent set of documents was sent on [insert date]. To ensure compliance, please sign these documents electronically and remit the ASIC annual review fee before the due date of [insert date]. The invoice provides various payment options, including credit card and BPAY.
Late Payment Fees
Timely payment is crucial to avoid additional charges. If the annual review fee is not paid by the due date, ASIC imposes late fees as follows:
•	Payment up to one month late: $96
•	Payment more than one month late: $401
To assist you in meeting these deadlines, our system is programmed to send reminders 3-4 weeks prior to the due date. This proactive approach aims to help you avoid any late payment penalties.
Our Invoice
In addition to the ASIC fees, you will receive an invoice from our office. This charge covers the administrative time spent managing the annual review notice from ASIC on your behalf.
If you have any further questions or require assistance with this process, please don't hesitate to contact me. I'm here to help ensure your company's compliance and smooth operation.
Best regards,

  `,
  attachments: [

  ],
  category: "Compliance",
},

// {/* Miscellaneous */} -   // {/* Miscellaneous */} -   // {/* Miscellaneous */}
{
  id: "Miscellaneous1",
  subject: "Subject: Introducing (Client Name) ",
  body: `
Dear [Client's Name],
I hope you're doing well.
As part of our commitment to providing comprehensive financial support, I’d like to introduce you to our Financial Planning Division. Our team of experienced professionals can assist you with a range of financial strategies, including:
✔ Wealth creation & investment strategies
✔ Superannuation & retirement planning
✔ Tax-effective financial solutions
✔ Risk protection & insurance strategies
✔ Estate planning & asset protection
I believe that speaking with one of our financial planners could be beneficial to help you achieve your short-term and long-term financial goals.
I have passed on your details to [Financial Planner's Name], who will be in touch to discuss how they can assist you. Alternatively, you can schedule a time directly via [insert booking link if available].
If you have any questions in the meantime, please don’t hesitate to reach out.
Best regards,

  `,
  attachments: [

  ],
  category: "Miscellaneous",
},
{
  id: "Miscellaneous2",
  subject: "Urgent: Outstanding ATO Debt – Action Required",
  body: `
Dear [Client's Name],
I hope you're doing well. As part of our ongoing commitment to supporting your financial and tax affairs, we’ve reviewed your account and identified an outstanding debt with the Australian Tax Office (ATO).
As of [Date], the total outstanding amount is [Outstanding Amount].
We understand that financial obligations can sometimes be challenging to manage, and we are here to help you navigate this situation. It is important to address this debt as a priority to avoid any potential repercussions from the ATO. Unresolved debts may result in further action, including the issuance of Director Penalty Notices, which could have serious implications for your financial standing and business operations.
Your Options:
✅ Immediate Payment: If possible, settling the outstanding amount promptly is the simplest and most effective way to resolve this matter.
✅ Payment Arrangement: If immediate payment is not feasible, we can assist in negotiating a payment plan with the ATO. This will allow you to manage the debt through structured installments, reducing financial strain while staying compliant.
We have attached detailed documents outlining:
•	The nature of the debt
•	The outstanding balance
•	The potential consequences of non-payment
We strongly encourage you to review these documents and consider the best course of action.
Next Steps:
Your prompt attention to this matter is crucial—not only to maintain compliance with the ATO but also to safeguard the financial stability of your business. We are here to guide you through this process and work with you to find the best possible resolution.
Please feel free to reach out to me directly at [Your Contact Information] if you have any questions or if you’d like to discuss your options. Our goal is to help you resolve this efficiently with minimal disruption to your financial well-being.
Thank you for addressing this matter promptly. We look forward to hearing from you soon.
Best regards,

  `,
  attachments: [

  ],
  category: "Miscellaneous",
},
{
  id: "Miscellaneous3",
  subject: "Urgent: Outstanding ATO Debt – Payment Options Available",
  body: `
Dear [Client Name],
I hope you're doing well.
I’m reaching out regarding your outstanding debt with the ATO, which requires immediate attention to avoid potential penalties or further action.
If paying the full amount in one lump sum is challenging, a payment arrangement with the ATO may be a practical solution. This can help ease financial pressure while ensuring compliance with tax obligations.
Our team is here to assist you in setting up a suitable payment plan. If you’d like our help, simply let us know, and we can initiate the process on your behalf.
If you have any questions or require further clarification, please don’t hesitate to reach out—I’m here to help.
Looking forward to your response.
Best regards,

  `,
  attachments: [

  ],
  category: "Miscellaneous",
},

// {/* Practice */} -   // {/* Practice */} -   // {/* Practice */}
{
  id: "Practice1",
  subject: "Action Required – Payment Collection Unsuccessful",
  body: `
Hi [Client's Name],
I hope you're doing well.
We wanted to let you know that your payment collection was unsuccessful on [enter date]. To ensure everything stays on track, you have two options:
1️⃣ Update your bank details directly via your [payment hub link].
2️⃣ Let us know when sufficient funds are available, and we can reschedule the collection.
We appreciate your prompt attention to this matter and are here to assist if you need any help. Feel free to reach out with any questions.
Best regards,

  `,
  attachments: [

  ],
  category: "Practice",
},
{
  id: "Practice2",
  subject: " Employee Personal Detail Form and TFN Declaration",
  body: `

  `,
  attachments: [
    { name: "Constractors Super Fund", url: "/attachments/practice/Contractors Super Fund Details.xlsx" },
    { name: "Employees Personal Detail Form", url: "/attachments/practice/Employees Personal Detail Form (new).xlsx" },
    { name: "TFN Declaration Form", url: "/attachments/practice/TFN_declaration_form_N3092.pdf" },
  ],
  category: "Practice",
},
{
  id: "Practice3",
  subject: "Ethical Clearance Letter",
  body: `
Hi (Client Name) 
I trust this email finds you well.
Please find attached the ethical letter clearance and Worksheet to complete for ”Enter the Name of the group here” for your attention.
We look forward to receiving your assurance and requested information in due course. 
Thank you kindly for your assistance with this matter.

  `,
  attachments: [
    { name: "Ethical Clearance Letter", url: "/attachments/practice/Ethical Clearance Letter.docx" },
    { name: "Worksheet", url: "/attachments/Worksheet.xlsx" },
  ],
  category: "Practice",
},
{
  id: "Practice4",
  subject: "Ethical letter No objection",
  body: `
Dear ________,

I trust this email finds you well.

Please find attached the ethical letter response for  _______________________.

  `,
  attachments: [
    { name: "Ethical Letter - No Objection", url: "/attachments/practice/Ethical Letter no.docx" },
  ],
  category: "Practice",
},
{
  id: "Practice5",
  subject: "Ethical letter",
  body: `
I trust this email finds you well.
Please find attached the ethical letter _______________________ for your attention.
Thank you kindly for your assistance with this matter.

  `,
  attachments: [
    { name: "Ethical Letter - No Objection", url: "/attachments/practice/Ethical Letter.docx" },
  ],
  category: "Practice",
},
{
  id: "Practice6",
  subject: " Integritas Fees 2024",
  body: `
Dear [Customer's Name],
Thank you for reaching out to us!

Please find the attached file containing our fees for FY 2024. If you have any questions or need further assistance, feel free to reply to this email or call us at 1300 829 825.

We look forward to assisting you.
Best regards,

  `,
  attachments: [
    { name: "IAA Fees", url: "/attachments/practice/IAA Fees.pdf" },
    { name: "IAA Packages", url: "/attachments/practice/IAA Packages.pdf" },
  ],
  category: "Practice",
},
{
  id: "Practice7",
  subject: "New! Access Our Pricing & Fees Information Online",
  body: `
Hi [Client's Name],
Hope you're doing well! Just a quick update—we’ve made it easier for you to access our comprehensive pricing and fees directly on our website.
We've added a dedicated page that lays out everything clearly, so you have full transparency on our pricing structure and associated fees. This will help you make informed decisions that suit your needs.
👉 Check it out here: https://integritas.com.au/pricing/
If you have any questions or need further assistance, feel free to reach out. We're always happy to help!
Looking forward to working with you.

  `,
  attachments: [

  ],
  category: "Practice",
},
{
  id: "Practice8",
  subject: "Payment collection was rejected for",
  body: `
Hi
Hope you are keeping well. 

An automated email was sent on Thursday, 22 December 2022 advising to we could not process this payment. 
You can either:
1. Go directly to your payment hub and update your bank details here OR
2. Let us know when there are sufficient funds so we can reschedule the collection.  

We look forward to your prompt attention to this matter.

  `,
  attachments: [

  ],
  category: "Practice",
},
{
  id: "Practice9",
  subject: "Follow-Up on Your Proposal No...........",
  body: `
Hi [Client's Name],
I hope you're doing well.
I wanted to follow up on the proposal we sent you and check if you had any questions. I'm happy to clarify anything or discuss any details further.
Once the proposal is accepted, we can promptly allocate the job and get started on the work.
You can review and accept the proposal by clicking here: [Link to Proposal]
If there’s anything else I can assist with, please don’t hesitate to reach out. You can contact me at 1300 829 825 or on my mobile below.
Looking forward to your response!
Best regards,

  `,
  attachments: [

  ],
  category: "Practice",
},
{
  id: "Practice10",
  subject: " Welcome! Your Onboarding & Next Steps",
  body: `
Hi [Client's Name],
Thank you for reaching out—we’re excited to work with you!
To ensure the security of your personal information and protect both you and our business from email fraud, we follow a structured onboarding process. Please complete the steps below to get started:
Onboarding Process
1️. Log in to your existing profile on our website: [Login Here]
2️. Review and confirm the accuracy of your personal information.
3️. Book your appointment: [Book Here]
4️. Upload your documents: Ensure files are correctly named and assigned to the correct financial year.
📌 For checklists, pricing, and other resources, visit our Resource HUB—accessible once you’re logged in.
________________________________________
What Happens After Your Tax Return is Completed?
📄 Step 1: Signing & Lodging Your Tax Return
•	Once your tax return is finalised, you will receive an email notification to review and sign electronically.
•	A "How to Sign" video will be included for guidance.
•	At this stage, you can also download a copy for your records.
💳 Step 2: Invoice & Payment
•	You will receive a separate email with your invoice for services rendered.
•	Payment is required before lodgement.
•	To pay by credit card, use the "Pay Now" function on the invoice (we receive an instant notification).
•	Alternatively, you can pay via direct transfer (details provided on the invoice).
🚨 Important Security Reminder
If you receive an email requesting a fund transfer, please do not process the payment until you have verbally confirmed with our office. This ensures your security and protection from fraudulent requests.
________________________________________
We’re here to support you every step of the way! If you have any questions, please feel free to contact us at 1300 TAXTALK (1300 829 825)—we’d love to hear from you.
Best regards,

  `,
  attachments: [

  ],
  category: "Practice",
},
{
  id: "Practice11",
  subject: "Welcome! Your Onboarding Process & Next Steps",
  body: `
Hi [Client's Name],
Thank you for reaching out—we’re excited to work with you!
To ensure the security of your personal information and protect both you and our business from email fraud, we follow a structured onboarding process. This ensures the integrity of our data and keeps your information safe.
________________________________________
Your Onboarding Process
1️. Unique Email Address: You must have an individual email address that only you can access (i.e., not shared with others).
2️. Register on Our Website: We will send you a secure link to create your account.
3️. Book an Appointment: Once registered, you can schedule a time that suits you.
4️. Verify Your Personal Information: Please review your details for accuracy.
5️. Upload Your Documents: Ensure files are correctly named and assigned to the correct financial year.
📌 Need checklists, pricing, or other resources? You can access our Resource HUB once logged in.
________________________________________
What Happens After Your Tax Return is Completed?
📄 Step 1: Signing & Lodging Your Tax Return
•	Once your tax return is finalised, you will receive an email notification to review and sign electronically.
•	A short “How to Sign” video will be included in the email.
•	At this stage, you can also download a copy for your records.
💳 Step 2: Payment & Lodgement
•	You will receive a separate email with your invoice for services rendered.
•	Payment must be made before lodgement.
•	To pay by credit card, simply use the "Pay Now" function on the invoice (we receive an instant notification).
•	Alternatively, you can pay via direct transfer (bank details provided on the invoice).
________________________________________
We’re committed to making this process smooth and transparent for you. If you have any questions, please feel free to reach out—we’re always happy to help!
📞 Call us anytime at 1300 TAXTALK (1300 829 825).
Best regards,

  `,
  attachments: [

  ],
  category: "Practice",
},
{
  id: "Practice12",
  subject: "Your lodgement pending",
  body: `
Hi 
I hope this email finds you well.

{ OPTIONAL: DELETE AS APPROPRIATE } 

The purpose of my is to follow up signing request. Once you have signed, we can attend to your lodgement.
Please let me know if you have any questions. 

{ OPTIONAL: DELETE AS APPROPRIATE } 

The purpose of my email is to let you know that your lodgement is pending subject to payment of our invoice. For your convenience, I have attached a copy of the invoice which has our payment details.
Once payment has been received, we can attend to your lodgement.

Please let me know if you have any questions.

  `,
  attachments: [

  ],
  category: "Practice",
},
// {/* Setup */} -   // {/* Setup */} -   // {/* Setup */}
{
  id: "Setup1",
  subject: "Action Required – Signing & Application Process for Corporate/Trust Setups",
  body: `
Hi [Client's Name],
I hope you're doing well.
As part of your corporate or trust setup, we are preparing the necessary documents and applications. Below is an overview of what we need to complete this process:
Documents for Signing
✔ Two sets of documents will need to be signed – one set must be certified.

Applications We Will Submit
📌 Business Registrations:
✔ ABN (Australian Business Number)
✔ TFN (Tax File Number)
✔ Director ID (if not already obtained)
✔ GST Registration (if applicable)

📌 Trust-Specific Requirements:
✔ Stamp Duty Payment – Required for Trust setup.
  •	Action: Please send a copy of the invoice to Marie Esposado for payment.
  •	CC: Domenic Barba for reference.

📌 Additional Business Details Required:
✔ Estimated Income Turnover
✔ Industry Details (Please provide as much detail as possible to ensure correct classification)

📌 Employment & Taxation Registrations:
✔ WorkCover Registration (if applicable)
✔ PAYG Withholding Application
  •	Number of employees
  •	Expected tax withheld
  •	Employee roles
________________________________________
Best regards,

  `,
  attachments: [

  ],
  category: "Setup",
},
{
  id: "Setup2",
  subject: "Company Setup – Information Required",
  body: `
Dear [Client's Name],
Thank you for your interest in setting up a company. We are excited to assist you with this process and ensure everything is set up correctly with ASIC and the ATO.
To proceed, please provide the following information. This will allow us to prepare and lodge your company registration efficiently.
________________________________________
1. Proposed Company Details
📌 Company Name (in full):
📌 Alternative Name (if the first choice is unavailable):
📌 Registered Business Name (if applicable):
📌 Business Activity & Industry: (Please provide as much detail as possible to ensure correct classification.)
📌 Expected Annual Turnover:
📌 Will the company require GST registration? (Yes/No)
📌 Will the company hire employees immediately? (Yes/No)
•	If Yes, please provide estimated number of employees.
________________________________________
2. Registered Office & Business Address
📌 Registered Office Address (must be in Australia):
📌 Principal Place of Business Address: (If different from the Registered Office.)
________________________________________
3. Officeholders (Directors & Secretaries)
ASIC requires details of all directors and secretaries of the company.
For each Director & Secretary, please provide:
✔ Full Legal Name:
✔ Date of Birth:
✔ Place of Birth (City & Country):
✔ Residential Address (must be in Australia for at least one director):
✔ Email & Mobile Number:
✔ Tax File Number (TFN) (if available):
✔ Director ID: (If not yet obtained, we can guide you through the process.)
🚨 Important: At least one director must be an Australian resident.
________________________________________
4. Shareholders (Members)
ASIC requires details of all shareholders.
For each Shareholder, please provide:
✔ Full Legal Name:
✔ Date of Birth:
✔ Place of Birth (City & Country):
✔ Residential Address (or registered address for a corporate shareholder):
✔ Tax File Number (TFN) (if available):
✔ Number of Shares Issued & Type (e.g., Ordinary Shares):
✔ Percentage of Ownership:
🚨 If a trust or company will hold shares, please provide the trust deed or company registration details.
________________________________________
5. Other Required Information
📌 Would you like us to act as the ASIC registered agent? (Yes/No)
📌 Do you need assistance with company bank account setup? (Yes/No)
📌 Do you require a company constitution? (Yes/No – if no, replace with the default replaceable rules.)
📌 Do you need PAYG withholding registration? (Yes/No)
________________________________________
Next Steps
Once we receive all the above details, we will:
✅ Prepare the company registration documents for signing.
✅ Submit the application to ASIC.
✅ Apply for ABN, TFN, GST, and PAYG Withholding (if applicable).
✅ Provide you with all official company registration documents.
If you have any questions or need assistance with any part of the process, please let us know.
📞 Call us at 1300 TAXTALK (1300 829 825) or reply to this email.
We look forward to helping you establish your company!
Best regards,

  `,
  attachments: [

  ],
  category: "Setup",
},
{
  id: "Setup3",
  subject: "Important Information for Your TFN Application",
  body: `
Dear [Recipient's Name],
To apply for a Tax File Number (TFN), you must have your supporting documents certified by a government agency in the country where you reside. Once this is done, we recommend keeping a copy of your application for your records.
Please send the original application along with certified copies of your identity documents to:

Australian Taxation Office
PO Box 9942
MOONEE PONDS VIC 3039
Australia

For more details, you can visit the [ATO website](insert link here).
If you need assistance completing your application or cannot provide sufficient proof of identity documents, please contact the ATO at +61 2 6216 1111 (Monday to Friday, 8:00 AM – 5:00 PM AEST/AEDT) and request to be transferred to Personal Tax Enquiries.
Let us know if you require any further assistance.

  `,
  attachments: [
    { name: "TFN Application Form", url: "/attachments/setup/IND-TFN- NAT2628.pdf" },
    { name: "TFN Application Electronic form", url: "/attachments/setup/TFN Application electronic form.pdf" },
  ],
  category: "Setup",
},
{
  id: "Setup4",
  subject: "Setting Up Your ATO Online Services Access",
  body: `
Dear [Client's Name],
I hope you're doing well.
To help you set up access to ATO Online Services, please follow the steps below. If you already have a myGovID, you can skip Steps 1–2 and proceed directly to linking your business.
What You’ll Need:
•	myGovID – A secure app that allows you to prove your identity online.
•	Relationship Authorisation Manager (RAM) – A service that lets you authorise others to act on behalf of your business once your myGovID is linked to your ABN.
💡 Note: myGovID is different from myGov (which you may already use for Centrelink, Medicare, and the ATO).
________________________________________
Step 1: Set Up Your myGovID
1.	Download the myGovID app from the App Store or Google Play.
2.	Follow the prompts to enter your full name, date of birth, and email address (use a personal email that only you have access to).
3.	Verify two forms of ID (e.g., driver’s licence, passport, or Medicare card).
________________________________________
Step 2: Link Your myGovID to Your Business Using RAM
To link your ABN to your myGovID, you must be the principal authority (business owner or responsible officer).
•	If no one has linked the business yet, follow the steps here: https://info.authorisationmanager.gov.au/principal-authority
•	If someone else has already set up access, they can authorise you through RAM.
________________________________________
Step 3: Log In to Online Services for Business
Once your myGovID and RAM are set up, you can log in to ATO Online Services for Business:
•	Enter your email address at the login screen.
•	A 4-digit code will appear—enter this in the myGovID app to authenticate.
•	Access ATO Online Services for Business here: https://www.ato.gov.au/General/Online-services/Businesses/
________________________________________
Additional Steps: Authorising Others
If you need to authorize employees or a tax agent (like us) to act on your behalf:
•	Ensure they have set up their own myGovID (as it belongs to them, not the business).
•	In RAM, enter their full legal name (matching their myGovID) and email address.
•	They will receive an email request and have 7 days to accept the authorization using their myGovID.
•	If you need to customise their access, RAM will direct you to Access Manager for permissions.
________________________________________
Final Step: Nominate Us as Your Tax Agent
Once your business is linked, follow the attached worksheet to nominate us as your registered tax agent in RAM. This will allow us to efficiently manage your tax affairs on your behalf.
I hope this step-by-step guide makes the process easier. If you have any questions or run into any issues, please feel free to reach out—I’m happy to help!
Best regards,

  `,
  attachments: [

  ],
  category: "Setup",
},
{
  id: "Setup5",
  subject: "Setting Up Your Trust – Information Required",
  body: `
Dear [Client's Name],
Thank you for reaching out regarding the setup of your [Unit/Discretionary] Trust. To ensure a smooth and efficient process, we require key details about the trust structure, officeholders, shareholders, beneficiaries, and unit holders (where applicable).
________________________________________
Information Required for Your Trust Setup
1. Trust Details
✔ Type of Trust: [Unit Trust / Discretionary (Family) Trust]
✔ Proposed Trust Name: [Please provide three name preferences in case your first choice is unavailable]
✔ Settlor Name & Address: (The individual who gifts the initial settlement amount to establish the trust)
✔ Initial Settlement Amount: [Typically $10 or as per your preference]
________________________________________
2. Trustee Information
(A Trustee is responsible for managing the trust in accordance with the trust deed.)
Option 1: Individual Trustee(s)
•	Full Name(s)
•	Residential Address
•	Date of Birth
•	Tax File Number (TFN) (if available)
•	Contact Email & Phone Number
Option 2: Corporate Trustee (If setting up a company as trustee, additional information is required—see below)
•	Company Name
•	ACN (if existing)
•	Registered Office Address
•	Principal Place of Business
________________________________________
3. Appointor (for Discretionary Trusts only)
(An Appointor has the power to remove and appoint Trustees.)
•	Full Name(s)
•	Residential Address
________________________________________
4. Beneficiaries (For Discretionary Trusts)
Beneficiaries are individuals or entities eligible to receive distributions from the trust.
Please provide details of:
•	Primary Beneficiaries (e.g., direct family members)
•	General Beneficiaries (e.g., extended family, companies, charities, or trusts that may be included in the trust deed)
________________________________________
5. Unit Holders (For Unit Trusts)
Unit holders are individuals or entities that hold units in the trust and are entitled to distributions.
For each unit holder, please provide:
•	Full Name or Entity Name (if a company)
•	Residential/Business Address
•	Tax File Number (TFN) or ACN (if applicable)
•	Number of Units Held
•	Percentage of Ownership
________________________________________
6. Corporate Trustee (if applicable) – ASIC Requirements
If you choose to set up a corporate trustee, ASIC requires details of all officeholders (directors, secretaries) and shareholders.
✔ Company Name (if existing) or Proposed Company Name
✔ Registered Office Address
✔ Principal Place of Business
✔ Director & Secretary Details (Officeholders)
For each individual, please provide:
•	Full Name
•	Residential Address
•	Date of Birth
•	Tax File Number (TFN) (if available)
•	Contact Email & Phone Number
✔ Shareholder Details (If Applicable)
For each shareholder, please provide:
•	Full Name / Entity Name (if a company)
•	Residential/Business Address
•	Number of Shares & Share Class (e.g., Ordinary Shares)
•	TFN or ACN (if applicable)
________________________________________
7. Additional Information Required
✔ ABN & TFN Applications – Would you like us to register these for the trust?
✔ GST Registration – Will the trust be registered for GST? (Required if annual turnover is expected to exceed $75,000)
✔ WorkCover Registration – Will the trust have employees?
✔ Bank Account Setup – Do you require assistance with setting up a business bank account?
✔ Stamp Duty Payment (if applicable) – Required in some states for trust deeds.
________________________________________
Next Steps
Once we receive this information, we will prepare the Trust Deed and associated documents for review and signing. If you have any questions or require any assistance, please let us know.
We look forward to assisting you with your trust setup.
📞 For any queries, please contact us at 1300 TAXTALK (1300 829 825).
Best regards,

  `,
  attachments: [

  ],
  category: "Setup",
},

{
  id: "Setup6",
  subject: "Understanding Our Engagement Process",
  body: `
Hi [Client's Name],
I hope you're doing well.
As Certified Practising Accountants (CPA Australia) members, we adhere to a strict professional code of conduct, particularly in relation to client relationships. One key requirement is ensuring clarity and transparency through a formal engagement process.

Why an Engagement Agreement?
To maintain professional standards, CPA Australia requires that we provide a formal Terms of Engagement outlining:
✔ The scope of work we will perform for you
✔ The fees for each service
✔ Clear expectations to prevent any misunderstandings

This ensures that both you, as our valued client, and our firm are aligned before we proceed with any work.
Once you review and accept the engagement, we will allocate the best resources to complete your work efficiently.
If you have any questions or need further clarification, please feel free to reach out. We’re here to help!
Best regards,

  `,
  attachments: [

  ],
  category: "Setup",
},
{
  id: "Setup7",
  subject: "Updating Your Name with the ATO – A Step-by-Step Guide ",
  body: `
Dear [Client's Name],
I hope you're doing well.

If you need to update your name with the ATO, you'll first need to ensure you have a myGov account linked to the ATO, along with one of the following identity documents:
•	Australian full birth certificate (not an extract)
•	Australian marriage certificate
•	Australian change of name certificate

Your details will be verified with the issuing agency, so it's important that the information matches exactly.

How to Update Your Name Online
1.	Sign in to your myGov account and select the ATO member service to access the ATO online portal.
2.	From the top menu, go to My profile > Personal details.
3.	Click Update name and title under your current name.
4.	Choose the identity document you will use to verify your name change.
5.	Tick the box to consent to your document being verified with the issuing agency, then select Next.
6.	Enter the required details from your chosen identity document and click Verify.

Once your details are confirmed, the ATO will process your name change accordingly.
If you need any assistance or run into any issues, please don't hesitate to reach out—we’re always happy to help!
Best regards,

  `,
  attachments: [

  ],
  category: "Setup",
},

{
  id: "Setup8",
  subject: "Welcome! Your Onboarding & Next Steps",
  body: `
Hi [Client's Name],
Thank you for reaching out—we’re excited to work with you!
To ensure the security of your personal information and protect both you and our business from fraud, we follow a structured onboarding process. Please complete the steps below to get started.
________________________________________
Onboarding Process
📌 New Clients: Please register your details here: https://taxtalk.com.au/register
✅ Important Notes:
•	You must use a unique email address that only you can access (i.e., not shared with others).
•	Once registered, you will have access to your documents folder—please ensure your files are correctly named and assigned to the correct financial year.
•	For ID verification, please upload a copy of your identification to your documents folder under the relevant financial year.
•	You can also book appointments once registration is complete.
🚨 Important: If this process is not completed before your appointment, we may need to reschedule.
📂 For checklists, pricing, and other resources, visit our Resource HUB—accessible once you’re logged in.
________________________________________
What Happens After Your Tax Return is Completed?
📄 Step 1: Signing & Lodging Your Tax Return
•	Once your tax return is finalised, you will receive an email notification to review and sign electronically.
•	A short "How to Sign" video will be included for guidance.
•	At this stage, you can also download a copy for your records.
💳 Step 2: Invoice & Payment
•	We do not offer a fee-from-refund option.
•	You will receive a separate email with your invoice for services rendered.
•	Payment is required before lodgement.
•	To pay by credit card, use the "Pay Now" function on the invoice (we receive an instant notification).
•	Alternatively, you can pay via direct transfer (bank details provided on the invoice).
________________________________________
We are always here to assist you. If you have any questions, please don’t hesitate to reach out—we’d love to hear from you!
📞 Call us anytime at 1300 TAXTALK (1300 829 825).
Best regards,

  `,
  attachments: [

  ],
  category: "Setup",
},
// {/* Tax Returns */} -   // {/* Tax Returns */} -   // {/* Tax Returns */}
{
  id: "TaxReturns1",
  subject: "Action Required – Review & Verification of Your Tax Return",
  body: `
Hi [Client's Name],
It was great catching up with you!
I have sent your tax return for review, and once you’re satisfied with its contents, please proceed with signing.
Before You Sign
Before finalizing, please ensure that:
✅ You have verified all claims being made in the return.
✅ You send me copies of receipts and supporting documents for any deductions claimed, so I can retain them on file for compliance purposes.
ATO Requirements for Claiming Deductions
The ATO will accept claims based on the following substantiation rules:
1️⃣ All claims must be work-related – they must directly relate to earning your income.
2️⃣ You must have proof of the expense – either a receipt, invoice, or other documentation per ATO guidelines.
3️⃣ You must have paid for the expense yourself – you cannot claim for any expenses that have been reimbursed by your employer.
________________________________________
Specific Requirements for Common Claims
🚗 Motor Vehicle Expenses
•	You must have a logbook that meets ATO requirements.
•	You must have all receipts for vehicle-related claims.
•	For fuel expenses paid via debit/credit card, highlight the relevant transactions on your statement and note what the expense was for. The ATO will not accept bank statements alone without receipts.
🏠 Home Office Claims
•	You should keep a diary of hours worked from home.
•	If you work full-time from home (on a 38-hour/week contract), we will default to 38 hours per week, unless you can provide evidence of additional hours worked.
•	Keep receipts for any specific home office expenses you’re claiming.
•	If you have a dedicated home office space, please confirm the size of this space as a percentage of your total home size.
________________________________________
Next Steps
Please send me any required documentation at your earliest convenience. If you have any questions or need further clarification, feel free to reach out—I’m happy to assist!
Looking forward to your response.
Best regards,

  `,
  attachments: [

  ],
  category: "Tax Returns",
},

{
  id: "TaxReturns2",
  subject: "Confirmation of Tax Services & ATO Authorisation",
  body: `
Hi [Client's Name],
I hope you're doing well.
As we are currently authorised to act on your behalf through our tax agent portal, we have an obligation to keep you informed about your taxation and lodgement requirements with the ATO.
If you’d like to engage our services, we encourage you to prioritise scheduling a consultation so we can assist you in meeting your compliance obligations. We’d love the opportunity to work with you and ensure everything is handled smoothly.
That said, whatever you decide is completely up to you—we just want to clarify whether we should continue reaching out regarding your tax matters.
If you do not wish to proceed, a quick reply would be greatly appreciated so we can update our records and, if necessary, remove authorisations on our portal.
Looking forward to your response. Let me know if you have any questions—I’m happy to help!
Best regards,

  `,
  attachments: [

  ],
  category: "Tax Returns",
},

{
  id: "TaxReturns3",
  subject: "Follow-Up on Your Personal Income Tax Return",
  body: `
Dear [Client's Name],
I hope you're doing well in these ever-changing times.
I wanted to check in with you regarding the preparation of your [Year] personal income tax return. We’d love to schedule a time to get this underway, but just a reminder—the final lodgement deadline is [Last Date to Lodge].
While we can likely arrange an extension, I’d prefer to be proactive and help you avoid any potential penalties by lodging on time. Let’s aim to get everything sorted without the need for an extension if possible.
Next Steps:
✅ Let me know how you’d like to proceed.
✅ If you’d like to schedule a time, you can book a video or phone appointment here:
📅 Book an Appointment - https://calendly.com/taxtalkdb
Remember, the longer we wait, the more you leave on the taxman’s table when it should be in your pocket!
If we don’t hear from you soon, we’ll follow up with a call. Looking forward to speaking with you and getting this sorted.
Best regards,

  `,
  attachments: [

  ],
  category: "Tax Returns",
},

{
  id: "TaxReturns4",
  subject: "Rental Property Deductions – What You Need to Know",
  body: `
Dear [Client's Name],
[It was great speaking with you today] | [Thank you for your inquiry]—we appreciate the opportunity to work with you at TaxTalk.
Rental properties continue to be a key focus for the Australian Taxation Office (ATO), with ongoing audits and increased scrutiny in this area. The ATO is actively tightening compliance measures, making it more important than ever to ensure that your claims are legitimate, accurate, and well-documented.
At TaxTalk, we stay on top of the latest tax rules and know exactly what you can and can’t claim. More importantly, we guide you on how to maximize your deductions while ensuring you remain fully compliant with ATO regulations.

📎 Attached is a detailed outline of allowable rental property deductions.

Please have a read through and let me know if you need any clarification on specific areas—I’m happy to assist.
Looking forward to helping you make the most of your tax deductions!
Best regards,

  `,
  attachments: [

  ],
  category: "Tax Returns",
},

{
  id: "TaxReturns5",
  subject: " Tax Return Information – Work-Related Deductions | further information required ",
  body: `
Dear [Client's Name],
I hope you're doing well.
To ensure we maximize your deductions and prepare your tax return accurately, I have a few questions regarding your work-related expenses. If any of the following apply to you, please provide the relevant amounts and supporting details.
________________________________________
Work-Related Car & Travel Expenses
🚗 Did you use your car for work-related travel (excluding travel to and from home)?
•	If yes, how many kilometers did you travel?
•	Did you incur costs for: 
  o	Tolls?
  o	Parking?
✈️ Did you incur any travel expenses for work (e.g., flights, accommodation, meals, etc.)?
________________________________________
Work-Related Clothing, Laundry & Dry Cleaning
👔 Do you wear a uniform for work?
  •	If yes, was it supplied by your employer or did you purchase it yourself?
  •	If purchased, how much did it cost?
🧼 Did you incur any costs for laundry or dry cleaning related to work attire?
________________________________________
Work-Related Self-Education Expenses
📚 Did you complete any courses related to your work?
  •	Course name:
  •	Institution:
  •	Cost of the course:
  •	How is it connected to your work?
________________________________________
Other Work-Related Expenses
For the following, please provide the annual cost and percentage of business use:
📱 Mobile Phone: Monthly spend & % used for work
🏠 Working from home:
  •	Before 1 March 2020 – Hours worked per week?
  •	After 1 March 2020 – Hours worked per week?
📺 Subscriptions: Did you pay for any work-related memberships or subscriptions?
💼 Union Fees: Are you part of a union? If yes, how much did you pay?
📜 Licenses & Registrations: Any work-related licenses or registrations?
🌐 Internet Expenses: Cost & % used for work?
📖 Reference materials (Books, Magazines, Journals, etc.): Cost?
________________________________________
Depreciable Work-Related Expenses
🖥️ Did you purchase any work-related equipment over $300?
  •	Date of purchase:
  •	Cost of purchase:
________________________________________
Investment-Related Deductions
🏦 Interest Deductions:
  •	Did you earn any interest income from investments?
  •	Were there any associated costs?
📈 Dividend Deductions:
  •	Did you earn any dividend income from investments?
  •	Were there any associated costs?
________________________________________
Charitable Donations
❤️ Did you make any donations of $2 or more to a registered charity?
  •	If yes, please provide the charity name and donation amount.
________________________________________
Tax-Related & Superannuation Deductions
📝 Cost of Managing Tax Affairs
  •	How much did you pay for tax return preparation in the 2019 financial year?

🏦 Personal Superannuation Contributions
  •	Did you make any personal contributions to superannuation in 2020?
  •	Would you like to claim them as a tax deduction?
________________________________________
Other Deductions
🛡️ Income Protection Insurance
  •	Do you have income protection insurance?
  •	If yes, how much did it cost you?
________________________________________
If you could provide these details at your earliest convenience, it will help ensure we maximize your eligible deductions. Let me know if you have any questions—I’m happy to help!
Best regards,

  `,
  attachments: [

  ],
  category: "Tax Returns",
},

{
  id: "TaxReturns6",
  subject: "Taxtalk Contact Enquiry",
  body: `
Subject: Welcome! Next Steps for Your Onboarding
Hi [Client's Name],
Thank you for reaching out! We would love the opportunity to work with you and look forward to assisting you.
{OPTIONAL: DELETE AS APPROPRIATE}
📎 Attached is our fee schedule as requested.
📅 If you have a general query, feel free to book a 15-minute virtual call: [Schedule a Call]
________________________________________
Getting Started: Your Onboarding Process
To protect the security of your personal information and ensure a seamless experience, we follow a structured onboarding process.
✅ Step 1: Register as a New Client
•	Sign up and register your details here: https://taxtalk.com.au/register
•	Use a unique email address that only you can access (not shared with others).

✅ Step 2: Complete Your Profile
Once registered, you will have access to your documents folder, where you can:
•	Upload a copy of your ID for verification (ensure it’s saved under the correct financial year).
•	Name and organize documents correctly by financial year.
•	Book an appointment (Phone, Face-to-Face, Teams, or Zoom).
📌 Important: We get notified when you sign up, and from there, we will add you to our tax agent portal and set up your profile. If this process is not completed before your appointment, we may need to reschedule.
📂 Need checklists, pricing, or resources? Once logged in, you can access our Resource HUB.
________________________________________
What Happens After Your Tax Return is Completed?
📄 Step 1: Signing & Lodging Your Tax Return
•	Once finalised, you will receive an email notification to review and sign electronically.
•	A "How to Sign" video will be included for guidance.
•	You can also download a copy for your records.

💳 Step 2: Payment & Lodgement
•	We do not offer a fee-from-refund option.
•	You will receive a separate invoice via email, which must be paid before lodgement.
•	To pay by credit card, use the "Pay Now" function on the invoice (we receive an instant notification).
•	Alternatively, payment can be made via direct transfer (details will be on the invoice).
________________________________________
If you have any questions, feel free to reach out anytime—we're here to help!

📞 Call us at 1300 TAXTALK (1300 829 825).
Best regards,

  `,
  attachments: [
    { name: "Fee Schedule", url: "/attachments/tax returns/TAXTALK PTY LTD FEE SCHEDULE.pdf" },
  ],
  category: "Tax Returns",
},

{
  id: "TaxReturns7",
  subject: "Understanding Your Division 293 Tax Liability",
  body: `
Dear [Client's Name],
I wanted to take a moment to explain the Division 293 tax, which you’ve recently been assessed by the ATO. This tax is designed to reduce the superannuation tax concessions for high-income earners, ensuring a more balanced system.

What is Division 293 Tax?
Division 293 tax is an additional 15% tax on certain concessional superannuation contributions when your income and super contributions exceed $250,000. This means that instead of being taxed at the standard 15% concessional rate, some of your contributions will be taxed at 30%.

Who Does It Apply To?
You will be subject to Division 293 tax if your adjusted income (which includes taxable income, fringe benefits, investment losses, and concessional super contributions) exceeds $250,000.

How Is It Calculated?
•	If your total income (excluding super contributions) is below $250,000, but adding your super contributions pushes you over, only the excess amount is subject to the additional 15% tax.
•	If your total income (including super contributions) is above $250,000, the entire concessional contribution amount is subject to the 30% tax (15% standard + 15% additional).
For 2023-24, the concessional contributions cap remains at $27,500, which includes employer superannuation guarantee contributions, salary sacrifice, and personal contributions where a tax deduction has been claimed.
Example:
•	Your taxable income (excluding super): $240,000
•	Concessional super contributions: $20,000
•	Total adjusted income for Division 293 tax purposes: $260,000
•	Amount subject to additional 15% tax: $10,000 ($260,000 - $250,000)
•	Extra tax payable: $1,500 (15% of $10,000)

How Do You Pay Division 293 Tax?
•	The ATO will issue an assessment outlining your liability.
•	You can pay the tax directly or elect to release the funds from your superannuation to cover the cost.

What This Means for You
Effectively, this tax reduces the benefit of concessional super contributions by increasing the tax from 15% to 30% on affected amounts. However, superannuation remains a tax-effective long-term investment strategy, and we can discuss potential options to manage this impact moving forward.

If you have any questions or would like to review your superannuation strategy, feel free to reach out—I’m happy to assist.
Best regards,

  `,
  attachments: [

  ],
  category: "Tax Returns",
},

// {/* Technology */} -   // {/* Technology */} -   // {/* Technology */}
{
  id: "Technology1",
  subject: "How to scan documents with your smartphone ",
  body: `
Scanning using the Notes app (iOS)
https://youtu.be/10XH6VfGLqI - iPhone 
https://youtu.be/1EitQscr7gI - Galaxy

  `,
  attachments: [

  ],
  category: "Technology",
},

{
  id: "Technology2",
  subject: "Subject: We Appreciate Your Feedback!",
  body: `
Hi [Client's Name],
We truly appreciate your business and the opportunity to assist you.

We hope you had a great experience with our service, and if you have a moment, we would love for you to share your feedback! Your review helps us continue to improve and assist more clients like you.
📢 Click here to share your experience on our TaxTalk profile: https://shorturl.at/52SYY

Your support means the world to us! And of course, if you ever need anything, don’t hesitate to reach out—we’re always here to help.
Best regards,

  `,
  attachments: [
  ],
  category: "Technology",
},
];