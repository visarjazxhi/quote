"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

interface ExportOptions {
  format: "pdf" | "excel" | "csv" | "json";
  reportType:
    | "pl"
    | "dashboard"
    | "kpis"
    | "analytics"
    | "forecast"
    | "risk"
    | "comprehensive";
  dateRange: {
    start: string;
    end: string;
  };
  includeCharts: boolean;
  includeDetails: boolean;
  includeProjections: boolean;
  currency: string;
  template: "standard" | "executive" | "detailed" | "presentation" | "mobile";
  emailOptions?: {
    recipient: string;
    subject: string;
    message: string;
    schedule?: string;
  };
}

interface ExportPreview {
  title: string;
  description: string;
  estimatedPages: number;
  sections: string[];
  fileSize: string;
  features: string[];
}

export function ExportManager() {
  const { data } = useFinancialStore();

  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "pdf",
    reportType: "comprehensive",
    dateRange: {
      start: "2024-01",
      end: "2024-12",
    },
    includeCharts: true,
    includeDetails: true,
    includeProjections: true,
    currency: "AUD",
    template: "standard",
  });

  const [isExporting, setIsExporting] = useState(false);

  const [exportStatus, setExportStatus] = useState<{
    success: boolean;
    fileName?: string;
    downloadUrl?: string;
    error?: string;
  } | null>(null);

  // Check if data is available
  const hasData = useMemo(() => {
    return !data.categories.every(
      (cat) =>
        cat.isCalculated ||
        cat.subcategories.every((sub) =>
          sub.rows.every((row) => row.values.every((val) => val.value === 0))
        )
    );
  }, [data]);

  const getReportTitle = (reportType: ExportOptions["reportType"]) => {
    const typeNames = {
      pl: "Profit & Loss Report",
      dashboard: "Financial Dashboard Report",
      kpis: "KPI Performance Report",
      analytics: "Financial Analytics Report",
      forecast: "Financial Forecast Report",
      risk: "Risk Assessment Report",
      comprehensive: "Comprehensive Financial Report",
    };
    return typeNames[reportType];
  };

  const getReportDescription = (reportType: ExportOptions["reportType"]) => {
    const descriptions = {
      pl: "Detailed profit and loss statement with revenue and expense breakdown",
      dashboard:
        "Executive dashboard with key financial metrics and visualizations",
      kpis: "Key performance indicators with industry benchmarking and analysis",
      analytics:
        "In-depth financial analysis with trends and performance metrics",
      forecast: "Forward-looking financial projections and forecasting models",
      risk: "Comprehensive risk analysis with Monte Carlo simulations",
      comprehensive:
        "Complete financial package including all reports and analysis",
    };
    return descriptions[reportType];
  };

  // Generate export preview
  const exportPreview = useMemo((): ExportPreview => {
    const baseFeatures = [
      "Professional formatting",
      "Data integrity verification",
    ];
    const getSections = (reportType: ExportOptions["reportType"]) => {
      const allSections = {
        pl: [
          "Executive Summary",
          "P&L Statement",
          "Revenue Analysis",
          "Expense Breakdown",
        ],
        dashboard: [
          "Key Metrics",
          "Performance Charts",
          "Trend Analysis",
          "Monthly Breakdown",
        ],
        kpis: [
          "KPI Summary",
          "Industry Benchmarks",
          "Performance Score",
          "Recommendations",
        ],
        analytics: [
          "Financial Ratios",
          "Trend Analysis",
          "Comparative Analysis",
          "Insights",
        ],
        forecast: [
          "Forecast Models",
          "Scenario Analysis",
          "Projections",
          "Assumptions",
        ],
        risk: [
          "Risk Metrics",
          "Monte Carlo Results",
          "Sensitivity Analysis",
          "Risk Matrix",
        ],
        comprehensive: [
          "All Sections",
          "Executive Summary",
          "Detailed Analysis",
          "Appendices",
        ],
      };
      return allSections[reportType];
    };

    const sections = getSections(exportOptions.reportType);
    const features = [...baseFeatures];
    if (exportOptions.includeCharts)
      features.push("Interactive charts and graphs");
    if (exportOptions.includeDetails) features.push("Detailed data tables");
    if (exportOptions.includeProjections) features.push("Future projections");
    if (exportOptions.format === "pdf") features.push("Print-ready PDF format");

    const estimatedPages =
      exportOptions.reportType === "comprehensive"
        ? 25
        : exportOptions.reportType === "risk"
        ? 15
        : exportOptions.reportType === "analytics"
        ? 12
        : exportOptions.reportType === "kpis"
        ? 8
        : exportOptions.reportType === "dashboard"
        ? 6
        : 4;

    const fileSize =
      exportOptions.format === "pdf"
        ? `${estimatedPages * 0.8}MB`
        : exportOptions.format === "excel"
        ? `${estimatedPages * 0.3}MB`
        : `${estimatedPages * 0.1}MB`;

    return {
      title: getReportTitle(exportOptions.reportType),
      description: getReportDescription(exportOptions.reportType),
      estimatedPages: estimatedPages + (exportOptions.includeCharts ? 5 : 0),
      sections,
      fileSize,
      features,
    };
  }, [exportOptions]);

  const handleExport = async () => {
    if (!hasData) {
      setExportStatus({
        success: false,
        error: "No data available to export. Please add financial data first.",
      });
      return;
    }

    setIsExporting(true);
    setExportStatus(null);

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate filename
      const timestamp = new Date().toISOString().split("T")[0];
      const fileName = `${exportOptions.reportType}-report-${timestamp}.${exportOptions.format}`;

      setExportStatus({
        success: true,
        fileName,
        downloadUrl: `#download-${fileName}`, // Placeholder URL
      });
    } catch (error) {
      // ✅ Fixed: Log the actual error for debugging
      console.error("Export failed:", error);

      setExportStatus({
        success: false,
        error: "Export failed. Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg sm:text-xl">
                Export Manager
              </CardTitle>
            </div>
            {hasData && (
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  {data.categories.filter((c) => !c.isCalculated).length}{" "}
                  Categories
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!hasData && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No financial data found. Please enter data in the Input Data tab
                before exporting.
              </AlertDescription>
            </Alert>
          )}
          <Tabs defaultValue="configure" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3">
              <TabsTrigger value="configure" className="text-xs sm:text-sm">
                Options
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-xs sm:text-sm">
                Preview
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs sm:text-sm">
                History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="configure" className="space-y-4 sm:space-y-6">
              {/* Report Type Selection */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold">
                  Report Configuration
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Report Type</Label>
                    <Select
                      value={exportOptions.reportType}
                      onValueChange={(value: ExportOptions["reportType"]) =>
                        setExportOptions({
                          ...exportOptions,
                          reportType: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comprehensive">
                          Comprehensive Report
                        </SelectItem>
                        <SelectItem value="dashboard">
                          Financial Dashboard
                        </SelectItem>
                        <SelectItem value="kpis">KPI Analysis</SelectItem>
                        <SelectItem value="pl">P&L Statement</SelectItem>
                        <SelectItem value="analytics">
                          Financial Analytics
                        </SelectItem>
                        <SelectItem value="forecast">
                          Forecasts & Projections
                        </SelectItem>
                        <SelectItem value="risk">Risk Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Export Format</Label>
                    <Select
                      value={exportOptions.format}
                      onValueChange={(value: ExportOptions["format"]) =>
                        setExportOptions({ ...exportOptions, format: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="excel">Excel Workbook</SelectItem>
                        <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                        <SelectItem value="json">JSON Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Template Style</Label>
                    <Select
                      value={exportOptions.template}
                      onValueChange={(value: ExportOptions["template"]) =>
                        setExportOptions({
                          ...exportOptions,
                          template: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="executive">
                          Executive Summary
                        </SelectItem>
                        <SelectItem value="detailed">
                          Detailed Analysis
                        </SelectItem>
                        <SelectItem value="presentation">
                          Presentation
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              {/* Export Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exportOptions.dateRange.start}
                        onChange={(e) =>
                          setExportOptions({
                            ...exportOptions,
                            dateRange: {
                              ...exportOptions.dateRange,
                              start: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exportOptions.dateRange.end}
                        onChange={(e) =>
                          setExportOptions({
                            ...exportOptions,
                            dateRange: {
                              ...exportOptions.dateRange,
                              end: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-base font-medium">
                        Include in Export:
                      </Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="charts"
                            checked={exportOptions.includeCharts}
                            onCheckedChange={(checked) =>
                              setExportOptions({
                                ...exportOptions,
                                includeCharts: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor="charts">
                            Charts & Visualizations
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="details"
                            checked={exportOptions.includeDetails}
                            onCheckedChange={(checked) =>
                              setExportOptions({
                                ...exportOptions,
                                includeDetails: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor="details">Detailed Breakdowns</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="projections"
                            checked={exportOptions.includeProjections}
                            onCheckedChange={(checked) =>
                              setExportOptions({
                                ...exportOptions,
                                includeProjections: checked as boolean,
                              })
                            }
                          />
                          <Label htmlFor="projections">
                            Future Projections
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select
                        value={exportOptions.currency}
                        onValueChange={(value) =>
                          setExportOptions({
                            ...exportOptions,
                            currency: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AUD">
                            AUD (Australian Dollar)
                          </SelectItem>
                          <SelectItem value="USD">USD (US Dollar)</SelectItem>
                          <SelectItem value="EUR">EUR (Euro)</SelectItem>
                          <SelectItem value="GBP">
                            GBP (British Pound)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Preview Details */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-lg">
                          {exportPreview.title}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {exportPreview.description}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">
                            {exportPreview.estimatedPages}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {exportOptions.format === "pdf"
                              ? "Pages"
                              : "Sections"}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold">
                            {exportPreview.fileSize}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Estimated Size
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Included Sections:</h4>
                        <div className="space-y-1">
                          {exportPreview.sections.map((section) => (
                            <div
                              key={`section-${section}`}
                              className="flex items-center gap-2 text-sm"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {section}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Export Actions */}
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg space-y-3">
                        <h4 className="font-medium">Export Options Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Format:</span>
                            <Badge variant="outline">
                              {exportOptions.format.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Date Range:</span>
                            <span>
                              {exportOptions.dateRange.start} to{" "}
                              {exportOptions.dateRange.end}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Template:</span>
                            <span className="capitalize">
                              {exportOptions.template}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Currency:</span>
                            <span>{exportOptions.currency}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full"
                        size="lg"
                      >
                        {isExporting ? (
                          <>
                            <Settings className="h-4 w-4 mr-2 animate-spin" />
                            Generating Export...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Generate Export
                          </>
                        )}
                      </Button>
                      {exportStatus && (
                        <div
                          className={`p-3 rounded-lg ${
                            exportStatus.success
                              ? "bg-green-50 border-green-200"
                              : "bg-red-50 border-red-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {exportStatus.success ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span
                              className={`font-medium ${
                                exportStatus.success
                                  ? "text-green-800"
                                  : "text-red-800"
                              }`}
                            >
                              {exportStatus.success
                                ? "Export Successful!"
                                : "Export Failed"}
                            </span>
                          </div>
                          {exportStatus.fileName && (
                            <p className="text-sm text-green-600 mt-1">
                              Downloaded: {exportStatus.fileName}
                            </p>
                          )}
                          {exportStatus.error && (
                            <p className="text-sm text-red-600 mt-1">
                              {exportStatus.error}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Export History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No previous exports found.</p>
                    <p className="text-sm">
                      Export history will appear here after you generate
                      reports.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
