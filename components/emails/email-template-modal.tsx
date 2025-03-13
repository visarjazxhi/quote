"use client";

import { useState, useEffect } from "react";
import { Paperclip, Download, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { EmailTemplate } from "@/types/email-template";
import { generateEmail } from "@/lib/email-utils";
import toast from "react-hot-toast"; // Import React Hot Toast

interface EmailTemplateModalProps {
  template: EmailTemplate;
  isOpen: boolean;
  onClose: () => void;
}

export function EmailTemplateModal({ template, isOpen, onClose }: EmailTemplateModalProps) {
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

  // Function to generate email with plain text only
  const handleSendEmail = () => {
    generateEmail({ ...template, body: plainTextBody }); // Use plain text for email
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{subject}</DialogTitle>
          {/* Copy icon in the top-right corner */}
          <button
            onClick={copyToClipboard}
            className="absolute top-0 right-10 p-2 rounded-md hover:bg-gray-100"
            title="Copy text"
          >
            <Copy className="h-6 w-6 text-green-600" />
          </button>
        </DialogHeader>

        <div className="mt-4">
          {/* Render HTML content */}
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: body }}
          />

          {attachments.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Supporting Attachments ({attachments.length})</h4>
              <div className="flex flex-wrap gap-2">
                {attachments.map((attachment, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 py-1.5 cursor-pointer"
                    onClick={() => handleDownload(attachment.url, attachment.name)}
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                    <span>{attachment.name}</span>
                    <Download className="h-3.5 w-3.5 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {attachments.length > 0 && (
            <Button variant="outline" onClick={handleDownloadAll}>
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          )}
          <Button onClick={handleSendEmail}>Generate Email</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}