"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import type { CategoryType } from "@/lib/forecast/types/financial";
import { DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
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

type CategoryTypeKey =
  | "sales_revenue"
  | "cogs"
  | "operating_expenses"
  | "other_income"
  | "financial_expenses"
  | "other_expenses";

function monthNames() {
  return [
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
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-AU", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function PLStandardMonthlyInput() {
  const { data, addSubcategory, addRow, updateRowValue } = useFinancialStore();
  const [year, setYear] = useState<number>(() => {
    const currentYear = new Date().getFullYear();
    const available = Array.from(
      new Set(data.forecastPeriods.map((p) => p.year))
    ).sort((a, b) => a - b);
    return available.includes(currentYear)
      ? currentYear
      : available[available.length - 1] ?? currentYear;
  });

  const years = useMemo(() => {
    const ys = new Set<number>();
    data.categories.forEach((cat) =>
      cat.subcategories.forEach((sub) =>
        sub.rows.forEach((row) => row.values.forEach((v) => ys.add(v.year)))
      )
    );
    const list = Array.from(ys).sort((a, b) => b - a);
    return list.length > 0 ? list : [year];
  }, [data, year]);

  const months = monthNames();

  const categoryTypeForItem = (
    group: "income" | "cogs" | "opex" | "other_income" | "other_expenses",
    item: string
  ): CategoryTypeKey => {
    if (group === "income") return "sales_revenue";
    if (group === "cogs") return "cogs";
    if (group === "opex") return "operating_expenses";
    if (group === "other_income") return "other_income";
    // other_expenses group: split interest vs others
    if (item.toLowerCase().includes("interest expense"))
      return "financial_expenses";
    return "other_expenses";
  };

  const isExpenseType = useCallback(
    (type: CategoryTypeKey) =>
      [
        "cogs",
        "operating_expenses",
        "financial_expenses",
        "other_expenses",
      ].includes(type),
    []
  );

  const findCategoryByType = useCallback(
    (type: CategoryTypeKey) => data.categories.find((c) => c.type === type),
    [data]
  );

  const ensureRow = useCallback(
    (type: CategoryTypeKey, itemName: string) => {
      const category = findCategoryByType(type);
      if (!category)
        return {
          categoryId: null as string | null,
          subcategoryId: null as string | null,
          rowId: null as string | null,
        };

      // Try find existing row by name across all subcategories
      for (const sub of category.subcategories) {
        const existing = sub.rows.find(
          (r) => r.name.trim().toLowerCase() === itemName.trim().toLowerCase()
        );
        if (existing)
          return {
            categoryId: category.id,
            subcategoryId: sub.id,
            rowId: existing.id,
          };
      }

      // Ensure a standard subcategory exists (create if needed)
      let targetSub = category.subcategories.find((s) =>
        s.name.toLowerCase().includes("standard")
      );
      if (!targetSub) {
        const name = "Standard Entries";
        addSubcategory(category.id, { name, order: 0, rows: [] });
        // After store update, re-read from state
        const refreshed = findCategoryByType(type);
        targetSub = refreshed?.subcategories.find((s) => s.name === name);
      }
      if (!targetSub)
        return {
          categoryId: category.id,
          subcategoryId: null as string | null,
          rowId: null as string | null,
        };

      // Create a new row under the target subcategory with zeroed values
      const periods = data.forecastPeriods;
      addRow({
        name: itemName,
        type: type as CategoryType,
        subcategoryId: targetSub.id,
        categoryId: category.id,
        order: 0,
        values: periods.map((p) => ({
          date: p.date,
          value: 0,
          month: p.month,
          year: p.year,
          isProjected: true,
        })),
      });
      // Re-read to fetch new row id
      const refreshedCategory = findCategoryByType(type);
      const sub = refreshedCategory?.subcategories.find(
        (s) => s.id === targetSub.id
      );
      const newRow = sub?.rows.find(
        (r) => r.name.trim().toLowerCase() === itemName.trim().toLowerCase()
      );
      return {
        categoryId: refreshedCategory?.id ?? null,
        subcategoryId: sub?.id ?? null,
        rowId: newRow?.id ?? null,
      };
    },
    [addRow, addSubcategory, data, findCategoryByType]
  );

  const getCellValue = useCallback(
    (type: CategoryTypeKey, itemName: string, month: number): number => {
      const category = findCategoryByType(type);
      if (!category) return 0;
      for (const sub of category.subcategories) {
        const row = sub.rows.find(
          (r) => r.name.trim().toLowerCase() === itemName.trim().toLowerCase()
        );
        if (row) {
          const v = row.values.find(
            (val) => val.year === year && val.month === month
          );
          const raw = v?.value ?? 0;
          return isExpenseType(type) ? Math.abs(raw) : raw;
        }
      }
      return 0;
    },
    [findCategoryByType, isExpenseType, year]
  );

  // Debounced setter to reduce store writes per keystroke
  const setCellValue = useCallback(
    (
      type: CategoryTypeKey,
      itemName: string,
      month: number,
      inputValue: number
    ) => {
      const ensured = ensureRow(type, itemName);
      if (!ensured.rowId) return;
      // Find valueIndex for the (year, month)
      const category = findCategoryByType(type);
      const sub = category?.subcategories.find(
        (s) => s.id === ensured.subcategoryId
      );
      const row = sub?.rows.find((r) => r.id === ensured.rowId);
      if (!row) return;
      const index = row.values.findIndex(
        (v) => v.year === year && v.month === month
      );
      if (index === -1) return;
      const stored = isExpenseType(type) ? -Math.abs(inputValue) : inputValue;
      updateRowValue(ensured.rowId, index, stored);
    },
    [ensureRow, findCategoryByType, isExpenseType, updateRowValue, year]
  );

  const GroupTable = ({
    title,
    items,
    groupKey,
  }: {
    title: string;
    items: readonly string[];
    groupKey: "income" | "cogs" | "opex" | "other_income" | "other_expenses";
  }) => {
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const focusKey = (item: string, month: number) => `${item}-${month}`;
    const totalsByMonth = months.map((_, mIdx) =>
      items.reduce((sum, item) => {
        const type = categoryTypeForItem(groupKey, item);
        return sum + getCellValue(type, item, mIdx + 1);
      }, 0)
    );
    const totalYear = totalsByMonth.reduce((a, b) => a + b, 0);

    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-hidden">
            <table className="w-full text-sm table-fixed">
              <colgroup>
                <col style={{ width: "20%" }} />
                {months.map((m) => (
                  <col key={m} style={{ width: "6%" }} />
                ))}
                <col style={{ width: "8%" }} />
              </colgroup>
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="text-left p-2">{title}</th>
                  {months.map((m) => (
                    <th key={m} className="text-right p-2">
                      {m}
                    </th>
                  ))}
                  <th className="text-right p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item} className="border-b hover:bg-muted/30">
                    <td className="p-2 text-muted-foreground">
                      {groupKey === "opex" ? item : `- ${item}`}
                    </td>
                    {months.map((m, mIdx) => {
                      const monthNumber = mIdx + 1;
                      const type = categoryTypeForItem(groupKey, item);
                      const val = getCellValue(type, item, monthNumber);
                      return (
                        <td key={`${item}-${monthNumber}`} className="p-0">
                          <Input
                            ref={(el) => {
                              inputRefs.current[focusKey(item, monthNumber)] =
                                el;
                            }}
                            type="text"
                            inputMode="numeric"
                            className="h-9 w-full px-2 text-right cursor-text bg-muted/20 hover:bg-muted/30 focus:bg-background border border-muted-foreground/5 focus:border-primary/40 rounded-sm transition-colors shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:ring-2 focus-visible:ring-primary/40"
                            value={val === 0 ? "" : formatNumber(val)}
                            onWheel={(e) => {
                              const target =
                                e.currentTarget as HTMLInputElement;
                              target.blur();
                              e.preventDefault();
                            }}
                            onChange={(e) => {
                              const input = e.currentTarget as HTMLInputElement;
                              const raw = input.value.replace(/,/g, "").trim();
                              const parsed = parseFloat(raw || "0");
                              const safeNum = isNaN(parsed) ? 0 : parsed;
                              setCellValue(type, item, monthNumber, safeNum);
                            }}
                          />
                        </td>
                      );
                    })}
                    <td className="text-right p-2 font-semibold">
                      {formatCurrency(
                        months.reduce((sum, _, mIdx) => {
                          const type = categoryTypeForItem(groupKey, item);
                          return sum + getCellValue(type, item, mIdx + 1);
                        }, 0)
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/30 font-semibold">
                  <td className="p-2">Total {title}</td>
                  {totalsByMonth.map((t, i) => (
                    <td key={months[i] ?? `m-${i}`} className="text-right p-2">
                      {formatCurrency(t)}
                    </td>
                  ))}
                  <td className="text-right p-2">
                    {formatCurrency(totalYear)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const computed = useMemo(() => {
    const incomeMonthly = months.map((_, i) =>
      INCOME_ITEMS.reduce(
        (s, it) => s + getCellValue("sales_revenue", it, i + 1),
        0
      )
    );
    const cogsMonthly = months.map((_, i) =>
      COGS_ITEMS.reduce((s, it) => s + getCellValue("cogs", it, i + 1), 0)
    );
    const grossMonthly = incomeMonthly.map((v, i) => v - cogsMonthly[i]);
    const opexMonthly = months.map((_, i) =>
      OPEX_ITEMS.reduce(
        (s, it) => s + getCellValue("operating_expenses", it, i + 1),
        0
      )
    );
    const ebitMonthly = grossMonthly.map((v, i) => v - opexMonthly[i]);
    const otherIncMonthly = months.map((_, i) =>
      OTHER_INCOME_ITEMS.reduce(
        (s, it) => s + getCellValue("other_income", it, i + 1),
        0
      )
    );
    const otherExpMonthly = months.map((_, i) =>
      OTHER_EXPENSE_ITEMS.reduce((s, it) => {
        const type = it.toLowerCase().includes("interest expense")
          ? "financial_expenses"
          : "other_expenses";
        return s + getCellValue(type as CategoryTypeKey, it, i + 1);
      }, 0)
    );
    const npbtMonthly = ebitMonthly.map(
      (v, i) => v + otherIncMonthly[i] - otherExpMonthly[i]
    );
    const taxRate = data.taxRate ?? 25;
    const taxMonthly = npbtMonthly.map((v) =>
      v > 0 ? (v * taxRate) / 100 : 0
    );
    const npatMonthly = npbtMonthly.map((v, i) => v - taxMonthly[i]);

    return {
      incomeMonthly,
      cogsMonthly,
      grossMonthly,
      opexMonthly,
      ebitMonthly,
      otherIncMonthly,
      otherExpMonthly,
      npbtMonthly,
      taxMonthly,
      npatMonthly,
    };
  }, [data, months, getCellValue]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="P&L Monthly Input (Standard)"
        description="Enter monthly amounts into a fixed, standardized structure."
        icon={DollarSign}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              AUD
            </Badge>
            <Select
              value={String(year)}
              onValueChange={(v) => setYear(Number(v))}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <GroupTable title="1. Income" items={INCOME_ITEMS} groupKey="income" />
      <GroupTable
        title="2. Cost of Goods Sold (COGS)"
        items={COGS_ITEMS}
        groupKey="cogs"
      />

      <Card className="bg-muted/40">
        <CardContent className="py-3 overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: "20%" }} />
              {months.map((m) => (
                <col key={m} style={{ width: "6%" }} />
              ))}
              <col style={{ width: "8%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td className="p-2 font-semibold">
                  Gross Profit = Income − COGS
                </td>
                {computed.grossMonthly.map((v, i) => (
                  <td key={months[i] ?? `m-${i}`} className="text-right p-2">
                    {formatCurrency(v)}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    computed.grossMonthly.reduce((a, b) => a + b, 0)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <GroupTable
        title="3. Operating Expenses"
        items={OPEX_ITEMS}
        groupKey="opex"
      />

      <Card className="bg-muted/40">
        <CardContent className="py-3 overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: "20%" }} />
              {months.map((m) => (
                <col key={m} style={{ width: "6%" }} />
              ))}
              <col style={{ width: "8%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td className="p-2 font-semibold">
                  Operating Profit (EBIT) = Gross Profit − Operating Expenses
                </td>
                {computed.ebitMonthly.map((v, i) => (
                  <td key={months[i] ?? `m-${i}`} className="text-right p-2">
                    {formatCurrency(v)}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    computed.ebitMonthly.reduce((a, b) => a + b, 0)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <GroupTable
        title="4. Other Income"
        items={OTHER_INCOME_ITEMS}
        groupKey="other_income"
      />
      <GroupTable
        title="5. Other Expenses"
        items={OTHER_EXPENSE_ITEMS}
        groupKey="other_expenses"
      />

      <Card className="bg-muted/40">
        <CardContent className="py-3 overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: "20%" }} />
              {months.map((m) => (
                <col key={m} style={{ width: "6%" }} />
              ))}
              <col style={{ width: "8%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td className="p-2 font-semibold">
                  Net Profit Before Tax = Operating Profit + Other Income −
                  Other Expenses
                </td>
                {computed.npbtMonthly.map((v, i) => (
                  <td key={months[i] ?? `m-${i}`} className="text-right p-2">
                    {formatCurrency(v)}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    computed.npbtMonthly.reduce((a, b) => a + b, 0)
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Income Tax Expense</td>
                {computed.taxMonthly.map((v, i) => (
                  <td key={months[i] ?? `m-${i}`} className="text-right p-2">
                    {formatCurrency(v)}
                  </td>
                ))}
                <td className="text-right p-2 font-semibold">
                  {formatCurrency(
                    computed.taxMonthly.reduce((a, b) => a + b, 0)
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Net Profit After Tax</td>
                {computed.npatMonthly.map((v, i) => (
                  <td key={months[i] ?? `m-${i}`} className="text-right p-2">
                    {formatCurrency(v)}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    computed.npatMonthly.reduce((a, b) => a + b, 0)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
