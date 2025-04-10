import { EmailTemplate } from "@/types/email-template";

{/*  // Example email templates
  {
    id: "",
    subject: "",
    body: "",
    attachments: [
      { name: "", url: "/email_templates/" },
      { name: "", url: "/email_templates/" },
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
Watch here - https://youtu.be/TDTrMI-N9fU

Having Trouble Logging In?
If you share a laptop or computer, you might occasionally run into login issues. This is due to Xero’s enhanced security measures, designed to protect your account from cyber threats.

If clicking the 'Review Documents' button in the email doesn’t work, try this instead:
1) Go to Xero Portal - https://portal.xero.com/
2) Log in using the same email address where the documents were sent
3) This is the same as clicking 'Review Documents' in your email—once logged in, your documents should appear.

Still Having Issues?
Because Xero runs in your web browser, sometimes a quick cache refresh or clearing your browser cache can resolve login problems. 

If you’re still having trouble, feel free to call us at 1300 829 825—we’re happy to assist!

Best regards,

  `,
  attachments: [],
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
    { name: "Agent Nomination Instructions", url: "/email_templates/admin/Agent Nomination Instructions.pdf" },
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
    { name: "ATO Debt Plan", url: "/email_templates/bookkeeping/ATO Debt Plan Arrangment.docx" },

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
Each year, ASIC requires companies to pay an annual review fee to maintain their registration. For a proprietary company, the current fee is $321. 
Our office facilitates this process by sending all necessary documents to you via FuseSign. 
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
I hope you're doing well. 
As of [Date], the total outstanding amount is [Outstanding Amount].
We understand that financial obligations can sometimes be challenging to manage, and we are here to help you navigate this situation.
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
Please feel free to reach out to me if anything required.
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
    { name: "Constractors Super Fund", url: "/email_templates/practice/Contractors Super Fund Details.xlsx" },
    { name: "Employees Personal Detail Form", url: "/email_templates/practice/Employees Personal Detail Form (new).xlsx" },
    { name: "TFN Declaration Form", url: "/email_templates/practice/TFN_declaration_form_N3092.pdf" },
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
    { name: "Ethical Clearance Letter", url: "/email_templates/practice/Ethical Clearance Letter.docx" },
    { name: "Worksheet", url: "/email_templates/Worksheet.xlsx" },
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
    { name: "Ethical Letter - No Objection", url: "/email_templates/practice/Ethical Letter no.docx" },
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
    { name: "Ethical Letter - No Objection", url: "/email_templates/practice/Ethical Letter.docx" },
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
    { name: "IAA Fees", url: "/email_templates/practice/IAA Fees.pdf" },
    { name: "IAA Packages", url: "/email_templates/practice/IAA Packages.pdf" },
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
Please complete the steps below to get started:
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

💳 Step 2: Invoice & Payment
•	You will receive a separate email with your invoice for services rendered.
•	Payment is required before lodgement.
•	To pay by credit card, use the "Pay Now" function on the invoice (we receive an instant notification).
•	Alternatively, you can pay via direct transfer (details provided on the invoice).
________________________________________
We’re here to support you every step of the way! If you have any questions, please feel free to contact us at 1300 TAXTALK (1300 829 825).
Best regards,

  `,
  attachments: [

  ],
  category: "Practice",
},
{
  id: "Practice11",
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
Dear [Client],

Thank you for your interest. Please provide:

Company Details

Name & Alternative Name
Registered Business Name
Activity & Industry (be detailed)
Expected Turnover
GST Registration? (Yes/No)
Immediate Employees? (Yes/No; how many?)
Addresses

Registered Office (must be in Australia)
Principal Place of Business (if different)
Officeholders

Full Name, DOB, Place of Birth
Residential Address (at least one Australian resident)
Email, Mobile, TFN (if any), Director ID (we can assist)
Shareholders

Full Name, DOB, Place of Birth
Address, TFN (if any), Shares & Ownership %
If trust/company, please provide documents
Other

ASIC Registered Agent? (Yes/No)
Company Bank Account? (Yes/No)
Company Constitution? (Yes/No)
PAYG Withholding? (Yes/No)
Call 1300 TAXTALK (1300 829 825) or reply by email. We look forward to helping you set up your company.

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
    { name: "TFN Application Form", url: "/email_templates/setup/IND-TFN- NAT2628.pdf" },
    { name: "TFN Application Electronic form", url: "/email_templates/setup/TFN Application electronic form.pdf" },
  ],
  category: "Setup",
},
{
  id: "Setup4",
  subject: "Setting Up Your ATO Online Services Access",
  body: `
Dear [Client's Name],
I hope you're doing well.
To help you set up access to ATO Online Services, please follow the steps below. 
What You’ll Need:
•	myGovID – A secure app that allows you to prove your identity online.
•	Relationship Authorisation Manager.
💡 Note: myGovID is different from myGov (which you may already use for Centrelink, Medicare, and the ATO).
________________________________________
Step 1: Set Up Your myGovID
1.	Download the myGovID app from the App Store or Google Play.
2.	Follow the prompts to enter your full name, date of birth, and email address.
3.	Verify two forms of ID (e.g., driver’s licence, passport, or Medicare card).
________________________________________
Step 2: Link Your myGovID to Your Business Using RAM
•	If no one has linked the business yet, follow the steps here: https://info.authorisationmanager.gov.au/principal-authority
•	If someone else has already set up access, they can authorise you through RAM.
________________________________________
Step 3: Log In to Online Services for Business
•	Enter your email address at the login screen.
•	A 4-digit code will appear—enter this in the myGovID app to authenticate.
•	Access ATO Online Services for Business here: https://www.ato.gov.au/General/Online-services/Businesses/
________________________________________

Feel free to reach out.
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
Dear [Client],

Thank you for contacting us about setting up your [Unit/Discretionary] Trust. Please provide:

Trust Details

Trust Type: [Unit / Discretionary]
Proposed Name (3 preferences)
Settlor Name & Address
Initial Settlement Amount (usually $10)
Trustee Information

Individual Trustee(s):
Name, DOB, Residential Address, TFN (if any), Email & Phone
Corporate Trustee:
Company Name & ACN (if existing)
Registered Office & Principal Place of Business
Appointor (Discretionary Only)

Name, Residential Address
Beneficiaries (Discretionary Only)

Primary & General Beneficiaries (e.g. family members, charities, etc.)
Unit Holders (Unit Trust Only)

Name/Entity, Address, TFN/ACN (if any), Units Held & % Ownership
Corporate Trustee (If Applicable)

Company Name/Proposed Name
Registered Office, Principal Place of Business
Director/Secretary Details: Name, Address, DOB, TFN (if any), Email & Phone
Shareholder Details: Name/Entity, Address, Shares, TFN/ACN (if any)
Additional Info

ABN & TFN Applications needed? (Yes/No)
GST Registration? (Yes/No)
WorkCover Registration? (Yes/No)
Bank Account Setup? (Yes/No)
Stamp Duty (if applicable)
Next Steps
Once we have these details, we’ll prepare the Trust Deed and documents for review and signing.

If you have any questions, please call 1300 TAXTALK (1300 829 825).

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
  subject: "SuperStream Rollover to SMSF – Process Overview",
  body: `
What is SuperStream?
A mandatory electronic system for rollovers—no paper forms, no cheques, no manual handling.

Rollover Steps (Industry Fund → SMSF)
Update SMSF Details with ATO – Bank, ESA, and contact details must be current.
Request Rollover – Submit via the industry fund’s portal/form with ATO-matching details.
Fund Verifies SMSF – ATO checks compliance and detail accuracy. Mismatches = rejection.
Electronic Transfer – Funds and data sent via SuperStream to SMSF’s bank & ESA.
Confirm & Record – Verify deposit and record rollover data.
Required Info
✔ SMSF ABN (active), bank details, and ESA (e.g., BGL, Class, AUSPOST).
✔ Member details (Name, DOB, TFN).
✔ Completed rollover request form or portal submission.

Avoid Delays
❌ Outdated ATO records (ESA, bank, member details).
❌ SMSF flagged as non-compliant.
❌ No ESA = No rollover.

Key Takeaways
✔ Fully electronic process.
✔ Accurate ATO records prevent delays.
✔ No manual rollovers or cheques.
✔ Keep records for compliance.
Best regards,

  `,
  attachments: [
    { name: "SMSF Rollover Request", url: "/email_templates/setup/SMSF Rollover Request.docx" },

  ],
  category: "Setup",
},

{
  id: "Setup9",
  subject: "Setting up your company and family trust",
  body: `
Hi [Client Name],

Can you please provide us the following details.

Company (Pty Ltd) Setup

1. Proposed Company Name:
Preferred:
Alternative (if unavailable):

2. Registered Office Address:
(Must be a physical Australian address):

3. Principal Place of Business (if different):

4. Director(s) and Secretary:
For each person:
•	Full Name:
•	Residential Address:
•	Date of Birth:
•	Place of Birth (City & Country):
•	Role: (e.g. Director / Secretary / Both)

5. Shareholder(s):
For each:
•	Full Name / Company Name:
•	Address:
•	Number of Shares:
•	Share Class (e.g. Ordinary):
•	Amount Paid per Share:
•	Acting as trustee for a trust? (Yes/No) If yes, Trust Name:

6. Total Number of Shares to be Issued:
(e.g. 100 @ $1 each)
Discretionary (Family) Trust Setup
1. Proposed Name of Trust:
2. Trustee:
(Individual or Company):
If company, please provide name and ACN:

3. Settlor:
(Independent third party, cannot be a beneficiary)
•	Full Name:
•	Residential Address:

4. Appointor(s):
(Has power to replace trustee)
•	Full Name(s):
•	Residential Address(es):
5. Primary Beneficiaries:
(e.g., you and your spouse or family group):

6. Default Beneficiaries (optional):

Best regards,

  `,
  attachments: [
    { name: "SMSF Rollover Request", url: "/email_templates/setup/SMSF Rollover Request.docx" },

  ],
  category: "Setup",
},

// {/* Tax Returns */} -   // {/* Tax Returns */} -   // {/* Tax Returns */}
{
  id: "TaxReturns1",
  subject: "Action Required – Review & Verification of Your Tax Return",
  body: `
Hi [Client],

It was great catching up! I’ve sent your tax return for review—please sign once you’re satisfied.

Before Signing

Verify all claims.
Provide receipts/supporting documents for deductions (for compliance).
ATO Substantiation Rules

Expenses must be work-related.
You need proof of the expense (receipt/invoice).
You must have personally paid (not reimbursed).
Specific Claims

Vehicle: Keep an ATO-compliant logbook and all receipts. Bank statements alone aren’t enough.
Home Office: Keep a diary of hours; if full-time (38 hrs/week), let me know if you work more. Provide receipts, and confirm the office area as a % of your home.
Please send any required documents. Feel free to reach out with questions.

Best regards,
[Your Name]

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
Dear [Client],

I hope you’re well. To maximize your deductions, please let me know if any of the following apply:

Car & Travel

Work-related kilometers (excluding home-work commute)
Tolls, parking
Work travel (e.g. flights, accommodation, meals)
Clothing, Laundry & Dry Cleaning

Uniform costs (purchased vs. employer-supplied)
Laundry/dry cleaning
Self-Education

Course details (name, institution, cost, relevance to work)
Other Work Expenses

Mobile phone (monthly cost & % for work)
Working from home (hrs/week before & after 1 Mar 2020)
Subscriptions/memberships (e.g. professional journals)
Union fees
Licenses/registrations
Internet (% used for work)
Reference materials (books, magazines)
Depreciable Expenses

Any work-related equipment over $300 (date, cost)
Investment Deductions

Interest/dividends earned + associated costs
Charitable Donations

Donations of $2+ (charity name & amount)
Tax & Super

Last year’s tax return prep fee
Personal super contributions (claim as deduction?)
Income Protection

Policy cost
Please send any relevant details and receipts. Let me know if you have any questions!

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
Hi [Client's Name],
Thank you for reaching out!

Getting Started: Your Onboarding Process

✅ Step 1: Register as a New Client
•	Sign up and register your details here: https://taxtalk.com.au/register
•	Use a unique email address that only you can access (not shared with others).

✅ Step 2: Complete Your Profile
Once registered, you will have access to your documents folder, where you can:
•	Upload a copy of your ID for verification (ensure it’s saved under the correct financial year).
•	Name and organize documents correctly by financial year.
•	Book an appointment (Phone, Face-to-Face, Teams, or Zoom).

📂 Need checklists, pricing, or resources? Once logged in, you can access our Resource HUB.
________________________________________
What Happens After Your Tax Return is Completed?
📄 Step 1: Signing & Lodging Your Tax Return
•	Once finalised, you will receive an email notification to review and sign electronically.

💳 Step 2: Payment & Lodgement
•	We do not offer a fee-from-refund option.
•	You will receive a separate invoice via email, which must be paid before lodgement.
•	To pay by credit card, use the "Pay Now" function on the invoice.
________________________________________
If you have any questions, feel free to call us at 1300 TAXTALK (1300 829 825).
Best regards,

  `,
  attachments: [
    { name: "Fee Schedule", url: "/email_templates/tax returns/TAXTALK PTY LTD FEE SCHEDULE.pdf" },
  ],
  category: "Tax Returns",
},

{
  id: "TaxReturns7",
  subject: "Understanding Your Division 293 Tax Liability",
  body: `
Dear [Client],

What Is Division 293 Tax?
An extra 15% tax on concessional super contributions once your income + contributions exceed $250,000.

Who Pays It?
Anyone whose adjusted income (taxable income, fringe benefits, investment losses, and concessional contributions) is over $250,000.

How It’s Calculated

If adding your super contributions pushes you over $250,000, only the excess amount is taxed at the extra 15%.
If you’re already over $250,000 (including contributions), the entire concessional amount is taxed at 30% (15% normal + 15% additional).
Paying It

The ATO issues an assessment; you can pay directly or release funds from super.
Impact
This effectively raises the tax on some super contributions from 15% to 30%. Despite this, super remains a tax-effective strategy. If you have questions or want to review your super plan, let me know.

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