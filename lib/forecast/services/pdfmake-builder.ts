import type { TDocumentDefinitions, TableCell } from "pdfmake/interfaces";

import type { PDFReportData } from "./pdf-generator";

function formatCurrency(value: number, currency: string = "AUD"): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function pct(value: number): string {
  return `${value.toFixed(1)}%`;
}

// Helper: Compute core yearly totals and derived margins from P&L
function computeCore(
  financialData: PDFReportData["financialData"],
  taxRate: number
) {
  const revenue = financialData.yearlyTotals["sales_revenue"] ?? 0;
  const cogs = Math.abs(financialData.yearlyTotals["cogs"] ?? 0);
  const grossProfit = revenue - cogs;
  const operatingExpenses = Math.abs(
    financialData.yearlyTotals["operating_expenses"] ?? 0
  );
  const otherIncome = financialData.yearlyTotals["other_income"] ?? 0;
  const financialExpenses = Math.abs(
    financialData.yearlyTotals["financial_expenses"] ?? 0
  );
  const otherExpenses = Math.abs(
    financialData.yearlyTotals["other_expenses"] ?? 0
  );
  const operatingProfit = grossProfit - operatingExpenses;
  const netProfitBeforeTax =
    operatingProfit + otherIncome - financialExpenses - otherExpenses;
  const taxExpense =
    netProfitBeforeTax > 0 ? (netProfitBeforeTax * taxRate) / 100 : 0;
  const netProfitAfterTax = netProfitBeforeTax - taxExpense;

  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const operatingMargin = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
  const netMargin = revenue > 0 ? (netProfitAfterTax / revenue) * 100 : 0;
  const cogsRatio = revenue > 0 ? (cogs / revenue) * 100 : 0;
  const expenseRatio = revenue > 0 ? (operatingExpenses / revenue) * 100 : 0;

  return {
    revenue,
    cogs,
    grossProfit,
    operatingExpenses,
    otherIncome,
    financialExpenses,
    otherExpenses,
    operatingProfit,
    netProfitBeforeTax,
    taxExpense,
    netProfitAfterTax,
    grossMargin,
    operatingMargin,
    netMargin,
    cogsRatio,
    expenseRatio,
  };
}

// Helper: Compute monthly-derived metrics (volatility, QoQ)
function computeMonthly(financialData: PDFReportData["financialData"]) {
  const monthlyRevenue: number[] =
    financialData.monthlyData["sales_revenue"] ?? Array(12).fill(0);
  const avgMonthlyRevenue = monthlyRevenue.reduce((a, b) => a + b, 0) / 12;
  const revenueVolatility =
    avgMonthlyRevenue > 0
      ? (Math.sqrt(
          monthlyRevenue.reduce(
            (s, v) => s + Math.pow(v - avgMonthlyRevenue, 2),
            0
          ) / 12
        ) /
          avgMonthlyRevenue) *
        100
      : 0;
  const q1Revenue = monthlyRevenue.slice(0, 3).reduce((s, v) => s + v, 0);
  const q4Revenue = monthlyRevenue.slice(9, 12).reduce((s, v) => s + v, 0);
  const qoqGrowth =
    q1Revenue > 0 ? ((q4Revenue - q1Revenue) / q1Revenue) * 100 : 0;

  return { monthlyRevenue, avgMonthlyRevenue, revenueVolatility, qoqGrowth };
}

