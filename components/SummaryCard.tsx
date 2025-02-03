"use client";
import { useState } from "react";
import { useEstimationStore } from "@/lib/store";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";

interface SummaryCardProps {
  total: number;
}

export default function SummaryCard({ total }: SummaryCardProps) {
  const { sections } = useEstimationStore();
  const [emails, setEmails] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false); // Start collapsed

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev); // Toggle collapse state
  };
  const generatePDFContent = () => {
    const doc = new jsPDF();
    // Add a header with a logo and contact information
    const logoUrl = "/logo.jpg"; // Replace with the actual path to your logo
    const headerHeight = 30; // Height of the header section
    // Add logo
    doc.addImage(logoUrl, "PNG", 20, 10, 50, 25); // Adjust the position and size as needed
    // Add contact information
    doc.setFontSize(10);
    doc.setTextColor(100); // Gray color for contact info
    doc.text("Integritas Accountants and Advisers Pty Ltd", 80, 15);
    doc.text("Level 1/75 Moreland St, Footscray, 3011", 80, 20);
    doc.text("Phone: 1300 829 825 | Email: info@integritas.com.au", 80, 25);
    // Add a horizontal line below the header
    doc.setDrawColor(200); // Light gray color for the line
    doc.line(20, headerHeight, 190, headerHeight); // Adjust the length and position as needed
    // Add the main content
    doc.setFontSize(20);
    doc.setTextColor(0); // Black color for the title
    doc.text("Estimate Summary", 20, headerHeight + 15);
    doc.setFontSize(12);
    let yPosition = headerHeight + 25; // Start content below the header
    // Add sections and services
    sections.forEach((section) => {
      doc.setFontSize(14);
      doc.setTextColor(0); // Black color for section titles
      doc.text(section.name, 20, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      section.services.forEach((service) => {
        if (service.type === "withOptions" && service.selectedOption && service.quantity) {
          const selectedOption = service.options.find((opt) => opt.value === service.selectedOption);
          if (!selectedOption) return;
          // Service name and option
          doc.setTextColor(1); // Black color for service name
          doc.text(`${service.name} (${selectedOption.label})`, 30, yPosition);
          // Rate and quantity
          doc.setTextColor(100); // Gray color for details
          doc.text(`Rate: $${selectedOption.rate}/unit`, 130, yPosition);
          doc.text(`Quantity: ${service.quantity}`, 170, yPosition);
          yPosition += 5;
        }
        yPosition += 1; // Add some space between services
      });
      yPosition += 5; // Add some space between sections
    });
    // Add a horizontal line above the total
    doc.setDrawColor(200); // Light gray color for the line
    doc.line(20, yPosition, 190, yPosition);
    // Add the total estimate
    doc.setFontSize(16);
    doc.setTextColor(0); // Black color for the total
    doc.text(`Total Estimate: $${total.toFixed(2)}`, 20, yPosition + 5);
    return doc;
  };

  const handleDownloadPDF = () => {
    const doc = generatePDFContent();
    doc.save("estimate.pdf");
  };

  const handleEmailEstimate = async () => {
    const doc = generatePDFContent();
    const pdfBase64 = doc.output("datauristring");
    const emailList = emails.split(",").map((email) => email.trim());
    if (emailList.length === 0 || emailList[0] === "") {
      alert("Please enter at least one valid email address.");
      return;
    }
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailList,
          subject: "Your Accounting Service Estimate",
          message: "Please find attached your estimate.",
          attachments: [
            {
              filename: "estimate.pdf",
              content: pdfBase64.split("base64,")[1],
              encoding: "base64",
            },
          ],
        }),
      });
      const responseData = await response.json();
      console.log("Email API Response:", responseData);
      if (response.ok) {
        alert("Estimate sent successfully!");
      } else {
        throw new Error(responseData.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <Button
        onClick={handleToggleCollapse}
        className={`fixed top-4 right-4 z-50 rounded-full p-2 ${
          isCollapsed ? "bg-primary" : "bg-primary"
        }`}
      >
        {isCollapsed ? (
          <ChevronLeftIcon className="h-5 w-5 text-red-400"  />
        ) : (
          <ChevronRightIcon className="h-5 w-5 text-red-400" />
        )}
      </Button>

      {/* Collapsible Sidebar */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            key="sidebar"
            initial={{ x: 300 }} // Start off-screen to the right
            animate={{ x: 0 }} // Slide into view
            exit={{ x: 300 }} // Slide out of view
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-screen w-[300px] bg-background shadow-lg z-40 overflow-y-auto"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Estimate Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 overflow-y-auto">
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <h3 className="font-semibold">{section.name}</h3>
                      <ul className="pl-4">
                        {section.services.map((service) => {
                          if (service.type === "withOptions" && service.selectedOption && service.quantity) {
                            const selectedOption = service.options.find(
                              (opt) => opt.value === service.selectedOption
                            );
                            if (!selectedOption) return null;
                            return (
                              <li key={service.id} className="flex flex-col">
                                <div className="flex justify-between">
                                  <span>
                                    {service.name} ({selectedOption.label})
                                  </span>
                                  <span>${(selectedOption.rate * service.quantity).toFixed(2)}</span>
                                </div>
                                <div className="text-sm text-gray-500 pl-4">
                                  Rate: ${selectedOption.rate}/unit, Quantity: {service.quantity}
                                </div>
                              </li>
                            );
                          }
                          return null;
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <div className="flex justify-between w-full text-lg font-semibold">
                  <span>Total Estimate</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Input
                  type="text"
                  placeholder="Enter multiple emails (comma separated)"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                />
                <Button onClick={handleDownloadPDF} className="w-full">
                  Download PDF
                </Button>
                <Button onClick={handleEmailEstimate} variant="outline" className="w-full">
                  Email Estimate
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Example Icons (replace with your actual icons)
function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (<>
  <p>Show summary</p>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <>
    <p>Hide</p>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l-7-7 7-7" />
    </svg>
    </>
  );
}