"use client";

import { useState, useEffect } from "react";
import { Paperclip, Eye, Send, Download, Copy } from "lucide-react"; // Import Copy icon
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { EmailTemplate } from "@/types/email-template";
import { generateEmail } from "@/lib/email-utils";
import toast from "react-hot-toast"; // Import React Hot Toast

interface EmailTemplateCardProps {
  template: EmailTemplate;
  onView: () => void;
}

export function EmailTemplateCard({ template, onView }: EmailTemplateCardProps) {
  const { subject, body, attachments } = template;
  const [plainTextBody, setPlainTextBody] = useState("");

  // Convert HTML to plain text on the client side
  useEffect(() => {
    const doc = new DOMParser().parseFromString(body, "text/html");
    setPlainTextBody(doc.body.textContent || "");
  }, [body]);

  // Function to copy plain text to clipboard
  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(plainTextBody).then(() => {
        toast.success("Text copied to clipboard!"); // Show toast
      }).catch((error) => {
        console.error("Failed to copy text:", error); // Debugging: Check for errors
        toast.error("Failed to copy text. Please try again."); // Show error toast
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = plainTextBody;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("Text copied to clipboard!"); // Show toast
      } catch (error) {
        console.error("Failed to copy text:", error); // Debugging: Check for errors
        toast.error("Failed to copy text. Please try again."); // Show error toast
      }
      document.body.removeChild(textArea);
    }
  };

  const handleSendEmail = () => {
    generateEmail({ ...template, body: plainTextBody }); // Use plain text for email
  };

  // Function to handle file download
  const handleDownload = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
  };

  // Function to download all attachments
  const handleDownloadAll = () => {
    attachments.forEach((attachment) => {
      handleDownload(attachment.url, attachment.name);
    });
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold line-clamp-1">{subject}</CardTitle>
          {/* Copy icon in the top-right corner of the card */}
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-md hover:bg-gray-100"
            title="Copy text"
          >
            <Copy className="h-6 w-6 text-green-600" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Display plain text in the card */}
        <p className="text-sm text-muted-foreground line-clamp-4 mb-3">
          {plainTextBody}
        </p>

        {attachments.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium mb-2">Supporting Attachments</h4>
            <div className="flex flex-wrap gap-2">
              {attachments.map((attachment, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleDownload(attachment.url, attachment.name)}
                >
                  <Paperclip className="h-3 w-3" />
                  <span className="text-xs truncate max-w-[80px]">{attachment.name}</span>
                  <Download className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-between gap-2">
        <Button variant="success" size="sm" onClick={onView} className="flex-1">
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        {attachments.length > 0 && (
          <Button variant="indigo" size="sm" onClick={handleDownloadAll} className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download All
          </Button>
        )}
        <Button variant="default" size="sm" onClick={handleSendEmail} className="flex-1">
          <Send className="h-4 w-4 mr-2" />
          Generate
        </Button>
      </CardFooter>
    </Card>
  );
}