import * as XLSX from "xlsx";

import { jsPDF } from "jspdf";

interface TeamMember {
  id: string;
  name: string;
  hourlyRate: number;
}

interface EstimationTeamMember {
  id: string;
  hoursAllocated: number;
  customRate?: number;
  teamMember: TeamMember;
}

interface JobEstimation {
  id: string;
  name: string;
  description?: string;
  clientName?: string;
  clientEmail?: string;
  totalHours: number;
  totalCost: number;
  clientManager?: TeamMember;
  createdAt: string;
  teamMembers: EstimationTeamMember[];
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const generatePDF = (estimation: JobEstimation) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 20;
  let yPosition = 20;

  // Function to add header to each page
  const addHeader = () => {
    // Define the logo URL and header height
    const logoUrl = "/2.png"; // Logo image path
    const headerHeight = 30; // Height of the header section

    // Define the desired width for the logo
    const logoWidth = 50; // Adjust as needed
    const logoAspectRatio = 1920 / 536; // Image aspect ratio
    const logoHeight = logoWidth / logoAspectRatio; // Maintain aspect ratio

    // Center the logo within its container
    const logoX = 20; // Adjust as needed
    const logoY = headerHeight / 2 - logoHeight / 2; // Center within header

    // Add logo while maintaining aspect ratio
    try {
      doc.addImage(logoUrl, "PNG", logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      // If logo fails to load, continue without it
      console.warn("Logo could not be loaded:", error);
    }

    // Add contact information
    doc.setFontSize(10);
    doc.setTextColor(100); // Gray color for contact info
    doc.text("Integritas Accountants and Advisers Pty Ltd", 80, 15);
    doc.text("Level 1/75 Moreland St, Footscray, 3011", 80, 20);
    doc.text("Phone: 1300 829 825 | Email: info@integritas.com.au", 80, 25);

    // Draw a horizontal line below the header
    doc.setDrawColor(200); // Light gray color for the line
    doc.line(20, headerHeight, 190, headerHeight);

    // Document title
    yPosition = headerHeight + 15; // Reset position after header
    doc.setFontSize(16);
    doc.setTextColor(51, 51, 51);
    doc.text("JOB COST ESTIMATION", 20, yPosition);
    yPosition += 15;

    return yPosition; // Return starting Y position for content
  };

  // Function to check if we need a new page
  const checkPageBreak = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - marginBottom) {
      doc.addPage();
      yPosition = addHeader();
    }
  };

  // Start with header
  yPosition = addHeader();

  // Estimation details
  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);

  checkPageBreak(50);
  doc.text(`Estimation Details`, 20, yPosition);
  yPosition += 8;

  if (estimation.clientName) {
    doc.text(`Client: ${estimation.clientName}`, 20, yPosition);
    yPosition += 8;
  }

  if (estimation.clientEmail) {
    doc.text(`Email: ${estimation.clientEmail}`, 20, yPosition);
    yPosition += 8;
  }

  if (estimation.clientManager) {
    doc.text(`Client Manager: ${estimation.clientManager.name}`, 20, yPosition);
    yPosition += 8;
  }

  doc.text(`Date: ${formatDate(estimation.createdAt)}`, 20, yPosition);
  yPosition += 8;

  if (estimation.description) {
    yPosition += 5;
    doc.text("Description:", 20, yPosition);
    yPosition += 6;

    // Split description into lines
    const descriptionLines = doc.splitTextToSize(estimation.description, 170);
    for (const line of descriptionLines) {
      checkPageBreak(8);
      doc.text(line, 20, yPosition);
      yPosition += 6;
    }
  }

  yPosition += 10;

  // Team members table header
  checkPageBreak(50);
  doc.setFontSize(14);
  doc.text("Team Allocation", 20, yPosition);
  yPosition += 10;

  // Table headers
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const tableHeaders = ["Team Member", "Hours", "Rate", "Cost"];
  const colWidths = [60, 30, 40, 40];
  let xPos = 20;

  tableHeaders.forEach((header, index) => {
    doc.text(header, xPos, yPosition);
    xPos += colWidths[index];
  });
  yPosition += 8;

  // Table rows
  doc.setTextColor(51, 51, 51);
  estimation.teamMembers.forEach((member) => {
    checkPageBreak(10);
    const rate = member.customRate ?? member.teamMember.hourlyRate;
    const cost = member.hoursAllocated * rate;

    xPos = 20;
    doc.text(member.teamMember.name, xPos, yPosition);
    xPos += colWidths[0];
    doc.text(member.hoursAllocated.toString(), xPos, yPosition);
    xPos += colWidths[1];
    doc.text(formatCurrency(rate), xPos, yPosition);
    xPos += colWidths[2];
    doc.text(formatCurrency(cost), xPos, yPosition);

    yPosition += 8;
  });

  // Summary section
  yPosition += 10;
  checkPageBreak(30);
  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51);
  doc.text("Cost Summary", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.text(`Total Hours: ${estimation.totalHours.toFixed(2)}`, 20, yPosition);
  yPosition += 8;
  doc.text(
    `Total Cost: ${formatCurrency(estimation.totalCost)}`,
    20,
    yPosition
  );
  yPosition += 20;

  // Footer
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = pageHeight - 40;
  } else {
    yPosition = pageHeight - 40;
  }

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Thank you for choosing Integritas Accountants and Advisers",
    20,
    yPosition
  );
  yPosition += 6;
  doc.text("Professional Accounting Services", 20, yPosition);

  return doc;
};

