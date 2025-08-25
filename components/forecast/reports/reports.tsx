"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Eye, FileText, Globe } from "lucide-react";
// Removed tabs in favor of a single combined view
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { FinancialData } from "@/lib/forecast/types/financial";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PDFGenerator } from "@/lib/forecast/services/pdf-generator";
import type { PDFReportData } from "@/lib/forecast/services/pdf-generator";
import { Separator } from "@/components/ui/separator";
import { buildPdfMakeDoc } from "@/lib/forecast/services/pdfmake-builder";
import pdfFonts from "pdfmake/build/vfs_fonts";
// switch to pdfmake for vector PDF output (smaller file size, selectable text)
import pdfMake from "pdfmake/build/pdfmake";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

// UnifiedReview section removed per user request

function buildPdfData(
  data: FinancialData,
  fns: {
    getCategoryYearlyTotalByType: (type: string) => number;
    getMonthlyData: (year: number) => Record<string, number[]>;
    getFinancialRatios: () => Record<string, number>;
    getCashFlowData: () => number[];
    getGrowthRates: (years: number) => Record<string, number>;
  },
  reportSettings: ReportSettings,
  companyInfo: Partial<PDFReportData["companyInfo"]>
): PDFReportData {
  const yearlyTotals: Record<string, number> = {};
  data.categories.forEach((category) => {
    yearlyTotals[category.type] = fns.getCategoryYearlyTotalByType(
      category.type
    );
  });

  const yearNum =
    Number(reportSettings.reportPeriod) || new Date().getFullYear();
  const categoryMonthlyData = fns.getMonthlyData(yearNum);
  const monthlyData: Record<string, number[]> = {};
  data.categories.forEach((category) => {
    // Prefer mapping by type; fallback to id if needed
    monthlyData[category.type] =
      categoryMonthlyData[category.type] ??
      categoryMonthlyData[category.id] ??
      Array(12).fill(0);
  });

  // Compute KPI metrics from P&L (align with Summary/KPI Dashboard)
  const revenue = yearlyTotals["sales_revenue"] ?? 0;
  const cogs = Math.abs(yearlyTotals["cogs"] ?? 0);
  const grossProfit = revenue - cogs;
  const operatingExpenses = Math.abs(yearlyTotals["operating_expenses"] ?? 0);
  const otherIncome = yearlyTotals["other_income"] ?? 0;
  const financialExpenses = Math.abs(yearlyTotals["financial_expenses"] ?? 0);
  const otherExpenses = Math.abs(yearlyTotals["other_expenses"] ?? 0);
  const operatingProfit = grossProfit - operatingExpenses;
  const netProfitBeforeTax =
    operatingProfit + otherIncome - financialExpenses - otherExpenses;
  const effTaxRate = (companyInfo.taxRate ?? 25) / 100;
  const taxExpense =
    netProfitBeforeTax > 0 ? netProfitBeforeTax * effTaxRate : 0;
  const netProfitAfterTax = netProfitBeforeTax - taxExpense;

  const kpiProfitability = {
    grossProfitMargin: revenue > 0 ? (grossProfit / revenue) * 100 : 0,
    operatingMargin: revenue > 0 ? (operatingProfit / revenue) * 100 : 0,
    netProfitMargin: revenue > 0 ? (netProfitAfterTax / revenue) * 100 : 0,
    returnOnAssets: 0,
    returnOnEquity: 0,
  };

  return {
    companyInfo: {
      companyName: companyInfo.companyName ?? "",
      tradingName: companyInfo.tradingName ?? "",
      industry: companyInfo.industry ?? "",
      companySize: companyInfo.companySize ?? "",
      address: companyInfo.address ?? "",
      city: companyInfo.city ?? "",
      state: companyInfo.state ?? "",
      postcode: companyInfo.postcode ?? "",
      country: companyInfo.country ?? "Australia",
      phone: companyInfo.phone ?? "",
      email: companyInfo.email ?? "",
      website: companyInfo.website ?? "",
      foundedYear: companyInfo.foundedYear ?? "",
      employeeCount: companyInfo.employeeCount ?? "",
      financialYearEnd: companyInfo.financialYearEnd ?? "30 June",
      taxRate: companyInfo.taxRate ?? 25,
      reportingCurrency: companyInfo.reportingCurrency ?? "AUD",
      description: companyInfo.description ?? "",
      keyProducts: companyInfo.keyProducts ?? "",
      targetMarket: companyInfo.targetMarket ?? "",
      competitiveAdvantages: companyInfo.competitiveAdvantages ?? "",
    },
    financialData: {
      categories: data.categories,
      yearlyTotals,
      monthlyData,
      financialRatios: fns.getFinancialRatios(),
      cashFlowData: fns.getCashFlowData(),
      growthRates: fns.getGrowthRates(1),
    },
    kpiMetrics: {
      profitability: kpiProfitability,
      liquidity: { currentRatio: 0, quickRatio: 0, cashRatio: 0 },
      efficiency: {
        assetTurnover: 0,
        inventoryTurnover: 0,
        receivablesTurnover: 0,
      },
      leverage: { debtToEquity: 0, debtToAssets: 0, interestCoverage: 0 },
    },
    forecastData: {
      revenueForecast: Array(12).fill(0),
      profitForecast: Array(12).fill(0),
      cashFlowForecast: Array(12).fill(0),
      growthProjections: Array(12).fill(0),
      scenarioAnalysis: {
        optimistic: Array(12).fill(0),
        base: Array(12).fill(0),
        pessimistic: Array(12).fill(0),
      },
    },
    reportSettings,
  };
}

