"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Database,
  DollarSign,
  Percent,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useMemo, useState } from "react";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UITooltip,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

// KPI Card Component with improved mobile design
function KPICard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color = "blue",
  subtitle,
  onClick,
  tooltip,
}: {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ className?: string }>;
  color?: "blue" | "green" | "red" | "orange" | "purple";
  subtitle?: string;
  onClick?: () => void;
  tooltip?: {
    title: string;
    description: string;
    formula: string;
    pnlData: Array<{ category: string; amount: string }>;
  };
}) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    orange: "text-orange-600 bg-orange-50",
    purple: "text-purple-600 bg-purple-50",
  };

  const ChangeIcon =
    changeType === "positive"
      ? ArrowUp
      : changeType === "negative"
      ? ArrowDown
      : null;
  const changeColor =
    changeType === "positive"
      ? "text-green-600"
      : changeType === "negative"
      ? "text-red-600"
      : "text-gray-600";

  const cardContent = (
    <Card
      className={`transition-all hover:shadow-md relative ${
        onClick ? "cursor-pointer" : ""
      } ${tooltip ? "cursor-help hover:shadow-lg hover:scale-[1.02]" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
              {title}
            </p>
            <p className="text-lg sm:text-2xl font-bold truncate" title={value}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">
                {subtitle}
              </p>
            )}
            {change && (
              <div
                className={`flex items-center space-x-1 text-xs sm:text-sm ${changeColor} mt-1`}
              >
                {ChangeIcon && (
                  <ChangeIcon className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                )}
                <span className="truncate">{change}</span>
              </div>
            )}
          </div>
          <div
            className={`rounded-full p-2 sm:p-3 ${colorClasses[color]} shrink-0`}
          >
            <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
        </div>
        {tooltip && (
          <div className="absolute top-2 right-2">
            <div className="w-4 h-4 bg-red-500 rounded-full opacity-90 animate-pulse flex items-center justify-center">
              <span className="text-white text-xs font-bold">?</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (tooltip) {
    return (
      <UITooltip delayDuration={200}>
        <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
        <TooltipContent
          className="max-w-sm p-4 bg-white dark:bg-gray-900 border-2 border-blue-300 dark:border-blue-700 shadow-xl z-50"
          side="top"
          sideOffset={10}
          align="center"
        >
          <div className="space-y-3">
            <div>
              <p className="font-bold text-base text-blue-600 dark:text-blue-400">
                {tooltip.title}
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                {tooltip.description}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Formula:
              </p>
              <p className="text-xs font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-2 rounded border border-blue-200 dark:border-blue-800">
                {tooltip.formula}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Calculation Breakdown:
              </p>
              <div className="text-xs space-y-1 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                {tooltip.pnlData.map((item) => (
                  <div
                    key={`${item.category}-${item.amount}`}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {item.category}:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TooltipContent>
      </UITooltip>
    );
  }

  return cardContent;
}

// Gauge Chart Component
function GaugeChart({
  value,
  max,
  title,
  color = "#3b82f6",
}: {
  value: number;
  max: number;
  title: string;
  color?: string;
}) {
  // Add validation to prevent NaN values
  const safeValue = isNaN(value) || !isFinite(value) ? 0 : Math.max(0, value);
  const safeMax = isNaN(max) || !isFinite(max) || max <= 0 ? 1 : max;

  const percentage = Math.min((safeValue / safeMax) * 100, 100);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;

  // Ensure strokeDashoffset is never NaN
  const strokeDashoffset = Number.isFinite(percentage)
    ? circumference - (percentage / 100) * circumference
    : circumference;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={color}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{percentage.toFixed(1)}%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {new Intl.NumberFormat("en-AU", {
            style: "currency",
            currency: "AUD",
            minimumFractionDigits: 0,
          }).format(safeValue)}{" "}
          /{" "}
          {new Intl.NumberFormat("en-AU", {
            style: "currency",
            currency: "AUD",
            minimumFractionDigits: 0,
          }).format(safeMax)}
        </p>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const {
    data,
    getCategoryYearlyTotalByType,
    forceLoadSampleData,
    setTargetIncome,
  } = useFinancialStore();

  // Year selection state
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [comparisonYear, setComparisonYear] = useState(
    new Date().getFullYear() - 1
  );

  // Get available years from the data
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    data.categories.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        subcategory.rows.forEach((row) => {
          row.values.forEach((value) => {
            years.add(value.year);
          });
        });
      });
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending
  }, [data]);

  // If no years found, use current year and previous year
  const defaultYears = [new Date().getFullYear(), new Date().getFullYear() - 1];
  const yearsToUse = availableYears.length > 0 ? availableYears : defaultYears;

  // Enhanced calculations using the new store methods
  const financialMetrics = useMemo(() => {
    // Real-time calculations from actual data for selected year
    const revenue = getCategoryYearlyTotalByType("sales_revenue", selectedYear);
    const cogs = Math.abs(getCategoryYearlyTotalByType("cogs", selectedYear));
    const grossProfit = revenue - cogs;
    const operatingExpenses = Math.abs(
      getCategoryYearlyTotalByType("operating_expenses", selectedYear)
    );
    const operatingProfit = grossProfit - operatingExpenses;
    const otherIncome = getCategoryYearlyTotalByType(
      "other_income",
      selectedYear
    );
    const financialExpenses = Math.abs(
      getCategoryYearlyTotalByType("financial_expenses", selectedYear)
    );
    const otherExpenses = Math.abs(
      getCategoryYearlyTotalByType("other_expenses", selectedYear)
    );

    // Get Net Profit Before Tax using the proper category calculation
    const netProfitBeforeTax =
      operatingProfit + otherIncome - financialExpenses - otherExpenses;

    // Calculate tax expense based on net profit before tax and tax rate
    const taxExpense =
      netProfitBeforeTax > 0
        ? netProfitBeforeTax * ((data.taxRate || 25) / 100)
        : 0;

    // Calculate Net Profit After Tax
    const netProfitAfterTax = netProfitBeforeTax - taxExpense;

    // Calculate margins with safety checks
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const operatingMargin = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
    const netMargin = revenue > 0 ? (netProfitAfterTax / revenue) * 100 : 0;

    // Enhanced KPIs
    const revenuePerMonth = revenue / 12;
    const expenseRatio =
      revenue > 0 ? ((cogs + operatingExpenses) / revenue) * 100 : 0;
    const profitabilityRank =
      grossMargin > 50
        ? "Excellent"
        : grossMargin > 30
        ? "Good"
        : grossMargin > 20
        ? "Fair"
        : "Poor";

    // Break-even analysis
    const fixedCosts = operatingExpenses;
    const variableCostRatio = revenue > 0 ? cogs / revenue : 0;
    const contributionMargin = 1 - variableCostRatio;
    const breakEvenRevenue =
      contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
    const breakEvenMonths =
      revenuePerMonth > 0 ? breakEvenRevenue / revenuePerMonth : 0;

    return {
      revenue,
      cogs,
      grossProfit,
      operatingExpenses,
      operatingProfit,
      netProfitBeforeTax,
      netProfitAfterTax,
      grossMargin,
      operatingMargin,
      netMargin,
      revenuePerMonth,
      expenseRatio,
      profitabilityRank,
      breakEvenRevenue,
      breakEvenMonths,
      taxExpense,
      otherIncome,
      financialExpenses,
    };
  }, [data, getCategoryYearlyTotalByType, selectedYear]);

  // Comparison metrics for year-over-year analysis
  const comparisonMetrics = useMemo(() => {
    if (selectedYear === comparisonYear) {
      return {
        revenueChange: 0,
        grossProfitChange: 0,
        operatingProfitChange: 0,
        netProfitChange: 0,
        revenueChangePercent: 0,
        grossProfitChangePercent: 0,
        operatingProfitChangePercent: 0,
        netProfitChangePercent: 0,
      };
    }

    const prevRevenue = getCategoryYearlyTotalByType("sales_revenue", comparisonYear);
    const prevCogs = Math.abs(
      getCategoryYearlyTotalByType("cogs", comparisonYear)
    );
    const prevGrossProfit = prevRevenue - prevCogs;
    const prevOperatingExpenses = Math.abs(
      getCategoryYearlyTotalByType("operating_expenses", comparisonYear)
    );
    const prevOperatingProfit = prevGrossProfit - prevOperatingExpenses;
    const prevOtherIncome = getCategoryYearlyTotalByType(
      "other_income",
      comparisonYear
    );
    const prevFinancialExpenses = Math.abs(
      getCategoryYearlyTotalByType("financial_expenses", comparisonYear)
    );
    const prevOtherExpenses = Math.abs(
      getCategoryYearlyTotalByType("other_expenses", comparisonYear)
    );
    const prevNetProfitBeforeTax =
      prevOperatingProfit +
      prevOtherIncome -
      prevFinancialExpenses -
      prevOtherExpenses;
    const prevTaxExpense =
      prevNetProfitBeforeTax > 0
        ? prevNetProfitBeforeTax * ((data.taxRate || 25) / 100)
        : 0;
    const prevNetProfitAfterTax = prevNetProfitBeforeTax - prevTaxExpense;

    const revenueChange = financialMetrics.revenue - prevRevenue;
    const grossProfitChange = financialMetrics.grossProfit - prevGrossProfit;
    const operatingProfitChange =
      financialMetrics.operatingProfit - prevOperatingProfit;
    const netProfitChange =
      financialMetrics.netProfitAfterTax - prevNetProfitAfterTax;

    const revenueChangePercent =
      prevRevenue > 0 ? (revenueChange / prevRevenue) * 100 : 0;
    const grossProfitChangePercent =
      prevGrossProfit > 0 ? (grossProfitChange / prevGrossProfit) * 100 : 0;
    const operatingProfitChangePercent =
      prevOperatingProfit > 0
        ? (operatingProfitChange / prevOperatingProfit) * 100
        : 0;
    const netProfitChangePercent =
      prevNetProfitAfterTax > 0
        ? (netProfitChange / prevNetProfitAfterTax) * 100
        : 0;

    return {
      revenueChange,
      grossProfitChange,
      operatingProfitChange,
      netProfitChange,
      revenueChangePercent,
      grossProfitChangePercent,
      operatingProfitChangePercent,
      netProfitChangePercent,
    };
  }, [
    data,
    getCategoryYearlyTotalByType,
    selectedYear,
    comparisonYear,
    financialMetrics,
  ]);

  // Check if data is empty to show load sample data option
  const isEmpty = data.categories.every(
    (cat) =>
      cat.isCalculated ||
      cat.subcategories.every((sub) =>
        sub.rows.every((row) => row.values.every((val) => val.value === 0))
      )
  );

  // Monthly data for charts with enhanced calculations
  const monthlyData = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const monthName = new Date(selectedYear, index).toLocaleString("default", { month: "short" });

      let monthlyRevenue = 0;
      let monthlyCOGS = 0;
      let monthlyOpEx = 0;
      let monthlyOtherIncome = 0;
      let monthlyFinancialExpenses = 0;
      let monthlyOtherExpenses = 0;

      data.categories.forEach((category) => {
        category.subcategories.forEach((subcategory) => {
          subcategory.rows.forEach((row) => {
            const monthValue = row.values.find(
              (v) => v.month === month && v.year === selectedYear
            );
            if (monthValue) {
              switch (category.type) {
                case "sales_revenue":
                  monthlyRevenue += monthValue.value;
                  break;
                case "cogs":
                  monthlyCOGS += Math.abs(monthValue.value);
                  break;
                case "operating_expenses":
                  monthlyOpEx += Math.abs(monthValue.value);
                  break;
                case "other_income":
                  monthlyOtherIncome += monthValue.value;
                  break;
                case "financial_expenses":
                  monthlyFinancialExpenses += Math.abs(monthValue.value);
                  break;
                case "other_expenses":
                  monthlyOtherExpenses += Math.abs(monthValue.value);
                  break;
              }
            }
          });
        });
      });

      const monthlyGrossProfit = monthlyRevenue - monthlyCOGS;
      const monthlyOperatingProfit = monthlyGrossProfit - monthlyOpEx;
      const monthlyNetProfitBeforeTax =
        monthlyOperatingProfit +
        monthlyOtherIncome -
        monthlyFinancialExpenses -
        monthlyOtherExpenses;
      const monthlyTaxExpense =
        monthlyNetProfitBeforeTax > 0
          ? monthlyNetProfitBeforeTax * ((data.taxRate || 25) / 100)
          : 0;
      const monthlyNetProfitAfterTax =
        monthlyNetProfitBeforeTax - monthlyTaxExpense;

      return {
        month: monthName,
        revenue: monthlyRevenue,
        cogs: monthlyCOGS,
        grossProfit: monthlyGrossProfit,
        operatingExpenses: monthlyOpEx,
        operatingProfit: monthlyOperatingProfit,
        netProfit: monthlyNetProfitAfterTax,
        grossMargin:
          monthlyRevenue > 0 ? (monthlyGrossProfit / monthlyRevenue) * 100 : 0,
        operatingMargin:
          monthlyRevenue > 0
            ? (monthlyOperatingProfit / monthlyRevenue) * 100
            : 0,
      };
    });
  }, [data, selectedYear]);

  // Expense breakdown with real data
  const expenseData = useMemo(() => {
    return [
      { name: "COGS", value: financialMetrics.cogs, color: "#ef4444" },
      {
        name: "Operating",
        value: financialMetrics.operatingExpenses,
        color: "#f97316",
      },
      {
        name: "Financial",
        value: financialMetrics.financialExpenses,
        color: "#eab308",
      },
      { name: "Tax", value: financialMetrics.taxExpense, color: "#84cc16" },
    ].filter((item) => item.value > 0);
  }, [financialMetrics]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6">
        {/* Header with Data Management */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              Financial Dashboard
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time insights from your financial data
            </p>
          </div>
          <div className="flex gap-2">
            {isEmpty && (
              <Button
                onClick={forceLoadSampleData}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Load Sample Data</span>
              </Button>
            )}
          </div>
        </div>

        {/* Year Selection Controls */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <Label className="text-sm font-medium">Year Selection</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose the year to display and compare data
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Currently displaying data for: <strong>{selectedYear}</strong>
                </p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="selected-year"
                    className="text-xs text-muted-foreground"
                  >
                    Display Year
                  </Label>
                  <select
                    id="selected-year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {yearsToUse.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="comparison-year"
                    className="text-xs text-muted-foreground"
                  >
                    Compare With
                  </Label>
                  <select
                    id="comparison-year"
                    value={comparisonYear}
                    onChange={(e) => setComparisonYear(Number(e.target.value))}
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {yearsToUse.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Income Input */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="target-income" className="text-sm font-medium">
                  Target Income for {selectedYear}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Set your revenue target to track progress in the Target gauge
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input
                  id="target-income"
                  type="number"
                  placeholder="Enter target income"
                  value={data.targetIncome || ""}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setTargetIncome(value);
                  }}
                  className="w-full sm:w-48"
                />
                <Button
                  onClick={() => {
                    const suggestedTarget = financialMetrics.revenue * 1.2;
                    setTargetIncome(Math.round(suggestedTarget));
                  }}
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Suggest 20%
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main KPI Cards - Enhanced for mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KPICard
            title="Total Revenue"
            value={formatCurrency(financialMetrics.revenue)}
            change={
              selectedYear !== comparisonYear
                ? `${
                    comparisonMetrics.revenueChangePercent >= 0 ? "+" : ""
                  }${formatPercent(
                    comparisonMetrics.revenueChangePercent
                  )} vs ${comparisonYear}`
                : `${formatCurrency(
                    financialMetrics.revenuePerMonth
                  )}/month avg`
            }
            changeType={
              selectedYear !== comparisonYear
                ? comparisonMetrics.revenueChangePercent >= 0
                  ? "positive"
                  : "negative"
                : "positive"
            }
            icon={DollarSign}
            color="green"
            subtitle={`${formatPercent(
              financialMetrics.grossMargin
            )} gross margin`}
            tooltip={{
              title: "Total Revenue",
              description:
                "Displayed value reflects Sales Revenue from P&L. Total Revenue equals Sales Revenue + Other Income.",
              formula: "Total Revenue = Sales Revenue + Other Income",
              pnlData: [
                {
                  category: "Sales Revenue",
                  amount: formatCurrency(financialMetrics.revenue),
                },
                {
                  category: "Other Income",
                  amount: formatCurrency(financialMetrics.otherIncome),
                },
              ],
            }}
          />
          <KPICard
            title="Gross Profit"
            value={formatCurrency(financialMetrics.grossProfit)}
            change={
              selectedYear !== comparisonYear
                ? `${
                    comparisonMetrics.grossProfitChangePercent >= 0 ? "+" : ""
                  }${formatPercent(
                    comparisonMetrics.grossProfitChangePercent
                  )} vs ${comparisonYear}`
                : financialMetrics.profitabilityRank
            }
            changeType={
              selectedYear !== comparisonYear
                ? comparisonMetrics.grossProfitChangePercent >= 0
                  ? "positive"
                  : "negative"
                : financialMetrics.grossMargin > 40
                ? "positive"
                : financialMetrics.grossMargin > 20
                ? "neutral"
                : "negative"
            }
            icon={TrendingUp}
            color="blue"
            subtitle={formatPercent(financialMetrics.grossMargin)}
            tooltip={{
              title: "Gross Profit",
              description:
                "The profit remaining after deducting the cost of goods sold (COGS) from revenue. This represents your basic profitability before operating expenses.",
              formula: "Gross Profit = Revenue - Cost of Goods Sold",
              pnlData: [
                {
                  category: "Revenue",
                  amount: formatCurrency(financialMetrics.revenue),
                },
                {
                  category: "Cost of Goods Sold",
                  amount: formatCurrency(financialMetrics.cogs),
                },
                {
                  category: "Gross Profit",
                  amount: formatCurrency(financialMetrics.grossProfit),
                },
              ],
            }}
          />
          <KPICard
            title="Operating Profit"
            value={formatCurrency(financialMetrics.operatingProfit)}
            change={
              selectedYear !== comparisonYear
                ? `${
                    comparisonMetrics.operatingProfitChangePercent >= 0
                      ? "+"
                      : ""
                  }${formatPercent(
                    comparisonMetrics.operatingProfitChangePercent
                  )} vs ${comparisonYear}`
                : formatPercent(financialMetrics.operatingMargin)
            }
            changeType={
              selectedYear !== comparisonYear
                ? comparisonMetrics.operatingProfitChangePercent >= 0
                  ? "positive"
                  : "negative"
                : financialMetrics.operatingMargin > 15
                ? "positive"
                : financialMetrics.operatingMargin > 5
                ? "neutral"
                : "negative"
            }
            icon={Target}
            color="purple"
            subtitle="Operating margin"
            tooltip={{
              title: "Operating Profit",
              description:
                "The profit remaining after deducting all operating expenses from gross profit. This shows how efficiently your business operates.",
              formula: "Operating Profit = Gross Profit - Operating Expenses",
              pnlData: [
                {
                  category: "Gross Profit",
                  amount: formatCurrency(financialMetrics.grossProfit),
                },
                {
                  category: "Operating Expenses",
                  amount: formatCurrency(financialMetrics.operatingExpenses),
                },
                {
                  category: "Operating Profit",
                  amount: formatCurrency(financialMetrics.operatingProfit),
                },
              ],
            }}
          />
          <KPICard
            title="Net Profit"
            value={formatCurrency(financialMetrics.netProfitAfterTax)}
            change={
              selectedYear !== comparisonYear
                ? `${
                    comparisonMetrics.netProfitChangePercent >= 0 ? "+" : ""
                  }${formatPercent(
                    comparisonMetrics.netProfitChangePercent
                  )} vs ${comparisonYear}`
                : formatPercent(financialMetrics.netMargin)
            }
            changeType={
              selectedYear !== comparisonYear
                ? comparisonMetrics.netProfitChangePercent >= 0
                  ? "positive"
                  : "negative"
                : financialMetrics.netMargin > 10
                ? "positive"
                : financialMetrics.netMargin > 0
                ? "neutral"
                : "negative"
            }
            icon={Percent}
            color={
              financialMetrics.netMargin > 10
                ? "green"
                : financialMetrics.netMargin > 0
                ? "blue"
                : "red"
            }
            subtitle="After tax"
            tooltip={{
              title: "Net Profit After Tax",
              description:
                "The final profit after deducting all expenses including taxes. This is your actual bottom-line profit available for reinvestment or distribution.",
              formula:
                "Net Profit After Tax = Operating Profit + Other Income − Financial Expenses − Other Expenses − Tax Expense",
              pnlData: [
                {
                  category: "Operating Profit",
                  amount: formatCurrency(financialMetrics.operatingProfit),
                },
                {
                  category: "Other Income",
                  amount: formatCurrency(financialMetrics.otherIncome),
                },
                {
                  category: "Financial Expenses",
                  amount: formatCurrency(financialMetrics.financialExpenses),
                },
                {
                  category: "Tax Expense",
                  amount: formatCurrency(financialMetrics.taxExpense),
                },
                {
                  category: "Net Profit After Tax",
                  amount: formatCurrency(financialMetrics.netProfitAfterTax),
                },
              ],
            }}
          />
        </div>

        {/* Secondary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <KPICard
            title="Total Expenses"
            value={formatCurrency(
              financialMetrics.cogs +
                financialMetrics.operatingExpenses +
                financialMetrics.financialExpenses +
                financialMetrics.taxExpense
            )}
            change={formatPercent(financialMetrics.expenseRatio)}
            changeType="neutral"
            icon={TrendingDown}
            color="red"
            subtitle="of revenue"
            tooltip={{
              title: "Total Expenses",
              description:
                "Your total expenses, including COGS, Operating Expenses, Financial Expenses, and Tax Expense.",
              formula:
                "Total Expenses = COGS + Operating Expenses + Financial Expenses + Tax Expense",
              pnlData: [
                {
                  category: "COGS",
                  amount: formatCurrency(financialMetrics.cogs),
                },
                {
                  category: "Operating Expenses",
                  amount: formatCurrency(financialMetrics.operatingExpenses),
                },
                {
                  category: "Financial Expenses",
                  amount: formatCurrency(financialMetrics.financialExpenses),
                },
                {
                  category: "Tax Expense",
                  amount: formatCurrency(financialMetrics.taxExpense),
                },
              ],
            }}
          />
          <KPICard
            title="Break-even"
            value={formatCurrency(financialMetrics.breakEvenRevenue)}
            change={`${financialMetrics.breakEvenMonths.toFixed(
              1
            )} months at current rate`}
            changeType="neutral"
            icon={Target}
            color="orange"
            subtitle="Monthly target"
            tooltip={{
              title: "Break-even Point",
              description:
                "The revenue needed to cover all fixed costs. This is calculated by dividing Fixed Costs by Contribution Margin.",
              formula: "Break-even Revenue = Fixed Costs / Contribution Margin",
              pnlData: [
                {
                  category: "Fixed Costs",
                  amount: formatCurrency(financialMetrics.operatingExpenses),
                },
                {
                  category: "Contribution Margin",
                  amount: formatPercent(
                    (1 - financialMetrics.cogs / financialMetrics.revenue) * 100
                  ),
                },
              ],
            }}
          />
          <KPICard
            title="Tax Expense"
            value={formatCurrency(financialMetrics.taxExpense)}
            change={`${data.taxRate || 25}% rate`}
            changeType="neutral"
            icon={Percent}
            color="blue"
            subtitle={`${formatPercent(
              financialMetrics.netProfitBeforeTax > 0
                ? (financialMetrics.taxExpense /
                    financialMetrics.netProfitBeforeTax) *
                    100
                : 0
            )} of profit`}
            tooltip={{
              title: "Tax Expense",
              description:
                "The amount of tax you owe based on your Net Profit Before Tax.",
              formula: "Tax Expense = Net Profit Before Tax * Tax Rate",
              pnlData: [
                {
                  category: "Net Profit Before Tax",
                  amount: formatCurrency(financialMetrics.netProfitBeforeTax),
                },
                {
                  category: "Tax Rate",
                  amount: `${data.taxRate || 25}%`,
                },
                {
                  category: "Tax Expense",
                  amount: formatCurrency(financialMetrics.taxExpense),
                },
              ],
            }}
          />
          <KPICard
            title="Cash Flow"
            value={formatCurrency(financialMetrics.netProfitAfterTax)}
            change="Operating cash flow"
            changeType={
              financialMetrics.netProfitAfterTax > 0 ? "positive" : "negative"
            }
            icon={BarChart3}
            color="purple"
            subtitle="Net profit based"
            tooltip={{
              title: "Cash Flow",
              description:
                "Operating cash flow based on net profit after tax. This represents the cash generated from core business operations.",
              formula:
                "Cash Flow = Net Profit After Tax + Depreciation - Changes in Working Capital",
              pnlData: [
                {
                  category: "Net Profit After Tax",
                  amount: formatCurrency(financialMetrics.netProfitAfterTax),
                },
                {
                  category: "Depreciation (estimated)",
                  amount: formatCurrency(
                    Math.abs(
                      getCategoryYearlyTotalByType("operating_expenses", selectedYear) * 0.1
                    )
                  ),
                },
              ],
            }}
          />
        </div>

        {/* Charts Row - Enhanced for mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">
                Monthly Revenue & Profit Trend ({selectedYear})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyData}>
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name,
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                      fontSize: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                    cursor={{ fill: "rgba(245, 158, 11, 0.1)" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="grossProfit"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Gross Profit"
                  />
                  <Area
                    type="monotone"
                    dataKey="operatingProfit"
                    stackId="3"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    name="Operating Profit"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                    }
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatCurrency(value),
                      name,
                    ]}
                    labelFormatter={(label) => `Expense Category: ${label}`}
                    contentStyle={{
                      fontSize: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                    cursor={{ fill: "rgba(239, 68, 68, 0.1)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Margin Analysis Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">
              Monthly Margin Analysis ({selectedYear})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={monthlyData}>
                <XAxis dataKey="month" fontSize={12} />
                <YAxis
                  domain={[0, 100]}
                  fontSize={12}
                  label={{
                    value: "Margin %",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: "12px" },
                  }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}%`,
                    name,
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    fontSize: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                  cursor={{ fill: "rgba(16, 185, 129, 0.1)" }}
                />
                <Area
                  type="monotone"
                  dataKey="grossMargin"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="Gross Margin %"
                />
                <Area
                  type="monotone"
                  dataKey="operatingMargin"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  name="Operating Margin %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Gauges - Enhanced for mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <UITooltip>
            <TooltipTrigger asChild>
              <div>
                <GaugeChart
                  value={Math.abs(financialMetrics.grossProfit)}
                  max={financialMetrics.revenue || 1}
                  title="Gross Profit"
                  color="#10b981"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-4 bg-white dark:bg-gray-900 border-2 border-green-300 dark:border-green-700 shadow-xl z-50">
              <div className="space-y-2">
                <p className="font-bold text-base text-green-600 dark:text-green-400">
                  Gross Profit Gauge
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  Shows gross profit as a percentage of total revenue. This
                  indicates your basic profitability before operating expenses.
                </p>
                <div className="text-xs space-y-1 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Gross Profit:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(financialMetrics.grossProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Total Revenue:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(financialMetrics.revenue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Percentage:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatPercent(financialMetrics.grossMargin)}
                    </span>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </UITooltip>

          <UITooltip>
            <TooltipTrigger asChild>
              <div>
                <GaugeChart
                  value={Math.abs(financialMetrics.operatingProfit)}
                  max={financialMetrics.revenue || 1}
                  title="Operating"
                  color="#3b82f6"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-4 bg-white dark:bg-gray-900 border-2 border-blue-300 dark:border-blue-700 shadow-xl z-50">
              <div className="space-y-2">
                <p className="font-bold text-base text-blue-600 dark:text-blue-400">
                  Operating Profit Gauge
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  Shows operating profit as a percentage of total revenue. This
                  indicates how efficiently your business operates after
                  covering operating expenses.
                </p>
                <div className="text-xs space-y-1 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Operating Profit:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(financialMetrics.operatingProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Total Revenue:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(financialMetrics.revenue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Percentage:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatPercent(financialMetrics.operatingMargin)}
                    </span>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </UITooltip>

          <UITooltip>
            <TooltipTrigger asChild>
              <div>
                <GaugeChart
                  value={Math.abs(financialMetrics.netProfitAfterTax)}
                  max={financialMetrics.revenue || 1}
                  title="Net Profit"
                  color="#8b5cf6"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-4 bg-white dark:bg-gray-900 border-2 border-purple-300 dark:border-purple-700 shadow-xl z-50">
              <div className="space-y-2">
                <p className="font-bold text-base text-purple-600 dark:text-purple-400">
                  Net Profit Gauge
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  Shows net profit after tax as a percentage of total revenue.
                  This represents your final bottom-line profitability.
                </p>
                <div className="text-xs space-y-1 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Net Profit After Tax:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(financialMetrics.netProfitAfterTax)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Total Revenue:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(financialMetrics.revenue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Percentage:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatPercent(financialMetrics.netMargin)}
                    </span>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </UITooltip>

          <UITooltip>
            <TooltipTrigger asChild>
              <div>
                <GaugeChart
                  value={
                    financialMetrics.revenue > 0 ? financialMetrics.revenue : 1
                  }
                  max={
                    data.targetIncome > 0
                      ? data.targetIncome
                      : financialMetrics.revenue || 100000
                  }
                  title="Target"
                  color="#f59e0b"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-4 bg-white dark:bg-gray-900 border-2 border-orange-300 dark:border-orange-700 shadow-xl z-50">
              <div className="space-y-2">
                <p className="font-bold text-base text-orange-600 dark:text-orange-400">
                  Revenue Target Gauge
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  Shows current revenue as a percentage of your target income.
                  This helps track progress toward your revenue goals.
                </p>
                <div className="text-xs space-y-1 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Current Revenue:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(financialMetrics.revenue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Target Income:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(data.targetIncome || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Progress:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {data.targetIncome > 0
                        ? `${(
                            (financialMetrics.revenue / data.targetIncome) *
                            100
                          ).toFixed(1)}%`
                        : "0%"}
                    </span>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </UITooltip>
        </div>

        {/* Comprehensive Monthly Performance Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base sm:text-lg">
              Comprehensive Monthly Performance ({selectedYear})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name,
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    fontSize: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                  cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  dataKey="revenue"
                  fill="#3b82f6"
                  name="Revenue"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="grossProfit"
                  fill="#10b981"
                  name="Gross Profit"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="operatingProfit"
                  fill="#8b5cf6"
                  name="Operating Profit"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="netProfit"
                  fill="#f59e0b"
                  name="Net Profit"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enhanced Financial Summary */}
        {!isEmpty && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">
                Financial Summary for {selectedYear}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground">
                    Revenue Metrics
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-medium">
                        {formatCurrency(financialMetrics.revenue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Avg:</span>
                      <span className="font-medium">
                        {formatCurrency(financialMetrics.revenuePerMonth)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profitability:</span>
                      <Badge variant="outline">
                        {financialMetrics.profitabilityRank}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground">
                    Margin Analysis
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Gross Margin:</span>
                      <span className="font-medium">
                        {formatPercent(financialMetrics.grossMargin)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Operating Margin:</span>
                      <span className="font-medium">
                        {formatPercent(financialMetrics.operatingMargin)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net Margin:</span>
                      <span className="font-medium">
                        {formatPercent(financialMetrics.netMargin)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground">
                    Cost Structure
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>COGS:</span>
                      <span className="font-medium">
                        {formatCurrency(financialMetrics.cogs)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>OpEx:</span>
                      <span className="font-medium">
                        {formatCurrency(financialMetrics.operatingExpenses)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expense Ratio:</span>
                      <span className="font-medium">
                        {formatPercent(financialMetrics.expenseRatio)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground">
                    Break-even
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>BE Revenue:</span>
                      <span className="font-medium">
                        {formatCurrency(financialMetrics.breakEvenRevenue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>BE Months:</span>
                      <span className="font-medium">
                        {financialMetrics.breakEvenMonths.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Rate:</span>
                      <span className="font-medium">{data.taxRate || 25}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
