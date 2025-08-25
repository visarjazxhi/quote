"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

const INCOME_ITEMS = [
  "Service Revenue",
  "Commissions",
  "Rental Income",
  "Other Operating Revenue",
] as const;

const COGS_ITEMS = [
  "Raw Materials",
  "Packaging",
  "Direct Labour",
  "Other Direct Costs",
] as const;

const OPEX_ITEMS = [
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
  "Telephone",
  "Uniforms",
  "Website hosting and maintenance",
  "Other",
] as const;

const OTHER_INCOME_ITEMS = [
  "Interest Income",
  "Dividend Income",
  "Foreign Exchange Gain",
  "Gain on Sale of Assets",
  "Government Grants / Rebates",
  "Miscellaneous other Income",
] as const;

const OTHER_EXPENSE_ITEMS = [
  "Interest Expense",
  "Foreign Exchange Loss",
  "Loss on Sale of Assets",
  "Bad Debts Written Off",
  "Miscellaneous other Expenses",
] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function PLStandardTable() {
  const { data } = useFinancialStore();
  const [year, setYear] = useState<number>(data.forecastPeriods[0]?.year ?? new Date().getFullYear());

  const years = useMemo(() => {
    const ys = new Set<number>();
    data.categories.forEach((cat) =>
      cat.subcategories.forEach((sub) =>
        sub.rows.forEach((row) => row.values.forEach((v) => ys.add(v.year)))
      )
    );
    return Array.from(ys).sort((a, b) => b - a);
  }, [data]);

  const findRowTotal = (rowName: string, categoryTypes: string[], treatAsPositive = false) => {
    // Match by exact name (case-insensitive)
    let total = 0;
    data.categories.forEach((cat) => {
      if (!categoryTypes.includes(cat.type)) return;
      cat.subcategories.forEach((sub) => {
        sub.rows.forEach((row) => {
          if (row.name.trim().toLowerCase() === rowName.trim().toLowerCase()) {
            const yearTotal = row.values
              .filter((v) => v.year === year)
              .reduce((s, v) => s + v.value, 0);
            total += treatAsPositive ? Math.abs(yearTotal) : yearTotal;
          }
        });
      });
    });
    return total;
  };

  const totals = useMemo(() => {
    // Income
    const incomeRows = INCOME_ITEMS.map((item) => ({
      name: item,
      amount: findRowTotal(item, ["sales_revenue"], false),
    }));
    const incomeTotal = incomeRows.reduce((s, r) => s + r.amount, 0);

    // COGS (store may be negative; present as positive)
    const cogsRows = COGS_ITEMS.map((item) => ({
      name: item,
      amount: findRowTotal(item, ["cogs"], true),
    }));
    const cogsTotal = cogsRows.reduce((s, r) => s + r.amount, 0);

    const grossProfit = incomeTotal - cogsTotal;

    // Operating Expenses (present as positive)
    const opexRows = OPEX_ITEMS.map((item) => ({
      name: item,
      amount: findRowTotal(item, ["operating_expenses"], true),
    }));
    const opexTotal = opexRows.reduce((s, r) => s + r.amount, 0);

    const operatingProfit = grossProfit - opexTotal;

    // Other Income
    const otherIncomeRows = OTHER_INCOME_ITEMS.map((item) => ({
      name: item,
      amount: findRowTotal(item, ["other_income"], false),
    }));
    const otherIncomeTotal = otherIncomeRows.reduce((s, r) => s + r.amount, 0);

    // Other Expenses (Interest Expense from financial_expenses; rest from other_expenses)
    const otherExpenseRows = OTHER_EXPENSE_ITEMS.map((item) => {
      const isInterest = item.toLowerCase().includes("interest expense");
      const types = isInterest ? ["financial_expenses"] : ["other_expenses"];
      return { name: item, amount: findRowTotal(item, types, true) };
    });
    const otherExpensesTotal = otherExpenseRows.reduce((s, r) => s + r.amount, 0);

    const netProfitBeforeTax = operatingProfit + otherIncomeTotal - otherExpensesTotal;

    // Income tax expense: use taxRate if positive profit
    const taxRate = data.taxRate ?? 25;
    const incomeTaxExpense = netProfitBeforeTax > 0 ? (netProfitBeforeTax * taxRate) / 100 : 0;
    const netProfitAfterTax = netProfitBeforeTax - incomeTaxExpense;

    return {
      incomeRows,
      incomeTotal,
      cogsRows,
      cogsTotal,
      grossProfit,
      opexRows,
      opexTotal,
      operatingProfit,
      otherIncomeRows,
      otherIncomeTotal,
      otherExpenseRows,
      otherExpensesTotal,
      netProfitBeforeTax,
      incomeTaxExpense,
      netProfitAfterTax,
    };
  }, [data, year]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Profit & Loss Statement"
        description="Standardized structure with clear sections and totals."
        icon={DollarSign}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">AUD</Badge>
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(years.length ? years : [year]).map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      {/* 1. Income */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>1. Income</span>
            <span className="text-base font-semibold">{formatCurrency(totals.incomeTotal)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {totals.incomeRows.map((r) => (
            <div key={r.name} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">- {r.name}</span>
              <span className="font-medium">{formatCurrency(r.amount)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 2. COGS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>2. Cost of Goods Sold (COGS)</span>
            <span className="text-base font-semibold">{formatCurrency(totals.cogsTotal)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {totals.cogsRows.map((r) => (
            <div key={r.name} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">- {r.name}</span>
              <span className="font-medium">{formatCurrency(r.amount)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Gross Profit */}
      <Card className="bg-muted/40">
        <CardContent className="py-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Gross Profit = Total Income − Total COGS</span>
          <span className="text-base font-bold">{formatCurrency(totals.grossProfit)}</span>
        </CardContent>
      </Card>

      {/* 3. Operating Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>3. Operating Expenses</span>
            <span className="text-base font-semibold">{formatCurrency(totals.opexTotal)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {totals.opexRows.map((r) => (
            <div key={r.name} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{r.name}</span>
              <span className="font-medium">{formatCurrency(r.amount)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Operating Profit */}
      <Card className="bg-muted/40">
        <CardContent className="py-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Operating Profit (EBIT) = Gross Profit − Total Operating Expenses</span>
          <span className="text-base font-bold">{formatCurrency(totals.operatingProfit)}</span>
        </CardContent>
      </Card>

      {/* 4. Other Income */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>4. Other Income</span>
            <span className="text-base font-semibold">{formatCurrency(totals.otherIncomeTotal)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {totals.otherIncomeRows.map((r) => (
            <div key={r.name} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">- {r.name}</span>
              <span className="font-medium">{formatCurrency(r.amount)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 5. Other Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>5. Other Expenses</span>
            <span className="text-base font-semibold">{formatCurrency(totals.otherExpensesTotal)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {totals.otherExpenseRows.map((r) => (
            <div key={r.name} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">- {r.name}</span>
              <span className="font-medium">{formatCurrency(r.amount)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Net Profit Before Tax */}
      <Card className="bg-muted/40">
        <CardContent className="py-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Net Profit Before Tax = Operating Profit + Other Income − Other Expenses</span>
          <span className="text-base font-bold">{formatCurrency(totals.netProfitBeforeTax)}</span>
        </CardContent>
      </Card>

      {/* Income Tax Expense */}
      <Card>
        <CardContent className="py-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Income Tax Expense</span>
          <span className="text-base font-semibold">{formatCurrency(totals.incomeTaxExpense)}</span>
        </CardContent>
      </Card>

      {/* Net Profit After Tax */}
      <Card className="bg-primary/10">
        <CardContent className="py-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Net Profit After Tax</span>
          <span className="text-base font-bold">{formatCurrency(totals.netProfitAfterTax)}</span>
        </CardContent>
      </Card>
    </div>
  );
}