// Helper: Build PL table body
function buildPLTableBody(args: {
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  otherIncome: number;
  financialExpenses: number;
  otherExpenses: number;
  operatingProfit: number;
  netProfitBeforeTax: number;
  taxExpense: number;
  netProfitAfterTax: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  cogsRatio: number;
  expenseRatio: number;
  currency: string;
}): TableCell[][] {
  const {
    revenue,
    cogs,
    grossProfit,
    operatingExpenses,
    otherIncome,
    financialExpenses,
    otherExpenses,
    operatingProfit,
    netProfitBeforeTax,
    taxExpense,
    netProfitAfterTax,
    grossMargin,
    operatingMargin,
    netMargin,
    cogsRatio,
    expenseRatio,
    currency,
  } = args;

  return [
    [
      { text: "Category", style: "tHeader" },
      { text: "Amount", style: "tHeader" },
      { text: "% of Revenue", style: "tHeader" },
    ],
    [
      { text: "Revenue" },
      { text: formatCurrency(revenue, currency), bold: true },
      { text: "100.0%", alignment: "center" },
    ],
    [
      { text: "Cost of Goods Sold" },
      { text: `(${formatCurrency(cogs, currency)})` },
      { text: pct(cogsRatio), alignment: "center" },
    ],
    [
      { text: "Gross Profit", bold: true },
      { text: formatCurrency(grossProfit, currency), bold: true },
      { text: pct(grossMargin), alignment: "center" },
    ],
    [
      { text: "Operating Expenses" },
      { text: `(${formatCurrency(operatingExpenses, currency)})` },
      { text: pct(expenseRatio), alignment: "center" },
    ],
    [
      { text: "Operating Profit", bold: true },
      { text: formatCurrency(operatingProfit, currency), bold: true },
      { text: pct(operatingMargin), alignment: "center" },
    ],
    [
      { text: "Other Income" },
      { text: formatCurrency(otherIncome, currency) },
      {
        text: revenue ? pct((otherIncome / revenue) * 100) : "0.0%",
        alignment: "center",
      },
    ],
    [
      { text: "Financial Expenses" },
      { text: `(${formatCurrency(financialExpenses, currency)})` },
      {
        text: revenue ? pct((financialExpenses / revenue) * 100) : "0.0%",
        alignment: "center",
      },
    ],
    [
      { text: "Other Expenses" },
      { text: `(${formatCurrency(otherExpenses, currency)})` },
      {
        text: revenue ? pct((otherExpenses / revenue) * 100) : "0.0%",
        alignment: "center",
      },
    ],
    [
      { text: "Net Profit Before Tax", bold: true },
      { text: formatCurrency(netProfitBeforeTax, currency), bold: true },
      {
        text: revenue ? pct((netProfitBeforeTax / revenue) * 100) : "0.0%",
        alignment: "center",
      },
    ],
    [
      { text: "Tax Expense" },
      { text: `(${formatCurrency(taxExpense, currency)})` },
      {
        text:
          netProfitBeforeTax > 0
            ? pct((taxExpense / netProfitBeforeTax) * 100)
            : "0.0%",
        alignment: "center",
      },
    ],
    [
      { text: "Net Profit After Tax", bold: true },
      { text: formatCurrency(netProfitAfterTax, currency), bold: true },
      { text: pct(netMargin), alignment: "center" },
    ],
  ];
}

// Helper: Build KPI table body
function buildKpiTableBody(args: {
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  cogsRatio: number;
  expenseRatio: number;
  taxRate: number;
  netProfitBeforeTax: number;
  taxExpense: number;
}): TableCell[][] {
  const {
    grossMargin,
    operatingMargin,
    netMargin,
    cogsRatio,
    expenseRatio,
    taxRate,
    netProfitBeforeTax,
    taxExpense,
  } = args;
  return [
    [
      { text: "Ratio", style: "tHeader" },
      { text: "Value", style: "tHeader", alignment: "right" },
      { text: "Benchmark", style: "tHeader", alignment: "center" },
    ],
    [
      { text: "Gross Profit Margin" },
      { text: pct(grossMargin), alignment: "right" },
      { text: "Industry Avg: 40%", alignment: "center" },
    ],
    [
      { text: "Operating Margin" },
      { text: pct(operatingMargin), alignment: "right" },
      { text: "Industry Avg: 15%", alignment: "center" },
    ],
    [
      { text: "Net Profit Margin" },
      { text: pct(netMargin), alignment: "right" },
      { text: "Industry Avg: 10%", alignment: "center" },
    ],
    [
      { text: "COGS as % of Revenue" },
      { text: pct(cogsRatio), alignment: "right" },
      { text: "Lower is better", alignment: "center" },
    ],
    [
      { text: "Operating Expenses as % of Revenue" },
      { text: pct(expenseRatio), alignment: "right" },
      { text: "Lower is better", alignment: "center" },
    ],
    [
      { text: "Effective Tax Rate" },
      {
        text:
          netProfitBeforeTax > 0
            ? pct((taxExpense / netProfitBeforeTax) * 100)
            : "0.0%",
        alignment: "right",
      },
      { text: `${taxRate}% standard`, alignment: "center" },
    ],
  ];
}

