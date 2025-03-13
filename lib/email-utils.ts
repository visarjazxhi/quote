import { EmailTemplate } from "@/types/email-template";

export function generateEmail(template: EmailTemplate) {
  const { subject, body, attachments } = template;

  // Create mailto URL with plain text body
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Open default email client
  window.open(mailtoUrl, "_blank");

  // Log information about attachments since they can't be directly included in mailto
  if (attachments.length > 0) {
    console.log("Note: Attachments need to be manually added to the email:", attachments.map((a) => a.name).join(", "));
  }
}