interface ReportSettings {
  reportTitle: string;
  reportPeriod: string;
  includeCharts: boolean;
  includeBenchmarks: boolean;
  includeExecutiveSummary: boolean;
  includeDetailedAnalysis: boolean;
  includeAppendices: boolean;
  reportTemplate: string;
  pageSize: string;
  orientation: string;
  includePageNumbers: boolean;
  includeTableOfContents: boolean;
  customHeader: string;
  customFooter: string;
}

const defaultReportSettings: ReportSettings = {
  reportTitle: "",
  reportPeriod: "2024",
  includeCharts: true,
  includeBenchmarks: true,
  includeExecutiveSummary: true,
  includeDetailedAnalysis: true,
  includeAppendices: true,
  reportTemplate: "professional",
  pageSize: "A4",
  orientation: "portrait",
  includePageNumbers: true,
  includeTableOfContents: true,
  customHeader: "",
  customFooter: "",
};

// Removed formatting select options per user request

function hasAnyNonZeroData(financialData: FinancialData): boolean {
  return financialData.categories.some(
    (category) =>
      !category.isCalculated &&
      category.subcategories.some((subcategory) =>
        subcategory.rows.some((row) =>
          row.values.some((value) => value.value !== 0)
        )
      )
  );
}

export function Reports() {
  const {
    data,
    getCategoryYearlyTotalByType,
    getMonthlyData,
    getFinancialRatios,
    getCashFlowData,
    getGrowthRates,
  } = useFinancialStore();
  const [reportSettings, setReportSettings] = useState<ReportSettings>(
    defaultReportSettings
  );
  const [isGenerating, setIsGenerating] = useState(false);
  // Deprecated preview state removed in unified view

  // Check if data is available
  const hasData = useMemo(() => hasAnyNonZeroData(data), [data]);

  const handleInputChange = (
    field: keyof ReportSettings,
    value: string | number | boolean
  ) => {
    setReportSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Removed reset control per user request

  // Load saved data on component mount
  useEffect(() => {
    const saved = localStorage.getItem("reportSettings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setReportSettings(parsed);
      } catch (error) {
        console.error("Error loading saved report settings:", error);
      }
    }
  }, []);

  // Auto-save settings whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("reportSettings", JSON.stringify(reportSettings));
    } catch (error) {
      console.error("Failed to save report settings:", error);
    }
  }, [reportSettings]);

  // Preview: open print-ready HTML in a popup
  const handlePreview = async () => {
    if (!hasData) {
      alert("No data available to preview. Please add financial data first.");
      return;
    }

    try {
      const savedCompanyInfo = localStorage.getItem("companyInfo");
      const companyInfo = (
        savedCompanyInfo ? JSON.parse(savedCompanyInfo) : {}
      ) as Partial<PDFReportData["companyInfo"]>;

      const pdfData = buildPdfData(
        data,
        {
          getCategoryYearlyTotalByType,
          getMonthlyData,
          getFinancialRatios,
          getCashFlowData,
          getGrowthRates,
        },
        reportSettings,
        companyInfo
      );

      const html = new PDFGenerator(pdfData).generatePDF();
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      if (win) {
        win.document.title = `${
          reportSettings.reportTitle || "Financial Report"
        }`;
      }
    } catch (err) {
      console.error("Preview failed:", err);
      alert("Preview failed. Please try again.");
    }
  };

  // Download: generate actual PDF from clean HTML (avoid CSS color functions like lab/oklch)
  const handleExportPDF = async () => {
    if (!hasData) {
      alert("No data available to export. Please add financial data first.");
      return;
    }

    setIsGenerating(true);
    try {
      const savedCompanyInfo = localStorage.getItem("companyInfo");
      const companyInfo = (
        savedCompanyInfo ? JSON.parse(savedCompanyInfo) : {}
      ) as Partial<PDFReportData["companyInfo"]>;

      const pdfData = buildPdfData(
        data,
        {
          getCategoryYearlyTotalByType,
          getMonthlyData,
          getFinancialRatios,
          getCashFlowData,
          getGrowthRates,
        },
        reportSettings,
        companyInfo
      );

      // Use pdfmake for vector text output
      const anyPdfMake = pdfMake as unknown as { vfs?: unknown };
      const fontsAny = pdfFonts as {
        pdfMake?: { vfs?: unknown };
        vfs?: unknown;
        default?: { vfs?: unknown; pdfMake?: { vfs?: unknown } };
      };
      const vfsCandidate =
        fontsAny?.pdfMake?.vfs ??
        fontsAny?.vfs ??
        fontsAny?.default?.vfs ??
        fontsAny?.default?.pdfMake?.vfs;
      if (anyPdfMake.vfs == null && vfsCandidate != null) {
        anyPdfMake.vfs = vfsCandidate;
      }
      const docDef = buildPdfMakeDoc(pdfData);
      const timestamp = new Date().toISOString().split("T")[0];
      const fileName = `${
        reportSettings.reportTitle || "financial-report"
      }-${timestamp}.pdf`;
      pdfMake.createPdf(docDef).download(fileName);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // currency formatting handled by child components

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Actions
          </CardTitle>
          <CardDescription>
            Preview opens a print-ready HTML. Download generates a real PDF
            without using app CSS variables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handlePreview} variant="outline" className="gap-2">
              <Eye className="h-4 w-4" /> Preview (HTML)
            </Button>
            <Button
              onClick={handleExportPDF}
              disabled={isGenerating}
              className="gap-2"
            >
              <Download className="h-4 w-4" />{" "}
              {isGenerating ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Report Settings
            </CardTitle>
            <CardDescription>
              Customize your financial reports and analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Report Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportTitle">Report Title</Label>
                  <Input
                    id="reportTitle"
                    value={reportSettings.reportTitle}
                    onChange={(e) =>
                      handleInputChange("reportTitle", e.target.value)
                    }
                    placeholder="e.g., Annual Financial Report 2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportPeriod">Report Period</Label>
                  <Input
                    id="reportPeriod"
                    value={reportSettings.reportPeriod}
                    onChange={(e) =>
                      handleInputChange("reportPeriod", e.target.value)
                    }
                    placeholder="e.g., 2025"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Report Content Options */}
            <ReportContentOptions
              settings={reportSettings}
              onChange={handleInputChange}
            />

            {/* Removed formatting options and everything below per request */}
          </CardContent>
        </Card>
      </div>
      {/* Unified Review removed per request */}
    </div>
  );
}

