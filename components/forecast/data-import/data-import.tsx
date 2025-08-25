"use client";

import {
  AlertCircle,
  CheckCircle,
  Database,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Settings,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useMemo, useRef, useState } from "react";
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
import { ExportManager } from "@/components/forecast/export/export-manager";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

interface ImportMapping {
  csvColumn: string;
  financialRowId: string;
  transformation: "none" | "multiply" | "divide" | "negate";
  transformValue?: number;
}

interface ImportPreview {
  fileName: string;
  headers: string[];
  sampleData: Record<string, string>[];
  totalRows: number;
  dateColumns: string[];
}

interface ValidationError {
  row: number;
  column: string;
  value: string;
  error: string;
}

export function DataImport() {
  const { data, updateRowValues } = useFinancialStore();
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(
    null
  );
  const [mappings, setMappings] = useState<ImportMapping[]>([]);
  const [importMode, setImportMode] = useState<"replace" | "append" | "update">(
    "update"
  );
  const [dateFormat, setDateFormat] = useState<string>("YYYY-MM");
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: boolean;
    rowsProcessed: number;
    rowsImported: number;
    errors: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get all available financial rows for mapping
  const availableRows = useMemo(() => {
    const rows: { id: string; name: string; category: string; type: string }[] =
      [];

    data.categories.forEach((category) => {
      if (!category.isCalculated) {
        category.subcategories.forEach((subcategory) => {
          subcategory.rows.forEach((row) => {
            rows.push({
              id: row.id,
              name: `${category.name} > ${subcategory.name} > ${row.name}`,
              category: category.name,
              type: category.type,
            });
          });
        });
      }
    });

    return rows;
  }, [data]);

  // Parse CSV file
  const parseCSV = (content: string): Record<string, string>[] => {
    const rows: Record<string, string>[] = [];
    const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
    if (lines.length === 0) return rows;

    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === "," && !inQuotes) {
          result.push(current);
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current);
      return result.map((s) => s.trim());
    };

    const headers = parseLine(lines[0]).map((h) => h.replace(/["']/g, ""));
    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i]).map((v) => v.replace(/["']/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] ?? "";
      });
      rows.push(row);
    }
    return rows;
  };

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setIsProcessing(true);

    try {
      const content = await file.text();
      let parsedData: Record<string, string>[] = [];

      if (file.name.endsWith(".csv")) {
        parsedData = parseCSV(content);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        // For Excel files, we'd need a library like xlsx
        // For now, show an error message directing users to save as CSV
        throw new Error(
          "Excel files not supported yet. Please save your file as CSV format."
        );
      } else {
        throw new Error("Unsupported file format. Please use CSV files.");
      }

      if (parsedData.length === 0) {
        throw new Error("No data found in file.");
      }

      const headers = Object.keys(parsedData[0]);

      // Detect potential date columns
      const dateColumns = headers.filter((header) => {
        const sampleValue = parsedData[0][header];
        return /\d{4}[-/]\d{1,2}|\d{1,2}[-/]\d{4}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/i.test(
          sampleValue
        );
      });

      const preview: ImportPreview = {
        fileName: file.name,
        headers,
        sampleData: parsedData.slice(0, 5), // First 5 rows for preview
        totalRows: parsedData.length,
        dateColumns,
      };

      setImportPreview(preview);

      // Auto-create mappings for common column names
      const autoMappings: ImportMapping[] = [];
      headers.forEach((header) => {
        const lowerHeader = header.toLowerCase();
        let matchedRow = null;

        // Try to match common patterns
        if (lowerHeader.includes("revenue") || lowerHeader.includes("sales")) {
          matchedRow = availableRows.find(
            (row) => row.type === "sales_revenue"
          );
        } else if (
          lowerHeader.includes("cogs") ||
          lowerHeader.includes("cost of goods")
        ) {
          matchedRow = availableRows.find((row) => row.type === "cogs");
        } else if (
          lowerHeader.includes("salary") ||
          lowerHeader.includes("wage")
        ) {
          matchedRow = availableRows.find((row) =>
            row.name.toLowerCase().includes("salary")
          );
        } else if (lowerHeader.includes("rent")) {
          matchedRow = availableRows.find((row) =>
            row.name.toLowerCase().includes("rent")
          );
        } else if (lowerHeader.includes("marketing")) {
          matchedRow = availableRows.find((row) =>
            row.name.toLowerCase().includes("marketing")
          );
        }

        if (matchedRow) {
          autoMappings.push({
            csvColumn: header,
            financialRowId: matchedRow.id,
            transformation: "none",
          });
        }
      });

      setMappings(autoMappings);
      setValidationErrors([]);
    } catch (error) {
      console.error("Error parsing file:", error);
      setImportResults({
        success: false,
        rowsProcessed: 0,
        rowsImported: 0,
        errors: [
          error instanceof Error ? error.message : "Unknown error occurred",
        ],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Add new mapping
  const addMapping = () => {
    if (!importPreview) return;

    setMappings([
      ...mappings,
      {
        csvColumn: importPreview.headers[0],
        financialRowId: availableRows[0]?.id || "",
        transformation: "none",
      },
    ]);
  };

  // Remove mapping
  const removeMapping = (index: number) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };

  // Update mapping
  const updateMapping = (
    index: number,
    field: keyof ImportMapping,
    value: string | number
  ) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setMappings(newMappings);
  };

  // Validate import data
  const validateImportData = async (): Promise<ValidationError[]> => {
    if (!importFile) return [];

    const errors: ValidationError[] = [];
    const content = await importFile.text();
    const allData = parseCSV(content);

    allData.forEach((row, rowIndex) => {
      mappings.forEach((mapping) => {
        const value = row[mapping.csvColumn];

        // Check if numeric value is expected
        if (value && value !== "") {
          const numericValue = parseFloat(value.replace(/[,$]/g, ""));
          if (isNaN(numericValue)) {
            errors.push({
              row: rowIndex + 2, // +2 because of header and 0-based index
              column: mapping.csvColumn,
              value,
              error: "Expected numeric value",
            });
          }
        }
      });
    });

    return errors;
  };

  // Process import
  const processImport = async () => {
    if (!importFile || !importPreview) return;

    setIsProcessing(true);
    setValidationErrors([]);

    try {
      const content = await importFile.text();
      const allData = parseCSV(content);

      // Validate data first
      const errors = await validateImportData();
      if (errors.length > 0) {
        setValidationErrors(errors);
        setIsProcessing(false);
        return;
      }

      let rowsProcessed = 0;
      let rowsImported = 0;
      const importErrors: string[] = [];

      // Process each data row
      for (const dataRow of allData) {
        rowsProcessed++;

        try {
          // Process each mapping
          for (const mapping of mappings) {
            const csvValue = dataRow[mapping.csvColumn];
            if (!csvValue || csvValue === "") continue;

            // Parse numeric value
            let numericValue = parseFloat(csvValue.replace(/[,$]/g, ""));
            if (isNaN(numericValue)) continue;

            // Apply transformation
            switch (mapping.transformation) {
              case "multiply":
                numericValue *= mapping.transformValue || 1;
                break;
              case "divide":
                numericValue /= mapping.transformValue || 1;
                break;
              case "negate":
                numericValue = -numericValue;
                break;
            }

            // Find the target row
            const targetRow = availableRows.find(
              (row) => row.id === mapping.financialRowId
            );
            if (!targetRow) continue;

            // For simplicity, we'll import to the current year
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;

            // Update the financial data
            updateRowValues(mapping.financialRowId, [
              {
                value: numericValue,
                year: currentYear,
                month: currentMonth,
                date: `${currentYear}-${currentMonth
                  .toString()
                  .padStart(2, "0")}-01`,
                isProjected: false,
              },
            ]);
          }

          rowsImported++;
        } catch (error) {
          importErrors.push(
            `Row ${rowsProcessed}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }

      setImportResults({
        success: true,
        rowsProcessed,
        rowsImported,
        errors: importErrors,
      });
    } catch (error) {
      setImportResults({
        success: false,
        rowsProcessed: 0,
        rowsImported: 0,
        errors: [error instanceof Error ? error.message : "Import failed"],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear import
  const clearImport = () => {
    setImportFile(null);
    setImportPreview(null);
    setMappings([]);
    setValidationErrors([]);
    setImportResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Generate CSV template
  const downloadTemplate = () => {
    const template = [
      [
        "Account Name",
        "Jan 2024",
        "Feb 2024",
        "Mar 2024",
        "Apr 2024",
        "Description",
      ],
      [
        "Main Product Sales",
        "50000",
        "55000",
        "60000",
        "65000",
        "Monthly product revenue",
      ],
      [
        "Raw Materials",
        "15000",
        "16500",
        "18000",
        "19500",
        "Cost of raw materials",
      ],
      [
        "Salaries & Wages",
        "25000",
        "25000",
        "26000",
        "26000",
        "Employee salaries",
      ],
      ["Rent", "5000", "5000", "5000", "5000", "Office rent"],
      ["Marketing", "3000", "4000", "5000", "4500", "Marketing expenses"],
    ];

    const csvContent = template.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "financial-data-template.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="import" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="import">Import Data</TabsTrigger>
              <TabsTrigger value="export">Export Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="space-y-4">
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="upload">Upload File</TabsTrigger>
                  <TabsTrigger value="mapping">Column Mapping</TabsTrigger>
                  <TabsTrigger value="preview">Data Preview</TabsTrigger>
                  <TabsTrigger value="results">Import Results</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">File Upload</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* File Upload Area */}
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">
                            Upload Financial Data
                          </h3>
                          <p className="text-muted-foreground">
                            Upload CSV files with your financial data. Excel
                            files should be saved as CSV first.
                          </p>
                        </div>

                        <div className="mt-4 space-y-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".csv,.xlsx,.xls"
                            className="hidden"
                          />
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isProcessing}
                            className="mx-2"
                          >
                            {isProcessing ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Choose File
                              </>
                            )}
                          </Button>

                          <Button variant="outline" onClick={downloadTemplate}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Template
                          </Button>
                        </div>

                        {importFile && (
                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="font-medium">
                                  {importFile.name}
                                </span>
                                <Badge variant="secondary">
                                  {(importFile.size / 1024).toFixed(1)} KB
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearImport}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Import Settings */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Import Mode</Label>
                          <Select
                            value={importMode}
                            onValueChange={(
                              value: "replace" | "append" | "update"
                            ) => setImportMode(value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="update">
                                Update existing data
                              </SelectItem>
                              <SelectItem value="replace">
                                Replace all data
                              </SelectItem>
                              <SelectItem value="append">
                                Append to existing
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Date Format</Label>
                          <Select
                            value={dateFormat}
                            onValueChange={setDateFormat}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="YYYY-MM">
                                YYYY-MM (2024-01)
                              </SelectItem>
                              <SelectItem value="MM/YYYY">
                                MM/YYYY (01/2024)
                              </SelectItem>
                              <SelectItem value="MMM YYYY">
                                MMM YYYY (Jan 2024)
                              </SelectItem>
                              <SelectItem value="YYYY-MM-DD">
                                YYYY-MM-DD (2024-01-01)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Currency</Label>
                          <Select defaultValue="AUD">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AUD">
                                AUD (Australian Dollar)
                              </SelectItem>
                              <SelectItem value="USD">
                                USD (US Dollar)
                              </SelectItem>
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

                <TabsContent value="mapping" className="space-y-4">
                  {importPreview ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          Column Mapping
                          <Button onClick={addMapping} size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Add Mapping
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {mappings.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>No column mappings configured.</p>
                              <p>
                                Click &ldquo;Add Mapping&rdquo; to start mapping
                                your CSV columns to financial accounts.
                              </p>
                            </div>
                          ) : (
                            mappings.map((mapping, index) => (
                              <div
                                key={`${mapping.csvColumn}-${mapping.financialRowId}-${index}`}
                                className="grid grid-cols-12 gap-4 items-end p-4 border rounded-lg"
                              >
                                <div className="col-span-3">
                                  <Label>CSV Column</Label>
                                  <Select
                                    value={mapping.csvColumn}
                                    onValueChange={(value) =>
                                      updateMapping(index, "csvColumn", value)
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {importPreview.headers.map((header) => (
                                        <SelectItem key={header} value={header}>
                                          {header}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="col-span-4">
                                  <Label>Financial Account</Label>
                                  <Select
                                    value={mapping.financialRowId}
                                    onValueChange={(value) =>
                                      updateMapping(
                                        index,
                                        "financialRowId",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableRows.map((row) => (
                                        <SelectItem key={row.id} value={row.id}>
                                          {row.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className="col-span-2">
                                  <Label>Transform</Label>
                                  <Select
                                    value={mapping.transformation}
                                    onValueChange={(
                                      value:
                                        | "none"
                                        | "multiply"
                                        | "divide"
                                        | "negate"
                                    ) =>
                                      updateMapping(
                                        index,
                                        "transformation",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">None</SelectItem>
                                      <SelectItem value="multiply">
                                        Multiply
                                      </SelectItem>
                                      <SelectItem value="divide">
                                        Divide
                                      </SelectItem>
                                      <SelectItem value="negate">
                                        Negate
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {mapping.transformation !== "none" &&
                                  mapping.transformation !== "negate" && (
                                    <div className="col-span-2">
                                      <Label>Value</Label>
                                      <Input
                                        type="number"
                                        value={mapping.transformValue || ""}
                                        onChange={(e) =>
                                          updateMapping(
                                            index,
                                            "transformValue",
                                            parseFloat(e.target.value)
                                          )
                                        }
                                        placeholder="1.0"
                                      />
                                    </div>
                                  )}

                                <div className="col-span-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeMapping(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Upload a file first to configure column mappings.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  {importPreview ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          Data Preview
                          <div className="flex gap-2">
                            <Badge variant="outline">
                              {importPreview.totalRows} rows
                            </Badge>
                            <Badge variant="outline">
                              {importPreview.headers.length} columns
                            </Badge>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Sample Data Table */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm border">
                              <thead>
                                <tr className="border-b bg-muted">
                                  {importPreview.headers.map((header) => (
                                    <th
                                      key={header}
                                      className="p-2 text-left font-medium"
                                    >
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {importPreview.sampleData.map((row, index) => (
                                  <tr
                                    key={`sample-${index}-${Object.values(row)
                                      .slice(0, 2)
                                      .join("-")}`}
                                    className="border-b hover:bg-muted/50"
                                  >
                                    {importPreview.headers.map((header) => (
                                      <td key={header} className="p-2">
                                        {row[header]}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Validation Errors */}
                          {validationErrors.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-red-600 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Validation Errors ({validationErrors.length})
                              </h4>
                              <div className="max-h-40 overflow-y-auto space-y-1">
                                {validationErrors
                                  .slice(0, 10)
                                  .map((error, index) => (
                                    <div
                                      key={index}
                                      className="text-sm p-2 bg-red-50 rounded border-l-4 border-red-500"
                                    >
                                      Row {error.row}, Column &ldquo;
                                      {error.column}
                                      &rdquo;: {error.error} (value: &ldquo;
                                      {error.value}&rdquo;)
                                    </div>
                                  ))}
                                {validationErrors.length > 10 && (
                                  <div className="text-sm text-muted-foreground">
                                    ... and {validationErrors.length - 10} more
                                    errors
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Import Actions */}
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              Ready to import {mappings.length} mapped columns
                              from {importPreview.totalRows} rows
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" onClick={clearImport}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                              <Button
                                onClick={processImport}
                                disabled={
                                  isProcessing ||
                                  mappings.length === 0 ||
                                  validationErrors.length > 0
                                }
                              >
                                {isProcessing ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Importing...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Import Data
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-8">
                        <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Upload a file first to preview the data.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="results" className="space-y-4">
                  {importResults ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {importResults.success ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-600" />
                          )}
                          Import Results
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Summary */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold">
                                  {importResults.rowsProcessed}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Rows Processed
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  {importResults.rowsImported}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Rows Imported
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold text-red-600">
                                  {importResults.errors.length}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Errors
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Error Details */}
                          {importResults.errors.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="font-medium text-red-600">
                                Import Errors:
                              </h4>
                              <div className="max-h-40 overflow-y-auto space-y-1">
                                {importResults.errors.map((error, index) => (
                                  <div
                                    key={`err-${index}-${error.slice(0, 12)}`}
                                    className="text-sm p-2 bg-red-50 rounded border-l-4 border-red-500"
                                  >
                                    {error}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Success Message */}
                          {importResults.success && (
                            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-green-800">
                                  Import Completed Successfully!
                                </span>
                              </div>
                              <p className="text-sm text-green-600 mt-1">
                                Your financial data has been imported and is now
                                available in the P&L Statement.
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={clearImport}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Import Another File
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Import results will appear here after processing.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <ExportManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
