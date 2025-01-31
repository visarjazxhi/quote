import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, subject, message, attachments } = await req.json();

    if (!to || !subject || !message) {
      console.error("❌ Missing required fields:", { to, subject, message });
      return NextResponse.json(
        { error: "Missing required fields: to, subject, message" },
        { status: 400 }
      );
    }

    const recipients = Array.isArray(to) ? to : [to];

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ SMTP credentials missing in .env");
      return NextResponse.json(
        { error: "Email service misconfigured" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // 587 also works
        secure: true, // true for 465, false for 587
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false, // 🔴 This bypasses strict certificate checks
        },
      });
      
      

    console.log("📨 Sending email to:", recipients);

    const formattedAttachments = attachments?.map((attachment: { filename: string; content: string }) => ({
      filename: attachment.filename,
      content: Buffer.from(attachment.content, "base64"),
      encoding: "base64",
    })) || [];

    const info = await transporter.sendMail({
      from: `"Accounting Company" <${process.env.EMAIL_USER}>`,
      to: recipients.join(","),
      subject,
      html: `<p>${message}</p>`,
      attachments: formattedAttachments,
    });

    console.log("✅ Email sent successfully:", info.messageId);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    const errorMessage = (error as Error).message;
    return NextResponse.json(
      { error: "Failed to send email", details: errorMessage },
      { status: 500 }
    );
  }
}
