import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { subject, body, attachments } = await request.json();

  // Generate attachment links
  const attachmentLinks = attachments
    .map((attachment: { name: string; url: string }) => {
      return `${attachment.name}: ${process.env.NEXT_PUBLIC_SITE_URL}${attachment.url}`;
    })
    .join("\n");

  // Construct the email body with attachment links
  const emailBody = `${body}\n\nAttachments:\n${attachmentLinks}`;

  // Return the email content
  return NextResponse.json({
    mailtoUrl: `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`,
  });
}