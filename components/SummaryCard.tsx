"use client";

import { ChevronRight, Download, Mail, Plus, Save, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ServiceSection, useEstimationStore } from "@/lib/store";
import { useCallback, useEffect, useState } from "react";

import { Button } from "./ui/button";
import ClientWrapper from "./ClientWrapper";
import { Input } from "./ui/input";
import { jsPDF } from "jspdf";
import { saveQuoteToDatabase } from "@/lib/quote-utils";
import { toast } from "sonner";

const getValidSections = (sections: ServiceSection[]) => {
  return sections.filter((section) => {
    // Check if the section has at least one valid service
    return section.services.some((service) => {
      if (service.type === "withOptions") {
        return service.selectedOption && service.quantity;
      } else if (service.type === "fixedCost") {
        return service.value !== undefined;
      } else if (service.type === "manualInput") {
        return (
          service.customDescription &&
          service.customAmount &&
          service.customRate
        );
      } else if (service.type === "rnD") {
        return service.rdExpenses !== undefined && service.rdExpenses > 0;
      }
      return false;
    });
  });
};

interface SummaryCardProps {
  currentQuoteId?: string;
  onQuoteSaved?: (quoteId: string) => void;
  onToggleVisibility?: () => void;
}

export default function SummaryCard({
  currentQuoteId,
  onQuoteSaved,
  onToggleVisibility,
}: SummaryCardProps = {}) {
  const {
    sections,
    clientInfo,
    getServiceOptions,
    totalCost,
    discount,
    feesCharged,
    updateFeesCharged,
  } = useEstimationStore();
  const [emails, setEmails] = useState<string>("");
  const [emailList, setEmailList] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize email list from comma-separated emails
  useEffect(() => {
    if (emails) {
      const emailArray = emails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);
      setEmailList(emailArray);
    } else {
      setEmailList([]);
    }
  }, [emails]);

  // Get total with fallback to prevent undefined errors
  const total = mounted ? totalCost() : 0;

  const addEmail = () => {
    if (newEmail.trim()) {
      const trimmedEmail = newEmail.trim().toLowerCase();
      // Basic email validation
      if (!trimmedEmail.includes("@") || !trimmedEmail.includes(".")) {
        toast.error("Please enter a valid email address");
        return;
      }
      if (!emailList.includes(trimmedEmail)) {
        const updatedList = [...emailList, trimmedEmail];
        setEmailList(updatedList);
        setEmails(updatedList.join(", "));
        setNewEmail("");
      } else {
        toast.error("Email address already added");
        setNewEmail("");
      }
    }
  };

  const removeEmail = (indexToRemove: number) => {
    const updatedList = emailList.filter((_, index) => index !== indexToRemove);
    setEmailList(updatedList);
    setEmails(updatedList.join(", "));
  };

  const handleEmailModalSend = async () => {
    if (emailList.length === 0) {
      toast.error("Please add at least one email address");
      return;
    }

    // Update the main emails state and trigger send
    setEmails(emailList.join(", "));
    setIsEmailModalOpen(false);

    // Call the email function directly with the email list
    await handleEmailEstimate(emailList);
  };

  const handleSaveQuote = async () => {
    try {
      setIsSaving(true);
      const quoteId = await saveQuoteToDatabase(currentQuoteId);

      // Small delay to ensure database operation is complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (onQuoteSaved) {
        await onQuoteSaved(quoteId);
      }

      // Clear form after successful save for new quote
      if (!currentQuoteId) {
        // Reset all form data
        const store = useEstimationStore.getState();

        // Reset all sections
        store.sections.forEach((section) => {
          section.services.forEach((service) => {
            if (service.type === "withOptions") {
              service.selectedOption = undefined;
              service.quantity = undefined;
              service.useCustomRate = false;
              service.customRate = undefined;
            } else if (service.type === "fixedCost") {
              service.value = undefined;
            } else if (service.type === "manualInput") {
              service.customDescription = undefined;
              service.customAmount = undefined;
              service.customRate = undefined;
            } else if (service.type === "rnD") {
              service.rdExpenses = undefined;
            }
          });
        });

        // Reset client info
        store.updateClientGroup("");
        store.updateClientAddress("");
        store.updateContactPerson("");

        // Clear all entities
        const currentEntities = [...store.clientInfo.entities];
        currentEntities.forEach((entity) => {
          store.removeEntity(entity.id);
        });

        // Reset discount and fees
        store.updateDiscount("description", "");
        store.updateDiscount("amount", 0);
        store.updateFeesCharged(0);
      }

      toast.success(
        currentQuoteId
          ? "Quote updated successfully!"
          : "Quote saved successfully!"
      );
    } catch (error) {
      console.error("Error saving quote:", error);
      toast.error("Failed to save quote. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const generatePDFContent = useCallback(() => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 20; // Bottom margin

    // Function to add header to each page
    const addHeader = () => {
      // Define the logo URL and header height
      const logoUrl = "/2.png"; // Replace with the actual image path
      const headerHeight = 30; // Height of the header section

      // Define the desired width for the logo
      const logoWidth = 50; // Adjust as needed
      const logoAspectRatio = 1920 / 536; // Image aspect ratio
      const logoHeight = logoWidth / logoAspectRatio; // Maintain aspect ratio

      // Center the logo within its container
      const logoX = 20; // Adjust as needed
      const logoY = headerHeight / 2 - logoHeight / 2; // Center within header

      // Add logo while maintaining aspect ratio
      doc.addImage(logoUrl, "PNG", logoX, logoY, logoWidth, logoHeight);

      // Add contact information
      doc.setFontSize(10);
      doc.setTextColor(100); // Gray color for contact info
      doc.text("Integritas Accountants and Advisers Pty Ltd", 80, 15);
      doc.text("Level 1/75 Moreland St, Footscray, 3011", 80, 20);
      doc.text("Phone: 1300 829 825 | Email: info@integritas.com.au", 80, 25);

      // Draw a horizontal line below the header
      doc.setDrawColor(200); // Light gray color for the line
      doc.line(20, headerHeight, 190, headerHeight);

      return headerHeight + 15; // Return starting Y position for content
    };

    // Function to check if we need a new page
    const checkPageBreak = (currentY: number, requiredSpace: number) => {
      if (currentY + requiredSpace > pageHeight - marginBottom) {
        doc.addPage();
        return addHeader();
      }
      return currentY;
    };

    // Add initial header
    let yPosition = addHeader();

    // Add date at top right
    yPosition = checkPageBreak(yPosition, 15);
    doc.setFontSize(10);
    doc.setTextColor(100);
    const currentDate = new Date().toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    doc.text(`Date: ${currentDate}`, 190, yPosition, { align: "right" });
    yPosition += 6;

    // Add centered "Quotation" title - bigger font
    yPosition = checkPageBreak(yPosition, 20);
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Quotation", 105, yPosition, { align: "center" });
    doc.setFont("helvetica", "normal");
    yPosition += 10;

    // Add client group name if available
    if (clientInfo.clientGroup) {
      yPosition = checkPageBreak(yPosition, 15);
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text(`${clientInfo.clientGroup}`, 20, yPosition);
      doc.setFont("helvetica", "normal");
      yPosition += 15;
    }

    // Add "To the Directors of:" section with entities (underlined)
    const entitiesWithData = clientInfo.entities.filter(
      (entity) => entity.name
    );
    if (entitiesWithData.length > 0) {
      yPosition = checkPageBreak(yPosition, 30);
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text("To the Directors of:", 20, yPosition);
      // Add underline
      const textWidth = doc.getTextWidth("To the Directors of:");
      doc.line(20, yPosition + 1, 20 + textWidth, yPosition + 1);
      yPosition += 5;

      entitiesWithData.forEach((entity) => {
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text(`${entity.name}`, 20, yPosition);
        yPosition += 6;
      });
      yPosition += 6;
    }

    // Add Attention section (underlined)
    if (clientInfo.contactPerson) {
      yPosition = checkPageBreak(yPosition, 20);
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text("Attention:", 20, yPosition);
      // Add underline
      const attentionWidth = doc.getTextWidth("Attention:");
      doc.line(20, yPosition + 1, 20 + attentionWidth, yPosition + 1);
      yPosition += 6;
      doc.text(`${clientInfo.contactPerson}`, 20, yPosition);
      yPosition += 6;
    }

    // Add address if available
    if (clientInfo.address) {
      yPosition = checkPageBreak(yPosition, 10);
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(`${clientInfo.address}`, 20, yPosition);
      yPosition += 15;
    }

    // Add introduction paragraph
    doc.setFontSize(10);
    doc.setTextColor(0);
    const introText =
      "Thank you for considering Integritas Accountants and Advisers for your accounting and advisory needs. We are pleased to present this proposal outlining our professional services tailored to your specific requirements.";
    const splitIntro = doc.splitTextToSize(introText, 170);
    doc.text(splitIntro, 20, yPosition);
    yPosition += splitIntro.length * 5 + 10;

    // Filter sections with valid services
    const validSections = getValidSections(sections);

    if (validSections.length > 0) {
      // Add services section header
      yPosition = checkPageBreak(yPosition, 30);
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Professional Services", 20, yPosition);
      yPosition += 10;

      // Add column headers with better spacing
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text("Service Description", 20, yPosition);
      doc.text("Hours", 130, yPosition, { align: "center" });
      doc.text("Rate", 155, yPosition, { align: "center" });
      doc.text("Amount", 190, yPosition, { align: "right" });
      yPosition += 5;

      // Add a line under headers
      doc.setDrawColor(200);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 8;

      // Add services by section
      validSections.forEach((section) => {
        // Section header
        yPosition = checkPageBreak(yPosition, 20);
        doc.setFontSize(10);
        doc.setTextColor(50);
        doc.setFont("helvetica", "bold");
        doc.text(`${section.name.toUpperCase()}`, 20, yPosition);
        doc.setFont("helvetica", "normal"); // Reset to normal font
        yPosition += 8;

        // Services in this section
        section.services.forEach((service) => {
          if (
            service.type === "withOptions" &&
            service.selectedOption &&
            service.quantity
          ) {
            const serviceOptions = getServiceOptions(section.id, service.id);
            const selectedOption = serviceOptions.find(
              (opt) => opt.value === service.selectedOption
            );
            if (!selectedOption) return;

            // Use custom rate if enabled, otherwise use selected option rate
            const rate =
              service.useCustomRate && service.customRate !== undefined
                ? service.customRate
                : selectedOption.rate;

            const totalAmount = rate * service.quantity;

            // Find the original service definition to get description
            const originalService = sections
              .find((s) => s.id === section.id)
              ?.services.find((s) => s.id === service.id);

            // Check if we need space for service + description
            const estimatedServiceHeight = originalService?.description
              ? 40
              : 15;
            yPosition = checkPageBreak(yPosition, estimatedServiceHeight);

            // Service name
            doc.setFontSize(9);
            doc.setTextColor(0);
            const serviceName = doc.splitTextToSize(service.name, 95);
            doc.text(serviceName, 25, yPosition);

            // Hours, Rate, Investment on the same line as service name
            doc.setTextColor(100);
            doc.text(`${service.quantity}`, 130, yPosition, {
              align: "center",
            });

            doc.text(`$${rate.toFixed(0)}`, 155, yPosition, {
              align: "center",
            });

            doc.setTextColor(0);
            doc.text(`$${totalAmount.toFixed(2)}`, 190, yPosition, {
              align: "right",
            });

            yPosition += serviceName.length * 4 + 2;

            // Add service description below the service name
            if (originalService?.description) {
              doc.setFontSize(8);
              doc.setTextColor(120);
              const description = doc.splitTextToSize(
                originalService.description,
                90
              );
              doc.text(description, 25, yPosition);
              yPosition += description.length * 3 + 3;
            }
          } else if (
            service.type === "fixedCost" &&
            service.value !== undefined
          ) {
            // Find the original service definition to get description
            const originalService = sections
              .find((s) => s.id === section.id)
              ?.services.find((s) => s.id === service.id);

            // Check if we need space for service + description
            const estimatedServiceHeight = originalService?.description
              ? 40
              : 15;
            yPosition = checkPageBreak(yPosition, estimatedServiceHeight);

            // Fixed cost service name
            doc.setFontSize(9);
            doc.setTextColor(0);
            const serviceName = doc.splitTextToSize(service.name, 95);
            doc.text(serviceName, 25, yPosition);

            // Investment
            doc.text(`$${service.value.toFixed(2)}`, 190, yPosition, {
              align: "right",
            });

            yPosition += serviceName.length * 4 + 2;

            // Add service description below the service name
            if (originalService?.description) {
              doc.setFontSize(8);
              doc.setTextColor(120);
              const description = doc.splitTextToSize(
                originalService.description,
                90
              );
              doc.text(description, 25, yPosition);
              yPosition += description.length * 3 + 3;
            }
          } else if (
            service.type === "manualInput" &&
            service.customDescription &&
            service.customAmount !== undefined &&
            service.customRate !== undefined
          ) {
            const totalAmount = service.customAmount * service.customRate;

            // Check if we need space for service + description
            const estimatedServiceHeight = service.customDescription ? 40 : 15;
            yPosition = checkPageBreak(yPosition, estimatedServiceHeight);

            // Manual Input service name
            doc.setFontSize(9);
            doc.setTextColor(0);
            const serviceName = doc.splitTextToSize(service.name, 95);
            doc.text(serviceName, 25, yPosition);

            // Amount, Rate, Investment on the same line as service name
            doc.setTextColor(100);
            doc.text(`${service.customAmount}`, 130, yPosition, {
              align: "center",
            });

            doc.text(`$${service.customRate.toFixed(0)}`, 155, yPosition, {
              align: "center",
            });

            doc.setTextColor(0);
            doc.text(`$${totalAmount.toFixed(2)}`, 190, yPosition, {
              align: "right",
            });

            yPosition += serviceName.length * 4 + 2;

            // Add service description below the service name
            if (service.customDescription) {
              doc.setFontSize(8);
              doc.setTextColor(120);
              const description = doc.splitTextToSize(
                service.customDescription,
                90
              );
              doc.text(description, 25, yPosition);
              yPosition += description.length * 3 + 3;
            }
          } else if (
            service.type === "rnD" &&
            service.rdExpenses !== undefined &&
            service.rdExpenses > 0
          ) {
            // R&D calculation
            const refundAmount = service.rdExpenses * 0.435;
            const ourFees = Math.max(refundAmount * 0.1, 2500);

            // Check if we need space for R&D service
            yPosition = checkPageBreak(yPosition, 25);

            // R&D service name
            doc.setFontSize(9);
            doc.setTextColor(0);
            const serviceName = doc.splitTextToSize(service.name, 95);
            doc.text(serviceName, 25, yPosition);

            // R&D Expenses and Our Fees
            doc.setTextColor(100);
            doc.text(
              `$${service.rdExpenses.toLocaleString()}`,
              130,
              yPosition,
              {
                align: "center",
              }
            );

            doc.text(`43.5%`, 155, yPosition, {
              align: "center",
            });

            doc.setTextColor(0);
            doc.text(`$${ourFees.toFixed(2)}`, 190, yPosition, {
              align: "right",
            });

            yPosition += serviceName.length * 4 + 2;

            // Add R&D calculation details
            doc.setFontSize(8);
            doc.setTextColor(120);
            const rdDetails = [
              `R&D Expenses: $${service.rdExpenses.toLocaleString()}`,
              `Refund Amount (43.5%): $${refundAmount.toLocaleString()}`,
              `Our Fees (10% min $2,500): $${ourFees.toLocaleString()}`,
            ];
            rdDetails.forEach((detail, index) => {
              doc.text(detail, 25, yPosition + index * 4);
            });
            yPosition += rdDetails.length * 4 + 3;
          }
        });
        yPosition += 5; // Space between sections
      });

      // Add discount if applicable
      if (discount.amount > 0) {
        yPosition = checkPageBreak(yPosition, 25);
        yPosition += 5;
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text("DISCOUNT APPLIED", 20, yPosition);
        yPosition += 6;

        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(discount.description || "Special Discount", 25, yPosition);
        doc.setTextColor(0);
        doc.text(`-$${discount.amount.toFixed(2)}`, 190, yPosition, {
          align: "right",
        });
        yPosition += 8;
      }

      // Total section
      yPosition = checkPageBreak(yPosition, 50);
      yPosition += 5;
      doc.setDrawColor(0);
      doc.line(120, yPosition, 190, yPosition);
      yPosition += 8;

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Total Value of Service:", 100, yPosition);
      doc.setFontSize(14);
      doc.text(`$${(total || 0).toFixed(2)}`, 190, yPosition, {
        align: "right",
      });
      yPosition += 6;

      // Add fees charged section if there's a value
      if (feesCharged > 0) {
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("Fees Charged for this service:", 100, yPosition);
        doc.setFontSize(14);
        doc.text(`$${feesCharged.toFixed(2)}`, 190, yPosition, {
          align: "right",
        });
        yPosition += 15;
      }
    }

    // Add closing paragraph
    yPosition = checkPageBreak(yPosition, 40);
    doc.setFontSize(10);
    doc.setTextColor(0);
    const closingText =
      "All fees are quoted in Australian dollars and exclude GST where applicable. We look forward to the opportunity to work with you and provide exceptional service tailored to your needs.";
    const splitClosing = doc.splitTextToSize(closingText, 170);
    doc.text(splitClosing, 20, yPosition);
    yPosition += splitClosing.length * 5 + 15;

    // Add signature section
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Yours sincerely,", 20, yPosition);
    yPosition += 6;
    doc.text("Domenic Barba", 20, yPosition);
    yPosition += 20;

    doc.text("Integritas Accountants and Advisers", 20, yPosition);
    yPosition += 6;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("Professional Accounting Services", 20, yPosition);

    return doc;
  }, [sections, clientInfo, getServiceOptions, discount, feesCharged, total]);

  const handleDownloadPDF = useCallback(async () => {
    const doc = generatePDFContent();
    doc.save("estimate.pdf");

    // Update quote status to DOWNLOADED if we have a saved quote
    if (currentQuoteId) {
      try {
        await fetch(`/api/quotes/${currentQuoteId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "DOWNLOADED" }),
        });
      } catch (error) {
        console.error("Error updating quote status:", error);
      }
    }
  }, [generatePDFContent, currentQuoteId]);

  // Add event listener for download PDF events from QuoteList
  useEffect(() => {
    const handleDownloadEvent = () => {
      handleDownloadPDF();
    };

    const handleDownloadFromDataEvent = (event: CustomEvent) => {
      handleDownloadPDFFromData(event.detail.quoteData);
    };

    window.addEventListener("downloadPDF", handleDownloadEvent);
    window.addEventListener(
      "downloadPDFFromData",
      handleDownloadFromDataEvent as EventListener
    );

    return () => {
      window.removeEventListener("downloadPDF", handleDownloadEvent);
      window.removeEventListener(
        "downloadPDFFromData",
        handleDownloadFromDataEvent as EventListener
      );
    };
  }, [handleDownloadPDF]);

  const handleDownloadPDFFromData = async (quoteData: {
    id?: string;
    clientGroup?: string;
    contactPerson?: string;
    address?: string;
    entities?: Array<{ name: string; entityType: string }>;
    services?: Array<{ serviceName: string }>;
    feesCharged?: number;
  }) => {
    try {
      // Generate PDF using the provided quote data instead of current store state
      const doc = new jsPDF();

      // Function to add header to each page
      const addHeader = () => {
        // Logo and company info
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("INTEGRITAS TECHNOLOGIES", 20, 25);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Professional Services Proposal", 20, 35);

        // Client information from quote data
        if (quoteData.clientGroup || quoteData.contactPerson) {
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("Client Information", 20, 50);

          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          let yPos = 60;

          if (quoteData.clientGroup) {
            doc.text(`Client Group: ${quoteData.clientGroup}`, 20, yPos);
            yPos += 8;
          }

          if (quoteData.contactPerson) {
            doc.text(`Contact Person: ${quoteData.contactPerson}`, 20, yPos);
            yPos += 8;
          }

          if (quoteData.address) {
            doc.text(`Address: ${quoteData.address}`, 20, yPos);
            yPos += 8;
          }

          return yPos + 10;
        }

        return 60;
      };

      let currentY = addHeader();

      // Add entities section
      if (quoteData.entities && quoteData.entities.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Entities", 20, currentY);
        currentY += 10;

        quoteData.entities.forEach((entity) => {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(`• ${entity.name} (${entity.entityType})`, 25, currentY);
          currentY += 6;
        });

        currentY += 10;
      }

      // Add services section (simplified - you may want to expand this)
      if (quoteData.services && quoteData.services.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Services", 20, currentY);
        currentY += 10;

        quoteData.services.forEach((service) => {
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          doc.text(`• ${service.serviceName}`, 25, currentY);
          currentY += 6;
        });

        currentY += 10;
      }

      // Add total (if available)
      if (quoteData.feesCharged) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Total: $${quoteData.feesCharged.toFixed(2)}`, 20, currentY);
      }

      // Generate filename
      const clientName =
        quoteData.clientGroup || quoteData.contactPerson || "Client";
      const filename = `Integritas_Proposal_${clientName.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      )}_${new Date().toISOString().split("T")[0]}.pdf`;

      // Download the PDF
      doc.save(filename);

      // Update quote status to DOWNLOADED if it has an ID
      if (quoteData.id) {
        try {
          await fetch(`/api/quotes/${quoteData.id}/status`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "DOWNLOADED" }),
          });
        } catch (error) {
          console.error("Failed to update quote status:", error);
        }
      }
    } catch (error) {
      console.error("Error generating PDF from data:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  const generateEmailContent = () => {
    const validSections = getValidSections(sections);

    // Generate services summary
    let servicesHtml = "";
    validSections.forEach((section) => {
      servicesHtml += `
        <tr>
          <td colspan="3" style="background-color: #f8f9fa; padding: 8px; font-weight: bold; border-top: 1px solid #dee2e6;">
            ${section.name.toUpperCase()}
          </td>
        </tr>`;

      section.services.forEach((service) => {
        if (
          service.type === "withOptions" &&
          service.selectedOption &&
          service.quantity
        ) {
          const serviceOptions = getServiceOptions(section.id, service.id);
          const selectedOption = serviceOptions.find(
            (opt) => opt.value === service.selectedOption
          );
          if (selectedOption) {
            // Use custom rate if enabled, otherwise use selected option rate
            const rate =
              service.useCustomRate && service.customRate !== undefined
                ? service.customRate
                : selectedOption.rate;

            const totalAmount = rate * service.quantity;
            servicesHtml += `
              <tr>
                <td style="padding: 6px; border-bottom: 1px solid #eee;">${
                  service.name
                }</td>
                <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: center;">${
                  service.quantity
                } hrs</td>
                <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: right;">$${totalAmount.toFixed(
                  2
                )}</td>
              </tr>`;
          }
        } else if (
          service.type === "fixedCost" &&
          service.value !== undefined
        ) {
          servicesHtml += `
            <tr>
              <td style="padding: 6px; border-bottom: 1px solid #eee;">${
                service.name
              }</td>
              <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: center;">-</td>
              <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: right;">$${service.value.toFixed(
                2
              )}</td>
            </tr>`;
        } else if (
          service.type === "manualInput" &&
          service.customDescription &&
          service.customAmount !== undefined &&
          service.customRate !== undefined
        ) {
          const totalAmount = service.customAmount * service.customRate;
          servicesHtml += `
            <tr>
              <td style="padding: 6px; border-bottom: 1px solid #eee;">${
                service.name
              }</td>
              <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: center;">${
                service.customAmount
              } @ $${service.customRate}</td>
              <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: right;">$${totalAmount.toFixed(
                2
              )}</td>
            </tr>`;
        } else if (
          service.type === "rnD" &&
          service.rdExpenses !== undefined &&
          service.rdExpenses > 0
        ) {
          // R&D calculation
          const refundAmount = service.rdExpenses * 0.435;
          const ourFees = Math.max(refundAmount * 0.1, 2500);

          servicesHtml += `
            <tr>
              <td style="padding: 6px; border-bottom: 1px solid #eee;">${
                service.name
              }</td>
              <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: center;">$${service.rdExpenses.toLocaleString()} @ 43.5%</td>
              <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: right;">$${ourFees.toFixed(
                2
              )}</td>
            </tr>`;
        }
      });
    });

    // Client information
    const clientName =
      clientInfo.contactPerson || clientInfo.clientGroup || "Valued Client";

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #2c5282; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Professional Services Proposal</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Integritas Accountants and Advisers</p>
        </div>
        
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="font-size: 16px; margin-bottom: 20px;">
            Dear ${clientName},
          </p>
          
          <p style="line-height: 1.6; margin-bottom: 20px;">
            Thank you for considering Integritas Accountants and Advisers for your accounting and advisory needs. 
            We are pleased to present this comprehensive proposal outlining our professional services tailored to your specific requirements.
          </p>
          
          ${
            clientInfo.entities.some((e) => e.name)
              ? `
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #2c5282;">Client Information</h3>
            ${
              clientInfo.clientGroup
                ? `<p style="margin: 5px 0;"><strong>Client Group:</strong> ${clientInfo.clientGroup}</p>`
                : ""
            }
            ${
              clientInfo.address
                ? `<p style="margin: 5px 0;"><strong>Address:</strong> ${clientInfo.address}</p>`
                : ""
            }
            
            <h4 style="margin: 15px 0 10px 0; color: #4a5568;">Entities:</h4>
                         ${clientInfo.entities
                           .map((entity) =>
                             entity.name
                               ? `
                 <div style="margin-bottom: 10px; padding-left: 15px;">
                   <p style="margin: 2px 0; font-weight: bold;">• ${
                     entity.name
                   } (${entity.entityType || "N/A"})</p>
                  <p style="margin: 2px 0; font-size: 14px; color: #666;">
                    Industry: ${entity.businessType || "N/A"} | 
                    Xero: ${entity.hasXeroFile ? "Yes" : "No"}
                    ${
                      !entity.hasXeroFile && entity.accountingSoftware
                        ? ` | Current software: ${entity.accountingSoftware}`
                        : ""
                    }
                  </p>
                </div>
              `
                               : ""
                           )
                           .join("")}
          </div>
          `
              : ""
          }
          
          <h3 style="color: #2c5282; margin-bottom: 15px;">Proposed Services</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #dee2e6;">
            <thead>
              <tr style="background-color: #2c5282; color: white;">
                <th style="padding: 10px; text-align: left; border-bottom: 1px solid #dee2e6;">Service Description</th>
                <th style="padding: 10px; text-align: center; border-bottom: 1px solid #dee2e6;">Hours</th>
                <th style="padding: 10px; text-align: right; border-bottom: 1px solid #dee2e6;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${servicesHtml}
                              ${
                                discount.amount > 0
                                  ? `
                  <tr>
                    <td colspan="2" style="padding: 8px; font-weight: bold; color: #e53e3e;">Discount Applied</td>
                   <td style="padding: 8px; text-align: right; font-weight: bold; color: #e53e3e;">-$${discount.amount.toFixed(
                     2
                   )}</td>
                </tr>
              `
                                  : ""
                              }
              <tr style="background-color: #f8f9fa; font-weight: bold; font-size: 16px;">
                <td colspan="2" style="padding: 12px; border-top: 2px solid #2c5282;">TOTAL VALUE:</td>
                <td style="padding: 12px; text-align: right; border-top: 2px solid #2c5282; color: #2c5282;">$${(
                  total || 0
                ).toFixed(2)}</td>
              </tr>
              ${
                feesCharged > 0
                  ? `
              <tr style="background-color: #e6f3ff; font-weight: bold; font-size: 16px;">
                <td colspan="2" style="padding: 12px; border-top: 1px solid #2c5282;">FEES CHARGED:</td>
                <td style="padding: 12px; text-align: right; border-top: 1px solid #2c5282; color: #2c5282;">$${feesCharged.toFixed(
                  2
                )}</td>
              </tr>
              `
                  : ""
              }
            </tbody>
          </table>
          
          <div style="background-color: #e6fffa; padding: 15px; border-radius: 5px; border-left: 4px solid #38b2ac; margin-bottom: 20px;">
            <h4 style="margin-top: 0; color: #2d3748;">Important Notes:</h4>
            <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.6;">
              <li>All fees are quoted in Australian dollars and exclude GST</li>
              <li>Any additional work outside the scope of this proposal will be quoted for and agreed upon prior to commencement</li>
              <li>We look forward to the opportunity to work with you and provide exceptional service tailored to your needs</li>
            </ul>
          </div>
          
          <p style="line-height: 1.6; margin-bottom: 20px;">
            We look forward to the opportunity to work with you and provide exceptional service tailored to your needs. 
            Our experienced team is committed to delivering professional, reliable, and cost-effective solutions for your business.
          </p>
          
          <p style="line-height: 1.6; margin-bottom: 20px;">
            Should you have any questions about this proposal or require any clarifications, please don't hesitate to contact us. 
            We are here to help and would be delighted to discuss how we can best serve your accounting and advisory requirements.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin-bottom: 5px;"><strong>Yours sincerely,</strong></p>
            <p style="margin-bottom: 5px; font-weight: bold; color: #2c5282;">Integritas Accountants and Advisers</p>
            <p style="margin-bottom: 20px; font-style: italic; color: #666;">Professional Accounting Services</p>
          </div>
        </div>
        
        <div style="background-color: #2c5282; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">Level 1/75 Moreland St, Footscray, 3011</p>
          <p style="margin: 5px 0 0 0;">Phone: 1300 829 825 | Email: info@integritas.com.au</p>
        </div>
      </div>
    `;
  };

  const handleEmailEstimate = async (emailsToSend?: string[]) => {
    // Use provided emails or fall back to parsing the emails string
    let emailList: string[];

    if (emailsToSend) {
      // Clean provided emails array
      emailList = emailsToSend
        .map((email) => email.trim().toLowerCase())
        .filter(
          (email) => email !== "" && email.includes("@") && email.includes(".")
        );
    } else {
      // Parse and clean comma-separated emails string
      emailList = emails
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(
          (email) => email !== "" && email.includes("@") && email.includes(".")
        );
    }

    if (emailList.length === 0) {
      toast.error("Please add at least one valid email address");
      return;
    }

    setIsGeneratingEmail(true);

    // Show initial progress
    toast.loading("Preparing email...", {
      id: "email-progress",
      description: "Generating PDF content",
    });

    try {
      // Generate PDF content
      console.log("🔄 Generating PDF content...");
      const doc = generatePDFContent();

      // Update progress
      toast.loading("Preparing email...", {
        id: "email-progress",
        description: "Converting PDF to attachment",
      });

      const pdfBase64 = doc.output("datauristring");

      // Update progress
      toast.loading("Preparing email...", {
        id: "email-progress",
        description: "Generating email content",
      });

      const emailContent = generateEmailContent();

      const clientName =
        clientInfo.contactPerson || clientInfo.clientGroup || "Client";
      const currentDate = new Date().toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      // Final progress update
      toast.loading("Sending email...", {
        id: "email-progress",
        description: `Sending to ${emailList.length} recipient${
          emailList.length > 1 ? "s" : ""
        }`,
      });

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailList,
          subject: `Professional Services Proposal - ${clientName} - ${currentDate}`,
          message: emailContent,
          attachments: [
            {
              filename: `Integritas_Proposal_${clientName.replace(
                /[^a-zA-Z0-9]/g,
                "_"
              )}_${new Date().toISOString().split("T")[0]}.pdf`,
              content: pdfBase64.split("base64,")[1],
              encoding: "base64",
            },
          ],
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error(
          "❌ Non-JSON response received:",
          textResponse.substring(0, 200)
        );
        throw new Error(
          `Server returned non-JSON response. Status: ${response.status}`
        );
      }

      const responseData = await response.json();
      console.log("Email API Response:", responseData);

      if (response.ok) {
        console.log("✅ Email sent successfully!");
        toast.dismiss("email-progress");
        toast.success("Estimate sent successfully!", {
          description: `Email sent to ${emailList.length} recipient${
            emailList.length > 1 ? "s" : ""
          }`,
        });

        // Update quote status to SENT if we have a saved quote
        if (currentQuoteId) {
          try {
            await fetch(`/api/quotes/${currentQuoteId}/status`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: "SENT" }),
            });
          } catch (error) {
            console.error("Error updating quote status:", error);
          }
        }
      } else {
        const errorMessage = responseData.details
          ? `${responseData.error}\n\nDetails: ${responseData.details}`
          : responseData.error || "Failed to send email";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("❌ Error sending email:", error);
      toast.dismiss("email-progress");
      if (error instanceof Error) {
        toast.error("Failed to send email", {
          description: error.message,
        });
      } else {
        toast.error("An unknown error occurred while sending email.");
      }
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  return (
    <ClientWrapper
      fallback={
        <div
          className="p-2 h-full flex items-center justify-center"
          suppressHydrationWarning
        >
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <div className="h-full flex flex-col bg-white" suppressHydrationWarning>
        {/* SECTION 1: Header with Title and Toggle */}
        <div className="flex-shrink-0 p-3 border-b bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Estimate Summary</h2>
            {onToggleVisibility && (
              <Button
                onClick={onToggleVisibility}
                variant="ghost"
                size="sm"
                title="Hide summary sidebar"
                className="hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* SECTION 2: Total Value at Top */}
        <div className="flex-shrink-0 bg-blue-50 border-b">
          {/* Discount Row */}
          {discount.amount > 0 && (
            <div className="px-3 py-2 bg-red-50 border-b border-red-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-700">
                  {discount.description || "Discount Applied"}
                </span>
                <span className="text-sm font-semibold text-red-700">
                  -${discount.amount.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {/* Total Row */}
          <div className="px-3 py-4">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold text-blue-900">
                Total Value
              </span>
              <span className="text-xl font-bold text-blue-900">
                ${(total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: Action Buttons */}
        <div className="flex-shrink-0 p-3 border-b bg-gray-50">
          <div className="flex justify-center space-x-3">
            {/* Save Button - Full button with text */}
            <Button
              onClick={handleSaveQuote}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                  {currentQuoteId ? "Updating..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {currentQuoteId ? "Update Quote" : "Save Quote"}
                </>
              )}
            </Button>

            {/* Download PDF Button - Icon only */}
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              size="sm"
              className="px-3"
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* Email Button with Modal - Icon only */}
            <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                  title="Email Estimate"
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Email Estimate</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Add Email Input */}
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addEmail();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={addEmail}
                      size="sm"
                      disabled={!newEmail.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Email List */}
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {emailList.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No email addresses added yet
                      </p>
                    ) : (
                      emailList.map((email, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <span className="text-sm">{email}</span>
                          <Button
                            onClick={() => removeEmail(index)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-red-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Send Button */}
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEmailModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleEmailModalSend}
                      disabled={isGeneratingEmail || emailList.length === 0}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isGeneratingEmail ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* SECTION 4: Fees Charged */}
        <div className="flex-shrink-0 p-3 border-b bg-white">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700 min-w-fit">
              Fees Charged:
            </label>
            {mounted && (
              <Input
                type="number"
                placeholder="0"
                value={feesCharged || ""}
                onChange={(e) => updateFeesCharged(Number(e.target.value) || 0)}
                suppressHydrationWarning
                className="flex-1"
              />
            )}
          </div>
        </div>

        {/* SECTION 5: Scrollable Services and Client Info */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-3 space-y-3">
              {/* Client Information */}
              {(clientInfo.clientGroup ||
                clientInfo.entities.some((e) => e.name)) && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">
                    Client Information
                  </h3>
                  {clientInfo.clientGroup && (
                    <p className="text-xs mb-1">
                      <strong>Group:</strong> {clientInfo.clientGroup}
                    </p>
                  )}
                  {clientInfo.entities.map(
                    (entity, index) =>
                      entity.name && (
                        <p key={index} className="text-xs mb-1">
                          <strong>Entity {index + 1}:</strong> {entity.name} (
                          {entity.entityType})
                        </p>
                      )
                  )}
                  {clientInfo.contactPerson && (
                    <p className="text-xs mb-1">
                      <strong>Contact:</strong> {clientInfo.contactPerson}
                    </p>
                  )}
                  {clientInfo.address && (
                    <p className="text-xs">
                      <strong>Address:</strong> {clientInfo.address}
                    </p>
                  )}
                </div>
              )}

              {/* Services by Section - Compact Rows */}
              <div className="space-y-3">
                {getValidSections(sections).map((section) => (
                  <div key={section.id} className="space-y-1">
                    <h3 className="font-semibold text-sm text-gray-800 border-b pb-1">
                      {section.name}
                    </h3>
                    <div className="space-y-1">
                      {section.services.map((service) => {
                        if (
                          service.type === "withOptions" &&
                          service.selectedOption &&
                          service.quantity
                        ) {
                          const options = getServiceOptions(
                            section.id,
                            service.id
                          );
                          const selectedOpt = options.find(
                            (opt) => opt.value === service.selectedOption
                          );

                          const rate = service.useCustomRate
                            ? service.customRate ?? selectedOpt?.rate ?? 0
                            : selectedOpt?.rate ?? 0;
                          const cost = (service.quantity ?? 0) * rate;

                          return (
                            <div
                              key={service.id}
                              className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded"
                            >
                              <div className="flex-1 pr-2">
                                <p className="text-sm font-medium text-gray-900">
                                  {service.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {selectedOpt?.label} - {service.quantity} × $
                                  {rate.toFixed(0)} each
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-600">
                                  ${cost.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          );
                        } else if (
                          service.type === "fixedCost" &&
                          service.value !== undefined
                        ) {
                          return (
                            <div
                              key={service.id}
                              className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded"
                            >
                              <div className="flex-1 pr-2">
                                <p className="text-sm font-medium text-gray-900">
                                  {service.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Fixed cost service
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-600">
                                  ${service.value.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          );
                        } else if (
                          service.type === "manualInput" &&
                          service.customDescription &&
                          service.customAmount !== undefined &&
                          service.customRate !== undefined
                        ) {
                          const cost =
                            service.customAmount * service.customRate;
                          return (
                            <div
                              key={service.id}
                              className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded"
                            >
                              <div className="flex-1 pr-2">
                                <p className="text-sm font-medium text-gray-900">
                                  {service.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {service.customAmount} × $
                                  {service.customRate.toFixed(0)} each
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-600">
                                  ${cost.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          );
                        } else if (
                          service.type === "rnD" &&
                          service.rdExpenses !== undefined &&
                          service.rdExpenses > 0
                        ) {
                          const refundAmount = service.rdExpenses * 0.435;
                          const ourFees = Math.max(refundAmount * 0.1, 2500);
                          return (
                            <div
                              key={service.id}
                              className="flex justify-between items-center py-2 px-2 hover:bg-gray-50 rounded"
                            >
                              <div className="flex-1 pr-2">
                                <p className="text-sm font-medium text-gray-900">
                                  {service.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  R&D Expenses: $
                                  {service.rdExpenses.toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-green-600">
                                  ${ourFees.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty state when no services */}
              {getValidSections(sections).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">No services selected</p>
                  <p className="text-xs mt-1">
                    Select services from the form to see them here
                  </p>
                </div>
              )}

              {/* Bottom spacing */}
              <div className="h-6"></div>
            </div>
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
}