function ReportContentOptions({
  settings,
  onChange,
}: Readonly<{
  settings: ReportSettings;
  onChange: (
    field: keyof ReportSettings,
    value: string | number | boolean
  ) => void;
}>) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Report Content</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeCharts"
            checked={settings.includeCharts}
            onChange={(e) => onChange("includeCharts", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="includeCharts">Include Charts & Graphs</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeBenchmarks"
            checked={settings.includeBenchmarks}
            onChange={(e) => onChange("includeBenchmarks", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="includeBenchmarks">Include Industry Benchmarks</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeExecutiveSummary"
            checked={settings.includeExecutiveSummary}
            onChange={(e) =>
              onChange("includeExecutiveSummary", e.target.checked)
            }
            className="rounded"
          />
          <Label htmlFor="includeExecutiveSummary">
            Include Executive Summary
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeDetailedAnalysis"
            checked={settings.includeDetailedAnalysis}
            onChange={(e) =>
              onChange("includeDetailedAnalysis", e.target.checked)
            }
            className="rounded"
          />
          <Label htmlFor="includeDetailedAnalysis">
            Include Detailed Analysis
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeAppendices"
            checked={settings.includeAppendices}
            onChange={(e) => onChange("includeAppendices", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="includeAppendices">Include Appendices</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="includeTableOfContents"
            checked={settings.includeTableOfContents}
            onChange={(e) =>
              onChange("includeTableOfContents", e.target.checked)
            }
            className="rounded"
          />
          <Label htmlFor="includeTableOfContents">
            Include Table of Contents
          </Label>
        </div>
      </div>
    </div>
  );
}
