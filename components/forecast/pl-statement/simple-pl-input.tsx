"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";
import { useForecastDatabase } from "@/lib/forecast/hooks/use-forecast-database";

interface CellData {
  [key: string]: number; // key format: "rowName-month"
}

interface SimplePLInputProps {
  readonly forecastId: string;
}

export function SimplePLInput({ forecastId }: SimplePLInputProps) {
  const [data, setData] = useState<CellData>({});
  const [taxRate, setTaxRate] = useState<number>(0.25); // Default 25% tax rate
  const [saving, setSaving] = useState(false);
  const { data: storeData, setTaxRate: setStoreTaxRate } = useFinancialStore();
  const { saveForecast } = useForecastDatabase();

  const updateCell = (rowName: string, month: number, value: number) => {
    const key = `${rowName}-${month}`;
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Update tax rate in store when it changes
  useEffect(() => {
    setStoreTaxRate(taxRate);
  }, [taxRate, setStoreTaxRate]);

  // Load data from store when component mounts
  useEffect(() => {
    const loadDataFromStore = () => {
      const loadedData: CellData = {};

      // Map store data to simple format
      storeData.categories.forEach((category) => {
        category.subcategories.forEach((subcategory) => {
          subcategory.rows.forEach((row) => {
            row.values.forEach((value) => {
              if (value.value !== 0) {
                const key = `${row.name}-${value.month}`;
                loadedData[key] = value.value;
              }
            });
          });
        });
      });

      setData(loadedData);
      setTaxRate(storeData.taxRate);
    };

    loadDataFromStore();
  }, [storeData, setStoreTaxRate]);

  const saveToDatabase = async () => {
    if (!forecastId) {
      toast.error("No forecast ID provided");
      return;
    }

    setSaving(true);
    try {
      // Map simple P&L data back to financial store structure
      const updatedStoreData = { ...storeData };

      // Create a mapping of row names to their store equivalents
      const rowMapping: {
        [key: string]: { category: string; subcategory: string; row: string };
      } = {};

      // Build mapping from P&L structure
      plStructure.forEach((section, sectionIdx) => {
        section.items.forEach((item) => {
          // Map to appropriate category based on section
          let categoryType = "";
          switch (sectionIdx) {
            case 0:
              categoryType = "sales_revenue";
              break;
            case 1:
              categoryType = "cogs";
              break;
            case 2:
              categoryType = "operating_expenses";
              break;
            case 3:
              categoryType = "other_income";
              break;
            case 4:
              categoryType = "other_expenses";
              break;
            default:
              categoryType = "sales_revenue";
          }

          rowMapping[item] = {
            category: categoryType,
            subcategory: "default",
            row: item,
          };
        });
      });

      // Update the store data with simple P&L values
      Object.entries(data).forEach(([key, value]) => {
        const [rowName, monthStr] = key.split("-");
        const month = parseInt(monthStr);
        const year = 2024; // Default to current year

        if (rowMapping[rowName] && value !== 0) {
          // Find or create the appropriate category/subcategory/row
          const mapping = rowMapping[rowName];

          // Find the category
          const category = updatedStoreData.categories.find(
            (c) => c.type === mapping.category
          );
          if (!category) {
            // Category doesn't exist, skip for now
            return;
          }

          // Find or create subcategory
          let subcategory = category.subcategories.find(
            (s) => s.name === "General" || s.name === "Default"
          );
          if (!subcategory && category.subcategories.length > 0) {
            subcategory = category.subcategories[0]; // Use first subcategory
          }
          if (!subcategory) {
            return;
          }

          // Find or create row
          let row = subcategory.rows.find((r) => r.name === rowName);
          if (!row && subcategory.rows.length > 0) {
            // Try to find a row that contains similar name or use first row
            row =
              subcategory.rows.find(
                (r) =>
                  r.name.toLowerCase().includes(rowName.toLowerCase()) ||
                  rowName.toLowerCase().includes(r.name.toLowerCase())
              ) || subcategory.rows[0];
          }
          if (!row) {
            return;
          }

          // Update or create the value
          const existingValueIndex = row.values.findIndex(
            (v) => v.year === year && v.month === month
          );
          const newValue = {
            value,
            year,
            month,
            date: new Date(year, month - 1, 1).toISOString().split("T")[0],
            isProjected: true,
          };

          if (existingValueIndex >= 0) {
            row.values[existingValueIndex] = newValue;
          } else {
            row.values.push(newValue);
          }
        }
      });

      // Update tax rate
      updatedStoreData.taxRate = taxRate;
      updatedStoreData.lastUpdated = new Date().toISOString();

      // Save to database
      await saveForecast(forecastId, updatedStoreData);

      toast.success("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const getCellValue = (rowName: string, month: number): number => {
    const key = `${rowName}-${month}`;
    return data[key] || 0;
  };

  const getSectionTotal = (sectionItems: string[], month: number): number => {
    return sectionItems.reduce(
      (sum, item) => sum + getCellValue(item, month),
      0
    );
  };

  const getIncome = (month: number) =>
    getSectionTotal(plStructure[0].items, month);
  const getCOGS = (month: number) =>
    getSectionTotal(plStructure[1].items, month);
  const getOpex = (month: number) =>
    getSectionTotal(plStructure[2].items, month);
  const getOtherIncome = (month: number) =>
    getSectionTotal(plStructure[3].items, month);
  const getOtherExpenses = (month: number) =>
    getSectionTotal(plStructure[4].items, month);

  const getGrossProfit = (month: number) => getIncome(month) - getCOGS(month);
  const getOperatingProfit = (month: number) =>
    getGrossProfit(month) - getOpex(month);
  const getNetProfitBeforeTax = (month: number) =>
    getOperatingProfit(month) + getOtherIncome(month) - getOtherExpenses(month);
  const getIncomeTax = (month: number) => {
    const netProfitBeforeTax = getNetProfitBeforeTax(month);
    return netProfitBeforeTax > 0 ? netProfitBeforeTax * taxRate : 0;
  };
  const getNetProfitAfterTax = (month: number) =>
    getNetProfitBeforeTax(month) - getIncomeTax(month);

  const formatNumber = (num: number): string => {
    if (num === 0) return "";
    return num.toLocaleString();
  };

  const plStructure = [
    {
      section: "1. Income",
      items: [
        "Service Revenue",
        "Commissions",
        "Rental Income",
        "Other Operating Revenue",
      ],
    },
    {
      section: "2. Cost of Goods Sold (COGS)",
      items: [
        "Raw Materials",
        "Packaging",
        "Direct Labour",
        "Other Direct Costs",
      ],
    },
    {
      section: "3. Operating Expenses",
      items: [
        "Accounting",
        "Bank fees",
        "Cleaning",
        "Freight and postage",
        "Insurance",
        "Interest",
        "Marketing and advertising",
        "Motor vehicle expenses",
        "Power",
        "Rent",
        "Repairs and maintenance",
        "Salaries and employee expenses",
        "Stationery",
        "Subscriptions",
        "Tax",
        "Telephone & Internet",
        "Uniforms",
        "Website hosting and maintenance",
        "Other",
      ],
    },
    {
      section: "4. Other Income",
      items: [
        "Interest Income",
        "Dividend Income",
        "Foreign Exchange Gain",
        "Gain on Sale of Assets",
        "Government Grants / Rebates",
        "Miscellaneous other Income",
      ],
    },
    {
      section: "5. Other Expenses",
      items: [
        "Interest Expense",
        "Foreign Exchange Loss",
        "Loss on Sale of Assets",
        "Bad Debts Written Off",
        "Miscellaneous other Expenses",
      ],
    },
  ];

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">P&L Monthly Input</CardTitle>
          <Button
            onClick={saveToDatabase}
            size="sm"
            className="ml-4"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save to Database"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-1 border text-xs font-semibold w-32">
                  Item
                </th>
                {months.map((month) => (
                  <th
                    key={month}
                    className="text-right p-1 border text-xs font-semibold min-w-[80px]"
                  >
                    {month}
                  </th>
                ))}
                <th className="text-right p-1 border text-xs font-semibold min-w-[80px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {plStructure.map((section, sectionIdx) => (
                <React.Fragment
                  key={`section-${section.section}-${sectionIdx}`}
                >
                  {/* Section Header */}
                  <tr key={`section-${sectionIdx}`} className="bg-primary/10">
                    <td
                      className="p-1 border text-xs font-bold text-primary"
                      colSpan={14}
                    >
                      {section.section}
                    </td>
                  </tr>

                  {/* Section Items */}
                  {section.items.map((item) => (
                    <tr
                      key={`${section.section}-${item}`}
                      className="hover:bg-muted/20"
                    >
                      <td className="p-1 border text-xs font-medium truncate pl-4">
                        {item}
                      </td>
                      {months.map((month, monthIdx) => {
                        const value = getCellValue(item, monthIdx + 1);
                        return (
                          <td
                            key={`${item}-month-${monthIdx}`}
                            className="p-0 border"
                          >
                            <Input
                              type="text"
                              className="w-full text-right border-0 focus:ring-1 h-7 text-xs px-1"
                              value={formatNumber(value)}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/,/g, "");
                                const num = parseFloat(raw) || 0;
                                updateCell(item, monthIdx + 1, num);
                              }}
                            />
                          </td>
                        );
                      })}
                      <td className="p-1 border text-right font-medium text-xs bg-muted/20">
                        {formatNumber(
                          months.reduce(
                            (sum, _, idx) => sum + getCellValue(item, idx + 1),
                            0
                          )
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Section Total */}
                  <tr className="bg-muted/40 font-semibold">
                    <td className="p-1 border text-xs font-bold">
                      Total {section.section}
                    </td>
                    {months.map((month, monthIdx) => (
                      <td
                        key={`total-${section.section}-${monthIdx}`}
                        className="p-1 border text-right text-xs font-bold"
                      >
                        {formatNumber(
                          getSectionTotal(section.items, monthIdx + 1)
                        )}
                      </td>
                    ))}
                    <td className="p-1 border text-right text-xs font-bold bg-muted/50">
                      {formatNumber(
                        months.reduce(
                          (sum, _, idx) =>
                            sum + getSectionTotal(section.items, idx + 1),
                          0
                        )
                      )}
                    </td>
                  </tr>

                  {/* Add calculated lines after specific sections */}
                  {sectionIdx === 1 && (
                    <tr className="bg-green-50 font-bold border-t-2 border-green-200">
                      <td className="p-1 border text-xs font-bold text-green-700">
                        Gross Profit = Income − COGS
                      </td>
                      {months.map((month, monthIdx) => (
                        <td
                          key={`gross-profit-${monthIdx}`}
                          className="p-1 border text-right text-xs font-bold text-green-700"
                        >
                          {formatNumber(getGrossProfit(monthIdx + 1))}
                        </td>
                      ))}
                      <td className="p-1 border text-right text-xs font-bold text-green-700 bg-green-100">
                        {formatNumber(
                          months.reduce(
                            (sum, _, idx) => sum + getGrossProfit(idx + 1),
                            0
                          )
                        )}
                      </td>
                    </tr>
                  )}

                  {sectionIdx === 2 && (
                    <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
                      <td className="p-1 border text-xs font-bold text-blue-700">
                        Operating Profit (EBIT) = Gross Profit − Operating
                        Expenses
                      </td>
                      {months.map((month, monthIdx) => (
                        <td
                          key={`operating-profit-${monthIdx}`}
                          className="p-1 border text-right text-xs font-bold text-blue-700"
                        >
                          {formatNumber(getOperatingProfit(monthIdx + 1))}
                        </td>
                      ))}
                      <td className="p-1 border text-right text-xs font-bold text-blue-700 bg-blue-100">
                        {formatNumber(
                          months.reduce(
                            (sum, _, idx) => sum + getOperatingProfit(idx + 1),
                            0
                          )
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

              {/* Net Profit Before Tax */}
              <tr className="bg-orange-50 font-bold border-t-2 border-orange-200">
                <td className="p-1 border text-xs font-bold text-orange-700">
                  Net Profit Before Tax = Operating Profit + Other Income −
                  Other Expenses
                </td>
                {months.map((month, monthIdx) => (
                  <td
                    key={`net-before-tax-${monthIdx}`}
                    className="p-1 border text-right text-xs font-bold text-orange-700"
                  >
                    {formatNumber(getNetProfitBeforeTax(monthIdx + 1))}
                  </td>
                ))}
                <td className="p-1 border text-right text-xs font-bold text-orange-700 bg-orange-100">
                  {formatNumber(
                    months.reduce(
                      (sum, _, idx) => sum + getNetProfitBeforeTax(idx + 1),
                      0
                    )
                  )}
                </td>
              </tr>

              {/* Tax Rate Setting */}
              <tr className="bg-yellow-50 border-t-2 border-yellow-200">
                <td className="p-1 border text-xs font-medium text-yellow-700">
                  Tax Rate:
                  <Input
                    type="number"
                    className="inline-block w-16 ml-2 text-center border h-6 text-xs"
                    value={Math.round(taxRate * 100)}
                    onChange={(e) => {
                      const percent = parseFloat(e.target.value) || 0;
                      setTaxRate(percent / 100);
                    }}
                    min="0"
                    max="100"
                  />
                  %
                </td>
                <td colSpan={13} className="p-1 border text-xs text-yellow-600">
                  Income Tax = Net Profit Before Tax × Tax Rate (if profit &gt;
                  0)
                </td>
              </tr>

              {/* Income Tax Expense - Calculated */}
              <tr className="bg-yellow-100 font-semibold">
                <td className="p-1 border text-xs font-bold text-yellow-800">
                  Income Tax Expense (Calculated)
                </td>
                {months.map((month, monthIdx) => (
                  <td
                    key={`income-tax-${monthIdx}`}
                    className="p-1 border text-right text-xs font-bold text-yellow-800"
                  >
                    {formatNumber(getIncomeTax(monthIdx + 1))}
                  </td>
                ))}
                <td className="p-1 border text-right text-xs font-bold text-yellow-800 bg-yellow-200">
                  {formatNumber(
                    months.reduce(
                      (sum, _, idx) => sum + getIncomeTax(idx + 1),
                      0
                    )
                  )}
                </td>
              </tr>

              {/* Net Profit After Tax */}
              <tr className="bg-green-100 font-bold border-t-4 border-green-400">
                <td className="p-1 border text-xs font-bold text-green-800">
                  Net Profit After Tax
                </td>
                {months.map((month, monthIdx) => (
                  <td
                    key={`net-after-tax-${monthIdx}`}
                    className="p-1 border text-right text-xs font-bold text-green-800"
                  >
                    {formatNumber(getNetProfitAfterTax(monthIdx + 1))}
                  </td>
                ))}
                <td className="p-1 border text-right text-xs font-bold text-green-800 bg-green-200">
                  {formatNumber(
                    months.reduce(
                      (sum, _, idx) => sum + getNetProfitAfterTax(idx + 1),
                      0
                    )
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