export function buildPdfMakeDoc(data: PDFReportData): TDocumentDefinitions {
  const { companyInfo, reportSettings, financialData } = data;

  const currency = companyInfo.reportingCurrency ?? "AUD";
  const taxRate = companyInfo.taxRate ?? 25;
  const core = computeCore(financialData, taxRate);
  const { avgMonthlyRevenue, revenueVolatility, qoqGrowth } =
    computeMonthly(financialData);

  const plTableBody: TableCell[][] = buildPLTableBody({
    revenue: core.revenue,
    cogs: core.cogs,
    grossProfit: core.grossProfit,
    operatingExpenses: core.operatingExpenses,
    otherIncome: core.otherIncome,
    financialExpenses: core.financialExpenses,
    otherExpenses: core.otherExpenses,
    operatingProfit: core.operatingProfit,
    netProfitBeforeTax: core.netProfitBeforeTax,
    taxExpense: core.taxExpense,
    netProfitAfterTax: core.netProfitAfterTax,
    grossMargin: core.grossMargin,
    operatingMargin: core.operatingMargin,
    netMargin: core.netMargin,
    cogsRatio: core.cogsRatio,
    expenseRatio: core.expenseRatio,
    currency,
  });

  const kpiTableBody: TableCell[][] = buildKpiTableBody({
    grossMargin: core.grossMargin,
    operatingMargin: core.operatingMargin,
    netMargin: core.netMargin,
    cogsRatio: core.cogsRatio,
    expenseRatio: core.expenseRatio,
    taxRate,
    netProfitBeforeTax: core.netProfitBeforeTax,
    taxExpense: core.taxExpense,
  });

  // Build summary lines without nested ternaries/template strings
  const summaryLines: string[] = [];
  summaryLines.push(
    `${formatCurrency(
      core.revenue,
      currency
    )} total revenue (avg/mo ${formatCurrency(avgMonthlyRevenue, currency)})`
  );
  summaryLines.push(
    `${formatCurrency(core.grossProfit, currency)} gross profit (${pct(
      core.grossMargin
    )})`
  );
  summaryLines.push(
    `${formatCurrency(core.netProfitAfterTax, currency)} net profit (${pct(
      core.netMargin
    )})`
  );
  summaryLines.push(
    `COGS ${pct(core.cogsRatio)} • OpEx ${pct(core.expenseRatio)}`
  );
  summaryLines.push(
    `QoQ growth ${pct(qoqGrowth)} • Revenue volatility ${pct(
      revenueVolatility
    )}`
  );

  // Cost/Tax/Recommendations sections
  const costLines: string[] = [];
  costLines.push(`COGS represents ${pct(core.cogsRatio)} of revenue`);
  costLines.push(
    `Operating expenses represent ${pct(core.expenseRatio)} of revenue`
  );
  if (core.financialExpenses > 0) {
    costLines.push(
      `Financial expenses ${formatCurrency(
        core.financialExpenses,
        currency
      )} (${
        core.revenue
          ? pct((core.financialExpenses / core.revenue) * 100)
          : "0.0%"
      })`
    );
  }
  if (core.otherIncome > 0) {
    costLines.push(
      `Other income ${formatCurrency(core.otherIncome, currency)} (${
        core.revenue ? pct((core.otherIncome / core.revenue) * 100) : "0.0%"
      })`
    );
  }

  const taxLines: string[] = [
    `Effective tax rate ${
      core.netProfitBeforeTax > 0
        ? pct((core.taxExpense / core.netProfitBeforeTax) * 100)
        : "0.0%"
    } (standard ${taxRate}%)`,
  ];

  const recommendationLines: string[] = [];
  if (core.grossMargin < 30) {
    recommendationLines.push(
      `Improve gross margins (${pct(
        core.grossMargin
      )}): review pricing, negotiate supplier terms, and improve production efficiency`
    );
  }
  if (core.operatingMargin < 15) {
    recommendationLines.push(
      `Optimize operating expenses (${pct(
        core.expenseRatio
      )} of revenue): implement cost controls and improve operational efficiency`
    );
  }
  if (core.netMargin < 10) {
    recommendationLines.push(
      `Enhance overall profitability (net margin ${pct(
        core.netMargin
      )}): focus on both revenue growth and cost optimization`
    );
  }
  if (core.cogsRatio > 70) {
    recommendationLines.push(
      `Reduce COGS (${pct(
        core.cogsRatio
      )} of revenue): review supplier relationships and production processes`
    );
  }
  if (
    core.financialExpenses > 0 &&
    core.financialExpenses > core.revenue * 0.05
  ) {
    recommendationLines.push(
      `Review financing costs (${formatCurrency(
        core.financialExpenses,
        currency
      )}): consider refinancing and interest optimization`
    );
  }
  if (core.netProfitAfterTax > 0) {
    recommendationLines.push(
      `Profitable operations (${formatCurrency(
        core.netProfitAfterTax,
        currency
      )}): consider reinvesting in growth and building reserves`
    );
  }
  if (core.netProfitAfterTax < 0) {
    recommendationLines.push(
      `Loss position (${formatCurrency(
        Math.abs(core.netProfitAfterTax),
        currency
      )}): focus on cost reduction and revenue growth`
    );
  }

  const doc: TDocumentDefinitions = {
    pageMargins: [36, 36, 36, 48],
    defaultStyle: {
      fontSize: 10,
    },
    styles: {
      h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 8] },
      h2: { fontSize: 14, bold: true, margin: [0, 10, 0, 6] },
      h3: { fontSize: 12, bold: true, margin: [0, 8, 0, 4] },
      meta: { color: "#666", margin: [0, 0, 0, 12] },
      tHeader: { bold: true, fillColor: "#f3f4f6" },
    },
    content: [
      {
        text: reportSettings.reportTitle || "Financial Performance Report",
        style: "h1",
      },
      {
        text: `${companyInfo.companyName || "Company Name"} — Period: ${
          reportSettings.reportPeriod || "2024"
        } — Generated: ${new Date().toLocaleDateString()}`,
        style: "meta",
      },

      { text: "Executive Summary", style: "h2" },
      {
        ul: summaryLines,
      },

      { text: "P&L Statement Summary", style: "h2" },
      {
        table: {
          headerRows: 1,
          widths: ["*", 120, 100],
          body: plTableBody,
        },
        layout: "lightHorizontalLines",
      },

      { text: "Key Performance Indicators", style: "h2" },
      {
        table: {
          headerRows: 1,
          widths: ["*", 100, 120],
          body: kpiTableBody,
        },
        layout: "lightHorizontalLines",
      },

      { text: "Cost Structure Analysis", style: "h2" },
      { ul: costLines },

      { text: "Tax Efficiency", style: "h2" },
      { ul: taxLines },

      { text: "Strategic Recommendations", style: "h2" },
      { ul: recommendationLines },
    ],
    footer: (currentPage, pageCount) => ({
      columns: [
        {
          text: companyInfo.companyName || "",
          alignment: "left",
          color: "#666",
        },
        {
          text: `${currentPage} / ${pageCount}`,
          alignment: "right",
          color: "#666",
        },
      ],
      margin: [36, 12],
    }),
  };

  return doc;
}
