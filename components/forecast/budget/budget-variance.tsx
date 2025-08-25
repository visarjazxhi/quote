"use client";

import {
  AlertTriangle,
  Calculator,
  CheckCircle,
  DollarSign,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Toolbar } from "@/components/ui/toolbar";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

interface BudgetItem {
  id: string;
  category: string;
  subcategory: string;
  name: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  cumulativeVariance: number;
  trend: "up" | "down" | "stable";
  status: "favorable" | "unfavorable" | "neutral";
  month: number;
  year: number;
}

interface BudgetCategory {
  name: string;
  type: string;
  budgetedTotal: number;
  actualTotal: number;
  variance: number;
  variancePercent: number;
  items: BudgetItem[];
  status: "favorable" | "unfavorable" | "neutral";
}

export function BudgetVariance() {
  const { data } = useFinancialStore();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("ytd");
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [viewMode, setViewMode] = useState<string>("category");
  const [alertThreshold, setAlertThreshold] = useState<number>(10);

  // Calculate dynamic budget targets based on actual data patterns
  const budgetAnalysis = useMemo(() => {
    const currentYear = parseInt(selectedYear);
    const previousYear = currentYear - 1;
    const categories: BudgetCategory[] = [];
    let totalBudgeted = 0;
    let totalActual = 0;

    // Calculate previous year actuals to establish budget baseline
    const calculatePreviousYearTotals = () => {
      const previousTotals: Record<string, number> = {};

      data.categories.forEach((category) => {
        if (!category.isCalculated) {
          const previousYearTotal = category.subcategories.reduce(
            (catSum, sub) =>
              catSum +
              sub.rows.reduce((subSum, row) => {
                const previousValues = row.values.filter(
                  (v) => v.year === previousYear
                );
                return (
                  subSum +
                  previousValues.reduce((sum, val) => sum + val.value, 0)
                );
              }, 0),
            0
          );

          previousTotals[category.type] = previousYearTotal;
        }
      });

      return previousTotals;
    };

    const previousYearTotals = calculatePreviousYearTotals();

    data.categories.forEach((category) => {
      if (!category.isCalculated) {
        let categoryBudgeted = 0;
        let categoryActual = 0;
        const budgetItems: BudgetItem[] = [];

        // Calculate budget based on previous year performance + growth expectations
        const previousYearTotal = previousYearTotals[category.type] || 0;
        let growthRate = 0.05; // Default 5% growth

        // Adjust growth rate based on category type
        if (category.type === "sales_revenue") {
          growthRate = 0.1; // Expect 10% revenue growth
        } else if (category.type === "cogs") {
          growthRate = 0.07; // COGS grows slower than revenue
        } else if (category.type === "operating_expenses") {
          growthRate = 0.03; // Control expense growth
        }

        const categoryBudgetTarget = previousYearTotal * (1 + growthRate);

        category.subcategories.forEach((subcategory) => {
          subcategory.rows.forEach((row) => {
            // Calculate actual amounts for the current year
            const actualAmount = row.values
              .filter((v) => v.year === currentYear)
              .reduce((sum, v) => sum + v.value, 0);

            // Calculate previous year amount for this specific row
            const previousRowAmount = row.values
              .filter((v) => v.year === previousYear)
              .reduce((sum, v) => sum + v.value, 0);

            // Calculate budgeted amount based on row's proportion of category in previous year
            const rowProportionOfCategory =
              previousYearTotal > 0
                ? previousRowAmount / previousYearTotal
                : 1 /
                  category.subcategories.reduce(
                    (count, sub) => count + sub.rows.length,
                    0
                  );

            const budgetedAmount =
              categoryBudgetTarget * rowProportionOfCategory;

            const variance = actualAmount - budgetedAmount;
            const variancePercent =
              budgetedAmount > 0 ? (variance / budgetedAmount) * 100 : 0;

            // Determine status based on category type and variance
            let status: "favorable" | "unfavorable" | "neutral" = "neutral";
            if (category.type === "sales_revenue") {
              status = variance > 0 ? "favorable" : "unfavorable";
            } else if (
              category.type === "cogs" ||
              category.type === "operating_expenses"
            ) {
              status = variance < 0 ? "favorable" : "unfavorable";
            }

            // Determine trend (simplified)
            const trend: "up" | "down" | "stable" =
              Math.abs(variancePercent) < 5
                ? "stable"
                : variancePercent > 0
                ? "up"
                : "down";

            const budgetItem: BudgetItem = {
              id: row.id,
              category: category.name,
              subcategory: subcategory.name,
              name: row.name,
              budgetedAmount,
              actualAmount,
              variance,
              variancePercent,
              cumulativeVariance: variance, // Simplified
              trend,
              status,
              month: 12, // Year-end
              year: currentYear,
            };

            budgetItems.push(budgetItem);
            categoryBudgeted += budgetedAmount;
            categoryActual += actualAmount;
          });
        });

        const categoryVariance = categoryActual - categoryBudgeted;
        const categoryVariancePercent =
          categoryBudgeted > 0
            ? (categoryVariance / categoryBudgeted) * 100
            : 0;

        let categoryStatus: "favorable" | "unfavorable" | "neutral" = "neutral";
        if (category.type === "sales_revenue") {
          categoryStatus = categoryVariance > 0 ? "favorable" : "unfavorable";
        } else if (
          category.type === "cogs" ||
          category.type === "operating_expenses"
        ) {
          categoryStatus = categoryVariance < 0 ? "favorable" : "unfavorable";
        }

        categories.push({
          name: category.name,
          type: category.type,
          budgetedTotal: categoryBudgeted,
          actualTotal: categoryActual,
          variance: categoryVariance,
          variancePercent: categoryVariancePercent,
          items: budgetItems,
          status: categoryStatus,
        });

        totalBudgeted += categoryBudgeted;
        totalActual += categoryActual;
      }
    });

    const totalVariance = totalActual - totalBudgeted;
    const totalVariancePercent =
      totalBudgeted > 0 ? (totalVariance / totalBudgeted) * 100 : 0;

    return {
      categories,
      totalBudgeted,
      totalActual,
      totalVariance,
      totalVariancePercent,
    };
  }, [data, selectedYear]);

  // Helper functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const getVarianceColor = (variance: number, type: string) => {
    if (type === "sales_revenue") {
      return variance > 0 ? "text-green-600" : "text-red-600";
    } else {
      return variance < 0 ? "text-green-600" : "text-red-600";
    }
  };

  const getVarianceIcon = (variance: number, type: string) => {
    if (type === "sales_revenue") {
      return variance > 0 ? (
        <TrendingUp className="h-4 w-4 text-green-600" />
      ) : (
        <TrendingDown className="h-4 w-4 text-red-600" />
      );
    } else {
      return variance < 0 ? (
        <TrendingDown className="h-4 w-4 text-green-600" />
      ) : (
        <TrendingUp className="h-4 w-4 text-red-600" />
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "favorable":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Favorable
          </Badge>
        );
      case "unfavorable":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Unfavorable
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Target className="h-3 w-3 mr-1" />
            On Track
          </Badge>
        );
    }
  };

  // Chart data
  const varianceChartData = budgetAnalysis.categories.map((cat) => ({
    name: cat.name.length > 15 ? cat.name.substring(0, 15) + "..." : cat.name,
    budgeted: cat.budgetedTotal,
    actual: cat.actualTotal,
    variance: cat.variance,
    variancePercent: cat.variancePercent,
  }));

  const monthlyVarianceData = Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const monthName = new Date(2024, index).toLocaleString("default", {
      month: "short",
    });

    // Calculate monthly budget vs actual (simplified)
    const monthlyBudget = budgetAnalysis.totalBudgeted / 12;
    const monthlyActual =
      budgetAnalysis.categories.reduce((sum, cat) => {
        return (
          sum +
          cat.items.reduce((itemSum, item) => {
            return itemSum + item.actualAmount / 12; // Simplified monthly distribution
          }, 0)
        );
      }, 0) / 12;

    const variance = monthlyActual - monthlyBudget;
    const cumulativeVariance = variance * month; // Simplified cumulative calculation

    return {
      month: monthName,
      budgeted: monthlyBudget,
      actual: monthlyActual,
      variance,
      cumulativeVariance,
    };
  });

  const topVariances = budgetAnalysis.categories
    .flatMap((cat) => cat.items)
    .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Budget vs Actual Variance Analysis"
        description="Analyze performance against budget with clear visuals, filters, and alerts."
        icon={Calculator}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {selectedYear}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {selectedPeriod.toUpperCase()}
            </Badge>
          </div>
        }
      />
      <Toolbar
        onSearch={() => {
          // optional: hook up later for filtering categories/items
          // currently no-op for performance
        }}
        searchPlaceholder="Search categories or items..."
      >
        <div className="flex items-center gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Period</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtd">Month to Date</SelectItem>
                <SelectItem value="qtd">Quarter to Date</SelectItem>
                <SelectItem value="ytd">Year to Date</SelectItem>
                <SelectItem value="12m">Last 12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>View Mode</Label>
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">By Category</SelectItem>
                <SelectItem value="variance">By Variance</SelectItem>
                <SelectItem value="trend">By Trend</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Alert Threshold (%)</Label>
            <Input
              type="number"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
              className="w-24"
              min="1"
              max="50"
            />
          </div>
        </div>
      </Toolbar>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          {/* High-Level Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Budget"
              value={formatCurrency(budgetAnalysis.totalBudgeted)}
              icon={Target}
              tone="info"
            />
            <StatCard
              label="Actual Amount"
              value={formatCurrency(budgetAnalysis.totalActual)}
              icon={DollarSign}
              tone="success"
            />
            <StatCard
              label="Total Variance"
              value={formatCurrency(Math.abs(budgetAnalysis.totalVariance))}
              icon={
                budgetAnalysis.totalVariance > 0 ? TrendingUp : TrendingDown
              }
              tone={budgetAnalysis.totalVariance > 0 ? "success" : "danger"}
              helperText={`(${formatPercent(
                budgetAnalysis.totalVariancePercent
              )})`}
            />
            <StatCard
              label="Budget Utilization"
              value={`${(
                (budgetAnalysis.totalActual / budgetAnalysis.totalBudgeted) *
                100
              ).toFixed(1)}%`}
              icon={Calculator}
              tone="warning"
            />
          </div>

          {/* Budget vs Actual Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Budget vs Actual Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={varianceChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name,
                      ]}
                      labelFormatter={(label) => `Category: ${label}`}
                      contentStyle={{
                        fontSize: "12px",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "8px",
                      }}
                      cursor={{ fill: "rgba(59, 130, 246, n0.1)" }}
                    />
                    <Legend />
                    <Bar dataKey="budgeted" fill="#94a3b8" name="Budgeted" />
                    <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
                    <Line
                      type="monotone"
                      dataKey="variance"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Variance"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Favorable Variances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {budgetAnalysis.categories
                    .filter((cat) => cat.status === "favorable")
                    .slice(0, 5)
                    .map((cat) => (
                      <div
                        key={`fav-${cat.name}`}
                        className="flex justify-between text-sm"
                      >
                        <span>{cat.name}</span>
                        <span className="text-green-600 font-medium">
                          {formatPercent(cat.variancePercent)}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Unfavorable Variances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {budgetAnalysis.categories
                    .filter((cat) => cat.status === "unfavorable")
                    .slice(0, 5)
                    .map((cat) => (
                      <div
                        key={`unfav-${cat.name}`}
                        className="flex justify-between text-sm"
                      >
                        <span>{cat.name}</span>
                        <span className="text-red-600 font-medium">
                          {formatPercent(cat.variancePercent)}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>
                      {
                        budgetAnalysis.categories.filter(
                          (c) => c.status === "favorable"
                        ).length
                      }{" "}
                      categories performing above budget
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                    <span>
                      {
                        budgetAnalysis.categories.filter(
                          (c) => c.status === "unfavorable"
                        ).length
                      }{" "}
                      categories below budget expectations
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                    <span>
                      Overall budget utilization at{" "}
                      {(
                        (budgetAnalysis.totalActual /
                          budgetAnalysis.totalBudgeted) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category-wise Variance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Category</th>
                      <th className="text-right p-2">Budgeted</th>
                      <th className="text-right p-2">Actual</th>
                      <th className="text-right p-2">Variance</th>
                      <th className="text-right p-2">Variance %</th>
                      <th className="text-center p-2">Status</th>
                      <th className="text-center p-2">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetAnalysis.categories.map((category) => (
                      <tr
                        key={`cat-${category.name}`}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-2 font-medium">{category.name}</td>
                        <td className="text-right p-2">
                          {formatCurrency(category.budgetedTotal)}
                        </td>
                        <td className="text-right p-2">
                          {formatCurrency(category.actualTotal)}
                        </td>
                        <td
                          className={`text-right p-2 ${getVarianceColor(
                            category.variance,
                            category.type
                          )}`}
                        >
                          {formatCurrency(category.variance)}
                        </td>
                        <td
                          className={`text-right p-2 font-medium ${getVarianceColor(
                            category.variance,
                            category.type
                          )}`}
                        >
                          {formatPercent(category.variancePercent)}
                        </td>
                        <td className="text-center p-2">
                          {getStatusBadge(category.status)}
                        </td>
                        <td className="text-center p-2">
                          {getVarianceIcon(category.variance, category.type)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Variance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyVarianceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
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
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="budgeted"
                      fill="#94a3b8"
                      fillOpacity={0.3}
                      name="Budgeted"
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      name="Actual"
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulativeVariance"
                      stroke="#ef4444"
                      strokeWidth={3}
                      name="Cumulative Variance"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Budget Alerts (Variance ≥ {alertThreshold}%)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {budgetAnalysis.categories
                  .flatMap((cat) => cat.items)
                  .filter(
                    (item) => Math.abs(item.variancePercent) >= alertThreshold
                  )
                  .sort(
                    (a, b) =>
                      Math.abs(b.variancePercent) - Math.abs(a.variancePercent)
                  )
                  .slice(0, 10)
                  .map((item, index) => (
                    <div
                      key={`alert-${index}-${item.id}`}
                      className={`p-4 rounded-lg border-l-4 ${
                        item.status === "favorable"
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.category} • {item.subcategory}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {formatPercent(item.variancePercent)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(item.variance)} variance
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <span className="text-xs text-muted-foreground">
                          Budget: {formatCurrency(item.budgetedAmount)} |
                          Actual: {formatCurrency(item.actualAmount)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Budget Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Item</th>
                      <th className="text-left p-2">Category</th>
                      <th className="text-right p-2">Budgeted</th>
                      <th className="text-right p-2">Actual</th>
                      <th className="text-right p-2">Variance</th>
                      <th className="text-right p-2">Variance %</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topVariances.map((item, index) => (
                      <tr
                        key={`topvar-${index}-${item.id}`}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.subcategory}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">{item.category}</td>
                        <td className="text-right p-2">
                          {formatCurrency(item.budgetedAmount)}
                        </td>
                        <td className="text-right p-2">
                          {formatCurrency(item.actualAmount)}
                        </td>
                        <td className="text-right p-2 font-medium">
                          <span
                            className={
                              item.variance > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {formatCurrency(item.variance)}
                          </span>
                        </td>
                        <td className="text-right p-2 font-medium">
                          <span
                            className={
                              Math.abs(item.variancePercent) > alertThreshold
                                ? "text-red-600"
                                : "text-green-600"
                            }
                          >
                            {formatPercent(item.variancePercent)}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          {getStatusBadge(item.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