export const exportEstimationToPDF = (estimation: JobEstimation) => {
  const doc = generatePDF(estimation);
  const fileName = `estimation-${estimation.name
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
};

export const exportEstimationToExcel = (estimation: JobEstimation) => {
  try {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Calculate totals to match web form display
    const totalPastHours = 0; // This would come from actual past work data
    const totalPastCost = 0; // This would come from actual past work data
    const totalBudgetHours = estimation.totalHours;
    const totalBudgetCost = estimation.totalCost;

    // Build the estimation data to match the web form structure
    const estimationData = [
      // Header section
      ["JOB ESTIMATION FORM"],
      [""],
      ["PROJECT DETAILS"],
      ["Client Name", estimation.clientName || "Not specified"],
      [
        "Client Manager",
        estimation.clientManager?.name || "No manager assigned",
      ],
      ["Date Created", formatDate(estimation.createdAt)],
      ["Job Description", estimation.description || ""],
      [""],

      // Team members table header (matching web form)
      ["TEAM MEMBERS"],
      [
        "Staff Member",
        "Hourly Rate",
        "Past Hours",
        "Past Cost",
        "Budget Hours",
        "Budget Cost",
      ],

      // Team member rows
      ...estimation.teamMembers.map((member) => {
        const rate = member.customRate ?? member.teamMember.hourlyRate;
        const pastHours = 0; // This would come from actual past work data
        const pastCost = pastHours * rate;
        const budgetCost = member.hoursAllocated * rate;

        return [
          member.teamMember.name,
          formatCurrency(rate),
          pastHours.toFixed(2),
          formatCurrency(pastCost),
          member.hoursAllocated.toFixed(2),
          formatCurrency(budgetCost),
        ];
      }),

      // Totals row
      [""],
      [
        "TOTALS",
        "",
        totalPastHours.toFixed(2) + "h",
        formatCurrency(totalPastCost),
        totalBudgetHours.toFixed(2) + "h",
        formatCurrency(totalBudgetCost),
      ],

      // Summary section (matching the web form quick summary)
      [""],
      ["PROJECT SUMMARY"],
      ["Total Budget Hours", `${totalBudgetHours.toFixed(2)} hours`],
      ["Total Budget Cost", formatCurrency(totalBudgetCost)],
      ["Client Charge", "To be specified"], // This would be the client charge field
      ["Estimated Profit", "To be calculated"], // This would be client charge - total cost
      ["Profit Margin", "To be calculated %"],
    ];

    // Create main worksheet
    const ws = XLSX.utils.aoa_to_sheet(estimationData);

    // Set column widths to match the form layout
    const colWidths = [
      { wch: 20 }, // Staff Member / Labels
      { wch: 15 }, // Hourly Rate / Values
      { wch: 12 }, // Past Hours
      { wch: 15 }, // Past Cost
      { wch: 12 }, // Budget Hours
      { wch: 15 }, // Budget Cost
    ];
    ws["!cols"] = colWidths;

    // Add some basic styling
    try {
      // Style headers
      if (ws["A1"]) ws["A1"].s = { font: { bold: true, size: 14 } };
      if (ws["A3"]) ws["A3"].s = { font: { bold: true } };
      if (ws["A10"]) ws["A10"].s = { font: { bold: true } };
      if (ws["A18"]) ws["A18"].s = { font: { bold: true } };

      // Style the table header row
      for (let col = 0; col < 6; col++) {
        const cellAddr = XLSX.utils.encode_cell({ r: 10, c: col });
        if (ws[cellAddr]) {
          ws[cellAddr].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "E3F2FD" } },
          };
        }
      }

      // Style totals row
      const totalsRowIndex = 11 + estimation.teamMembers.length + 1;
      for (let col = 0; col < 6; col++) {
        const cellAddr = XLSX.utils.encode_cell({ r: totalsRowIndex, c: col });
        if (ws[cellAddr]) {
          ws[cellAddr].s = { font: { bold: true } };
        }
      }
    } catch (styleError) {
      console.warn("Styling failed, continuing without styles:", styleError);
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Job Estimation");

    // Create detailed breakdown sheet
    const detailData = [
      ["DETAILED BREAKDOWN"],
      [""],
      ["Team Member Details"],
      [
        "Name",
        "Base Rate",
        "Custom Rate",
        "Hours Allocated",
        "Effective Rate",
        "Total Cost",
      ],

      ...estimation.teamMembers.map((member) => {
        const baseRate = member.teamMember.hourlyRate;
        const customRate = member.customRate;
        const effectiveRate = customRate ?? baseRate;
        const totalCost = member.hoursAllocated * effectiveRate;

        return [
          member.teamMember.name,
          formatCurrency(baseRate),
          customRate ? formatCurrency(customRate) : "Standard Rate",
          member.hoursAllocated.toFixed(2),
          formatCurrency(effectiveRate),
          formatCurrency(totalCost),
        ];
      }),

      [""],
      ["Rate Analysis"],
      [
        "Lowest Rate",
        formatCurrency(
          Math.min(
            ...estimation.teamMembers.map(
              (m) => m.customRate ?? m.teamMember.hourlyRate
            )
          )
        ),
      ],
      [
        "Highest Rate",
        formatCurrency(
          Math.max(
            ...estimation.teamMembers.map(
              (m) => m.customRate ?? m.teamMember.hourlyRate
            )
          )
        ),
      ],
      [
        "Average Rate",
        formatCurrency(estimation.totalCost / estimation.totalHours),
      ],
      ["Total Team Members", estimation.teamMembers.length.toString()],
      ["Total Project Hours", `${estimation.totalHours.toFixed(2)} hours`],
      ["Total Project Cost", formatCurrency(estimation.totalCost)],
    ];

    const detailWs = XLSX.utils.aoa_to_sheet(detailData);
    detailWs["!cols"] = [
      { wch: 20 }, // Name
      { wch: 15 }, // Base Rate
      { wch: 15 }, // Custom Rate
      { wch: 15 }, // Hours
      { wch: 15 }, // Effective Rate
      { wch: 15 }, // Total Cost
    ];

    XLSX.utils.book_append_sheet(wb, detailWs, "Detailed Breakdown");

    // Export file
    const fileName = `job-estimation-${estimation.name
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()}-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error("Excel export error:", error);
    throw new Error(
      `Failed to export Excel: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
