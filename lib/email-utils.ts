import { EmailTemplate } from "@/types/email-template";
import mailtoLink from "mailto-link";

/**
 * Opens the user's default email client with a properly URL-encoded subject & body.
 * Note: Attachments cannot be directly appended in a mailto link;
 *       they must be manually attached by the user once the email client opens.
 */
export function generateEmail(template: EmailTemplate) {
  const { subject = "", body = "", attachments = [] } = template;

  // Generate the mailto URL using the mailto-link library
  const mailtoUrl = mailtoLink({
    subject,
    body,
  });

  // Open in new tab to avoid blocking
  window.open(mailtoUrl, "_blank");

  // Log a note about attachments
  if (attachments.length > 0) {
    console.log(
      "Note: The following attachments need to be manually added to the email:",
      attachments.map((a) => a.name).join(", ")
    );
  }
}
