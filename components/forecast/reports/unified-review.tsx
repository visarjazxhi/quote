"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Target, Calculator, Percent, Info } from "lucide-react";
import React, { useMemo } from "react";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";
import {
  getReviewDefinitions,
  type ReviewMetrics,
} from "@/lib/forecast/services/review-definitions";

export function UnifiedReview({ year }: { year: number }) {
  const { data, getCategoryYearlyTotalByType, getMonthlyData } =
    useFinancialStore();

  const metrics: ReviewMetrics = useMemo(() => {
    const currency = "AUD";
    const revenue = getCategoryYearlyTotalByType("sales_revenue", year) ?? 0;
    const cogs = Math.abs(getCategoryYearlyTotalByType("cogs", year) ?? 0);
    const grossProfit = revenue - cogs;
    const operatingExpenses = Math.abs(
      getCategoryYearlyTotalByType("operating_expenses", year) ?? 0
    );
    const operatingProfit = grossProfit - operatingExpenses;
    const otherIncome = getCategoryYearlyTotalByType("other_income", year) ?? 0;
    const financialExpenses = Math.abs(
      getCategoryYearlyTotalByType("financial_expenses", year) ?? 0
    );
    const otherExpenses = Math.abs(
      getCategoryYearlyTotalByType("other_expenses", year) ?? 0
    );
    const netProfitBeforeTax =
      operatingProfit + otherIncome - financialExpenses - otherExpenses;
    const taxExpense =
      netProfitBeforeTax > 0
        ? netProfitBeforeTax * ((data.taxRate ?? 25) / 100)
        : 0;
    const netProfitAfterTax = netProfitBeforeTax - taxExpense;

    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const operatingMargin = revenue > 0 ? (operatingProfit / revenue) * 100 : 0;
    const netMargin = revenue > 0 ? (netProfitAfterTax / revenue) * 100 : 0;
    const expenseRatio = revenue > 0 ? (operatingExpenses / revenue) * 100 : 0;
    const cogsRatio = revenue > 0 ? (cogs / revenue) * 100 : 0;

    const monthly = getMonthlyData(year);
    const monthlyRevenue = monthly.sales_revenue ?? Array(12).fill(0);
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
    const q1 = monthlyRevenue.slice(0, 3).reduce((s, v) => s + v, 0);
    const q4 = monthlyRevenue.slice(9, 12).reduce((s, v) => s + v, 0);
    const qoqGrowth = q1 > 0 ? ((q4 - q1) / q1) * 100 : 0;

    const variableCostRatio = revenue > 0 ? cogs / revenue : 0;
    const contributionMargin = 1 - variableCostRatio;
    const breakEvenRevenue =
      contributionMargin > 0 ? operatingExpenses / contributionMargin : 0;
    const breakEvenMonths =
      avgMonthlyRevenue > 0 ? breakEvenRevenue / avgMonthlyRevenue : 0;

    return {
      revenue,
      cogs,
      grossProfit,
      operatingExpenses,
      operatingProfit,
      netProfitBeforeTax,
      taxExpense,
      netProfitAfterTax,
      grossMargin,
      operatingMargin,
      netMargin,
      expenseRatio,
      cogsRatio,
      breakEvenRevenue,
      breakEvenMonths,
      avgMonthlyRevenue,
      revenueVolatility,
      qoqGrowth,
      currency,
    };
  }, [data, getCategoryYearlyTotalByType, getMonthlyData, year]);

  const defs = useMemo(() => getReviewDefinitions(), []);
  const fmtCurrency = (v: number) =>
    new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: metrics.currency,
      minimumFractionDigits: 0,
    }).format(v);
  const fmtPct = (v: number) => `${v.toFixed(1)}%`;

  const grouped: Record<string, typeof defs> = defs.reduce((acc, def) => {
    acc[def.group] = acc[def.group] ? [...acc[def.group], def] : [def];
    return acc;
  }, {} as Record<string, typeof defs>);

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header summary */}
      <Card className="print:shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" /> Financial Review
              </CardTitle>
              <CardDescription>
                Comprehensive KPIs and explanations for {year}
              </CardDescription>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 border rounded">
                <div className="text-xs text-muted-foreground">Revenue</div>
                <div className="font-semibold text-green-600">
                  {fmtCurrency(metrics.revenue)}
                </div>
              </div>
              <div className="p-2 border rounded">
                <div className="text-xs text-muted-foreground">Net Profit</div>
                <div className="font-semibold text-purple-600">
                  {fmtCurrency(metrics.netProfitAfterTax)}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 border rounded">
              <div className="text-xs text-muted-foreground">Gross Margin</div>
              <div className="text-lg font-bold text-blue-600">
                {fmtPct(metrics.grossMargin)}
              </div>
            </div>
            <div className="text-center p-3 border rounded">
              <div className="text-xs text-muted-foreground">
                Operating Margin
              </div>
              <div className="text-lg font-bold text-blue-600">
                {fmtPct(metrics.operatingMargin)}
              </div>
            </div>
            <div className="text-center p-3 border rounded">
              <div className="text-xs text-muted-foreground">Net Margin</div>
              <div className="text-lg font-bold text-blue-600">
                {fmtPct(metrics.netMargin)}
              </div>
            </div>
            <div className="text-center p-3 border rounded">
              <div className="text-xs text-muted-foreground">QoQ Growth</div>
              <div className="text-lg font-bold text-orange-600">
                {fmtPct(metrics.qoqGrowth)}
              </div>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              COGS:{" "}
              <span className="font-medium">{fmtCurrency(metrics.cogs)}</span> (
              {fmtPct(metrics.cogsRatio)})
            </div>
            <div>
              Operating Expenses:{" "}
              <span className="font-medium">
                {fmtCurrency(metrics.operatingExpenses)}
              </span>{" "}
              ({fmtPct(metrics.expenseRatio)})
            </div>
            <div>
              Effective Tax Rate:{" "}
              <span className="font-medium">
                {fmtPct(
                  metrics.netProfitBeforeTax > 0
                    ? (metrics.taxExpense / metrics.netProfitBeforeTax) * 100
                    : 0
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed KPI cards grouped */}
      {Object.entries(grouped).map(([group, items]) => (
        <Card key={group} className="print:shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {group === "Executive" && <DollarSign className="h-5 w-5" />}
              {group === "Profitability" && <Calculator className="h-5 w-5" />}
              {group === "Costs" && <Target className="h-5 w-5" />}
              {group === "Tax" && <Percent className="h-5 w-5" />}
              {group}
            </CardTitle>
            <CardDescription>
              Definitions, formulas and data-driven tips
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((def) => (
              <div key={def.key} className="border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{def.title}</h4>
                  <Badge variant="secondary">{def.getValue(metrics)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {def.description}
                </p>
                <div className="text-xs">
                  <div className="font-medium mb-1">Formula</div>
                  <div className="font-mono bg-muted/50 p-2 rounded">
                    {def.formula}
                  </div>
                </div>
                <div className="mt-2 text-xs">
                  <div className="font-medium mb-1">Tips</div>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {def.tips(metrics).map((t, i) => (
                      <li key={`${def.key}-tip-${i}`}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
