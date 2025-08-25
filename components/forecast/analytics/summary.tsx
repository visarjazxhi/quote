"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  BarChart3,
  Calculator,
  CheckCircle,
  DollarSign,
  Info,
  Minus,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

export function Summary() {
  const { data, getCategoryYearlyTotalByType, getMonthlyData } =
    useFinancialStore();

  // Available years from Input Data
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    data.categories.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        subcategory.rows.forEach((row) => {
          row.values.forEach((value) => years.add(value.year));
        });
      });
    });
    const sorted = Array.from(years).sort((a, b) => b - a);
    return sorted.length > 0
      ? sorted
      : [new Date().getFullYear(), new Date().getFullYear() - 1];
  }, [data]);

  // Year picker state
  const [activeYear, setActiveYear] = useState<number>(availableYears[0]);

  // Get financial metrics from actual P&L data for activeYear
  const revenue = getCategoryYearlyTotalByType("sales_revenue", activeYear);
  const cogs = Math.abs(getCategoryYearlyTotalByType("cogs", activeYear));
  const grossProfit = revenue - cogs;
  const operatingExpenses = Math.abs(
    getCategoryYearlyTotalByType("operating_expenses", activeYear)
  );
  const netProfitBeforeTax = getCategoryYearlyTotalByType(
    "net_profit_before_tax",
    activeYear
  );
  const taxExpense =
    netProfitBeforeTax > 0
      ? netProfitBeforeTax * ((data.taxRate ?? 25) / 100)
      : 0;
  const netProfitAfterTax = netProfitBeforeTax - taxExpense;

  // Get additional P&L metrics for deeper analysis
  const otherIncome =
    getCategoryYearlyTotalByType("other_income", activeYear) ?? 0;
  const financialExpenses = Math.abs(
    getCategoryYearlyTotalByType("financial_expenses", activeYear) ?? 0
  );
  // Note: otherExpenses calculation removed as it was unused

  // Calculate key metrics based on actual data
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
  const operatingProfit = grossProfit - operatingExpenses;
  const operatingMargin = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
  const netMargin = revenue > 0 ? (netProfitAfterTax / revenue) * 100 : 0;
  const expenseRatio = revenue > 0 ? (operatingExpenses / revenue) * 100 : 0;
  const cogsRatio = revenue > 0 ? (cogs / revenue) * 100 : 0;

  // Monthly data for richer context
  const monthly = useMemo(
    () => getMonthlyData(activeYear),
    [getMonthlyData, activeYear]
  );
  const monthlyRevenue = monthly.sales_revenue ?? Array(12).fill(0);
  const monthlyCOGS = (monthly.cogs ?? Array(12).fill(0)).map((v) =>
    Math.abs(v)
  );
  const monthlyOpEx = (monthly.operating_expenses ?? Array(12).fill(0)).map(
    (v) => Math.abs(v)
  );
  const monthlyOperatingProfit = monthly.operating_profit ?? Array(12).fill(0);
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

  // Performance assessments
  const getPerformanceLevel = (
    value: number,
    thresholds: { excellent: number; good: number; fair: number }
  ) => {
    if (value >= thresholds.excellent)
      return {
        level: "Excellent",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      };
    if (value >= thresholds.good)
      return {
        level: "Good",
        color: "bg-blue-100 text-blue-800",
        icon: TrendingUp,
      };
    if (value >= thresholds.fair)
      return {
        level: "Fair",
        color: "bg-yellow-100 text-yellow-800",
        icon: Minus,
      };
    return {
      level: "Needs Improvement",
      color: "bg-red-100 text-red-800",
      icon: TrendingDown,
    };
  };

  const getRecommendation = (
    metric: string,
    value: number,
    thresholds: Record<string, number>
  ) => {
    switch (metric) {
      case "grossMargin":
        if (value < thresholds.fair) {
          return "Your gross margins are below industry standards. Focus on pricing strategy, supplier negotiations, and production efficiency improvements.";
        } else if (value < thresholds.good) {
          return "Gross margins are improving but have room for growth. Consider value-added services and operational efficiency.";
        } else {
          return "Excellent gross margins! Your pricing and cost management are working well. Maintain this competitive advantage.";
        }

      case "operatingMargin":
        if (value < thresholds.fair) {
          return "Operating margins indicate high overhead costs. Review all operating expenses and identify cost reduction opportunities.";
        } else if (value < thresholds.good) {
          return "Operating margins are healthy. Focus on scaling operations efficiently to improve margins further.";
        } else {
          return "Strong operating margins! Your business operations are highly efficient and well-managed.";
        }

      case "netMargin":
        if (value < thresholds.fair) {
          return "Net margins need improvement. Focus on both revenue growth and cost optimization across all areas.";
        } else if (value < thresholds.good) {
          return "Net margins are solid. Consider strategies for further improvement through operational excellence.";
        } else {
          return "Outstanding net margins! Your business is highly profitable and well-positioned for growth.";
        }

      case "expenseRatio":
        if (value > 40) {
          return "Operating expenses are consuming too much revenue. Implement cost controls and efficiency measures.";
        } else if (value > 25) {
          return "Expense ratio is manageable but could be optimized. Review discretionary spending and operational efficiency.";
        } else {
          return "Excellent expense management! Your operating costs are well-controlled relative to revenue.";
        }

      case "cogsRatio":
        if (value > 80) {
          return "Cost of goods sold is very high. Review supplier costs, production efficiency, and pricing strategy.";
        } else if (value > 70) {
          return "COGS ratio is elevated. Focus on supplier negotiations and operational improvements.";
        } else {
          return "Good COGS management! Your direct costs are well-controlled relative to revenue.";
        }

      default:
        return "Monitor this metric regularly and adjust strategies as needed.";
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatPercentage = (value: number) => `${(value ?? 0).toFixed(1)}%`;

  // Check if we have meaningful data to analyze
  const hasData = revenue > 0 || cogs > 0 || operatingExpenses > 0;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              No Financial Data Available
            </CardTitle>
            <CardDescription>
              Please enter your financial data in the Input Data tab to see
              comprehensive analysis and recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                To get meaningful insights and recommendations, please complete
                your Profit & Loss statement with actual financial data.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Executive Summary
              </CardTitle>
              <CardDescription>
                Key insights and recommendations based on your actual financial
                performance
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">Year</div>
              <Select
                value={String(activeYear)}
                onValueChange={(v) => setActiveYear(Number(v))}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(revenue)}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="text-xs text-muted-foreground">
                Avg / mo: {formatCurrency(avgMonthlyRevenue)}
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatPercentage(grossMargin)}
              </div>
              <div className="text-sm text-muted-foreground">Gross Margin</div>
              <div className="text-xs text-muted-foreground">
                COGS: {formatPercentage(cogsRatio)}
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(netProfitAfterTax)}
              </div>
              <div className="text-sm text-muted-foreground">Net Profit</div>
              <div className="text-xs text-muted-foreground">
                Net Margin: {formatPercentage(netMargin)}
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {formatPercentage(qoqGrowth)}
              </div>
              <div className="text-sm text-muted-foreground">QoQ Growth</div>
              <div className="text-xs text-muted-foreground">
                Volatility: {formatPercentage(revenueVolatility)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profitability Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Profitability Analysis
          </CardTitle>
          <CardDescription>
            Detailed assessment of your profit margins and cost structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gross Margin */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Gross Profit Margin</h4>
              <Badge
                className={
                  getPerformanceLevel(grossMargin, {
                    excellent: 50,
                    good: 30,
                    fair: 20,
                  }).color
                }
              >
                {formatPercentage(grossMargin)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {getRecommendation("grossMargin", grossMargin, {
                excellent: 50,
                good: 30,
                fair: 20,
              })}
            </p>
            <div className="text-xs text-muted-foreground">
              Gross Profit: {formatCurrency(grossProfit)} | Revenue:{" "}
              {formatCurrency(revenue)} | COGS: {formatCurrency(cogs)}
            </div>
          </div>

          {/* Operating Margin */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Operating Profit Margin</h4>
              <Badge
                className={
                  getPerformanceLevel(operatingMargin, {
                    excellent: 20,
                    good: 15,
                    fair: 10,
                  }).color
                }
              >
                {formatPercentage(operatingMargin)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {getRecommendation("operatingMargin", operatingMargin, {
                excellent: 20,
                good: 15,
                fair: 10,
              })}
            </p>
            <div className="text-xs text-muted-foreground">
              Operating Profit: {formatCurrency(operatingProfit)} | Operating
              Expenses: {formatCurrency(operatingExpenses)}
            </div>
          </div>

          {/* Net Margin */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Net Profit Margin</h4>
              <Badge
                className={
                  getPerformanceLevel(netMargin, {
                    excellent: 15,
                    good: 10,
                    fair: 5,
                  }).color
                }
              >
                {formatPercentage(netMargin)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {getRecommendation("netMargin", netMargin, {
                excellent: 15,
                good: 10,
                fair: 5,
              })}
            </p>
            <div className="text-xs text-muted-foreground">
              Net Profit: {formatCurrency(netProfitAfterTax)} | Tax Expense:{" "}
              {formatCurrency(taxExpense)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Structure Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Cost Structure Analysis
          </CardTitle>
          <CardDescription>
            Breakdown of your cost structure and efficiency indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* COGS Ratio */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Cost of Goods Sold Ratio</h4>
              <Badge
                className={
                  getPerformanceLevel(100 - cogsRatio, {
                    excellent: 30,
                    good: 20,
                    fair: 10,
                  }).color
                }
              >
                {formatPercentage(cogsRatio)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {getRecommendation("cogsRatio", cogsRatio, {
                excellent: 50,
                good: 70,
                fair: 80,
              })}
            </p>
            <div className="text-xs text-muted-foreground">
              COGS: {formatCurrency(cogs)} | Revenue: {formatCurrency(revenue)}
            </div>
          </div>

          {/* Operating Expense Ratio */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Operating Expense Ratio</h4>
              <Badge
                className={
                  getPerformanceLevel(100 - expenseRatio, {
                    excellent: 60,
                    good: 75,
                    fair: 85,
                  }).color
                }
              >
                {formatPercentage(expenseRatio)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {getRecommendation("expenseRatio", expenseRatio, {
                excellent: 25,
                good: 40,
                fair: 50,
              })}
            </p>
            <div className="text-xs text-muted-foreground">
              Operating Expenses: {formatCurrency(operatingExpenses)} | Revenue:{" "}
              {formatCurrency(revenue)}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <div>
                Avg OpEx/mo:{" "}
                {formatCurrency(monthlyOpEx.reduce((a, b) => a + b, 0) / 12)}
              </div>
              <div>
                Avg COGS/mo:{" "}
                {formatCurrency(monthlyCOGS.reduce((a, b) => a + b, 0) / 12)}
              </div>
              <div>
                Avg EBIT/mo:{" "}
                {formatCurrency(
                  monthlyOperatingProfit.reduce((a, b) => a + b, 0) / 12
                )}
              </div>
            </div>
          </div>

          {/* Other Income Impact */}
          {otherIncome > 0 && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Other Income</h4>
                <Badge className="bg-green-100 text-green-800">
                  {formatCurrency(otherIncome)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Additional income of{" "}
                {formatPercentage((otherIncome / revenue) * 100)} of revenue.
                This provides a valuable boost to your profitability.
              </p>
              <div className="text-xs text-muted-foreground">
                Consider if this income stream can be expanded or made more
                consistent.
              </div>
            </div>
          )}

          {/* Financial Expenses Impact */}
          {financialExpenses > 0 && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Financial Expenses</h4>
                <Badge className="bg-red-100 text-red-800">
                  {formatCurrency(financialExpenses)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Financial expenses of{" "}
                {formatPercentage((financialExpenses / revenue) * 100)} of
                revenue are reducing your net profit.
              </p>
              <div className="text-xs text-muted-foreground">
                Review financing costs and consider debt optimization
                strategies.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tax Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tax Efficiency Analysis
          </CardTitle>
          <CardDescription>
            Analysis of your tax position and efficiency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Effective Tax Rate</h4>
              <Badge className="bg-blue-100 text-blue-800">
                {formatPercentage(
                  netProfitBeforeTax > 0
                    ? (taxExpense / netProfitBeforeTax) * 100
                    : 0
                )}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {netProfitBeforeTax > 0
                ? `Your effective tax rate is ${formatPercentage(
                    (taxExpense / netProfitBeforeTax) * 100
                  )}. This is ${
                    (taxExpense / netProfitBeforeTax) * 100 >
                    (data.taxRate || 25)
                      ? "higher than"
                      : "at or below"
                  } the standard rate of ${data.taxRate || 25}%.`
                : "No tax liability due to net loss position."}
            </p>
            <div className="text-xs text-muted-foreground">
              Net Profit Before Tax: {formatCurrency(netProfitBeforeTax)} | Tax
              Expense: {formatCurrency(taxExpense)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Strategic Recommendations
          </CardTitle>
          <CardDescription>
            Priority actions based on your actual financial performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {grossMargin < 30 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Improve Gross Margins:</strong> Your gross margin of{" "}
                {formatPercentage(grossMargin)} is below optimal levels. Focus
                on: pricing strategy review, supplier cost negotiations,
                production efficiency improvements, and value-added services.
              </AlertDescription>
            </Alert>
          )}

          {operatingMargin < 15 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Optimize Operating Expenses:</strong> Operating expenses
                of {formatCurrency(operatingExpenses)} represent{" "}
                {formatPercentage(expenseRatio)} of revenue. Implement cost
                controls, review discretionary spending, and improve operational
                efficiency.
              </AlertDescription>
            </Alert>
          )}

          {netMargin < 10 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Enhance Overall Profitability:</strong> Net margin of{" "}
                {formatPercentage(netMargin)} needs improvement. Focus on both
                revenue growth and cost optimization across all areas of the
                business.
              </AlertDescription>
            </Alert>
          )}

          {cogsRatio > 70 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Reduce Cost of Goods Sold:</strong> COGS represents{" "}
                {formatPercentage(cogsRatio)} of revenue. Review supplier
                relationships, production processes, and pricing strategy to
                improve margins.
              </AlertDescription>
            </Alert>
          )}

          {financialExpenses > 0 && financialExpenses > revenue * 0.05 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Review Financing Costs:</strong> Financial expenses of{" "}
                {formatCurrency(financialExpenses)} are significant. Consider
                debt refinancing, interest rate optimization, or alternative
                financing options.
              </AlertDescription>
            </Alert>
          )}

          {grossMargin >= 40 && netMargin >= 12 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Excellent Financial Performance:</strong> Your business
                is performing well with strong margins. Focus on maintaining
                this position, exploring expansion opportunities, and building
                cash reserves.
              </AlertDescription>
            </Alert>
          )}

          {netProfitAfterTax > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Profitable Operations:</strong> Your business is
                generating positive net profit of{" "}
                {formatCurrency(netProfitAfterTax)}. Consider reinvesting in
                growth initiatives, building reserves, or exploring expansion
                opportunities.
              </AlertDescription>
            </Alert>
          )}

          {netProfitAfterTax < 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Loss Position:</strong> Your business is currently
                operating at a loss of{" "}
                {formatCurrency(Math.abs(netProfitAfterTax))}. Immediate focus
                should be on cost reduction, revenue growth, and cash flow
                management to achieve profitability.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
