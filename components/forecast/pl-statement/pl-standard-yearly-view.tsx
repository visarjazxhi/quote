"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DollarSign } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

type CategoryTypeKey =
  | "sales_revenue"
  | "cogs"
  | "operating_expenses"
  | "other_income"
  | "financial_expenses"
  | "other_expenses";

type GroupKey = "income" | "cogs" | "opex" | "other_income" | "other_expenses";

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

function categoryTypeForItem(group: GroupKey, item: string): CategoryTypeKey {
  if (group === "income") return "sales_revenue";
  if (group === "cogs") return "cogs";
  if (group === "opex") return "operating_expenses";
  if (group === "other_income") return "other_income";
  if (item.toLowerCase().includes("interest expense"))
    return "financial_expenses";
  return "other_expenses";
}

function isExpenseType(type: CategoryTypeKey) {
  return (
    type === "cogs" ||
    type === "operating_expenses" ||
    type === "financial_expenses" ||
    type === "other_expenses"
  );
}

export function PLStandardYearlyView() {
  const { data } = useFinancialStore();
  const availableYears = useMemo(() => {
    const set = new Set<number>();
    data.categories.forEach((cat) =>
      cat.subcategories.forEach((sub) =>
        sub.rows.forEach((row) => row.values.forEach((v) => set.add(v.year)))
      )
    );
    const list = Array.from(set).sort((a, b) => a - b);
    return list.length > 0
      ? list
      : [data.forecastPeriods[0]?.year ?? new Date().getFullYear()];
  }, [data]);

  const [selectedYears, setSelectedYears] = useState<number[]>(() => {
    const currentYear = new Date().getFullYear();
    if (availableYears.includes(currentYear)) return [currentYear];
    return [availableYears[availableYears.length - 1]];
  });

  const toggleYear = (year: number) => {
    setSelectedYears((prev) => {
      if (prev.includes(year)) {
        return prev.filter((y) => y !== year);
      }
      return [...prev, year].sort((a, b) => a - b);
    });
  };

  const findRowYearTotal = (
    itemName: string,
    type: CategoryTypeKey,
    year: number
  ): number => {
    const category = data.categories.find((c) => c.type === type);
    if (!category) return 0;
    for (const sub of category.subcategories) {
      const row = sub.rows.find(
        (r) => r.name.trim().toLowerCase() === itemName.trim().toLowerCase()
      );
      if (row) {
        const total = row.values
          .filter((v) => v.year === year)
          .reduce((s, v) => s + v.value, 0);
        return isExpenseType(type) ? Math.abs(total) : total;
      }
    }
    return 0;
  };

  const sumItemsByYear = (
    items: readonly string[],
    group: GroupKey,
    year: number
  ): number => {
    return items.reduce((sum, item) => {
      const type = categoryTypeForItem(group, item);
      return sum + findRowYearTotal(item, type, year);
    }, 0);
  };

  const taxRate = data.taxRate ?? 25;

  // Sections rendered inline to keep layout readable

  return (
    <div className="space-y-6">
      <SectionHeader
        title="P&L Yearly (Standard)"
        description="View yearly totals. Select one or multiple years."
        icon={DollarSign}
        actions={
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="text-xs">
              AUD
            </Badge>
            <div className="flex items-center gap-3">
              {availableYears.map((y) => (
                <label
                  key={`year-${y}`}
                  className="flex items-center gap-2 text-sm cursor-pointer select-none"
                >
                  <Checkbox
                    checked={selectedYears.includes(y)}
                    onCheckedChange={() => toggleYear(y)}
                    aria-label={`Toggle year ${y}`}
                  />
                  <span>{y}</span>
                </label>
              ))}
            </div>
          </div>
        }
      />

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="text-left p-2 min-w-[220px]">Line Item</th>
                {selectedYears.map((y) => (
                  <th key={`head-${y}`} className="text-right p-2">
                    {y}
                  </th>
                ))}
                <th className="text-right p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Income */}
              <tr className="bg-muted/30">
                <td className="p-2 font-semibold">1. Income</td>
                {selectedYears.map((y) => (
                  <td
                    key={`income-total-${y}`}
                    className="text-right p-2 font-semibold"
                  >
                    {formatCurrency(sumItemsByYear(INCOME_ITEMS, "income", y))}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce(
                      (acc, y) =>
                        acc + sumItemsByYear(INCOME_ITEMS, "income", y),
                      0
                    )
                  )}
                </td>
              </tr>
              {INCOME_ITEMS.map((item) => (
                <tr key={`income-${item}`} className="border-b">
                  <td className="p-2 text-muted-foreground">- {item}</td>
                  {selectedYears.map((y) => (
                    <td key={`income-${item}-${y}`} className="text-right p-2">
                      {formatCurrency(
                        findRowYearTotal(item, "sales_revenue", y)
                      )}
                    </td>
                  ))}
                  <td className="text-right p-2">
                    {formatCurrency(
                      selectedYears.reduce(
                        (acc, y) =>
                          acc + findRowYearTotal(item, "sales_revenue", y),
                        0
                      )
                    )}
                  </td>
                </tr>
              ))}

              {/* COGS */}
              <tr className="bg-muted/30">
                <td className="p-2 font-semibold">
                  2. Cost of Goods Sold (COGS)
                </td>
                {selectedYears.map((y) => (
                  <td
                    key={`cogs-total-${y}`}
                    className="text-right p-2 font-semibold"
                  >
                    {formatCurrency(sumItemsByYear(COGS_ITEMS, "cogs", y))}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce(
                      (acc, y) => acc + sumItemsByYear(COGS_ITEMS, "cogs", y),
                      0
                    )
                  )}
                </td>
              </tr>
              {COGS_ITEMS.map((item) => (
                <tr key={`cogs-${item}`} className="border-b">
                  <td className="p-2 text-muted-foreground">- {item}</td>
                  {selectedYears.map((y) => (
                    <td key={`cogs-${item}-${y}`} className="text-right p-2">
                      {formatCurrency(findRowYearTotal(item, "cogs", y))}
                    </td>
                  ))}
                  <td className="text-right p-2">
                    {formatCurrency(
                      selectedYears.reduce(
                        (acc, y) => acc + findRowYearTotal(item, "cogs", y),
                        0
                      )
                    )}
                  </td>
                </tr>
              ))}

              {/* Gross Profit */}
              <tr className="bg-muted/40">
                <td className="p-2 font-semibold">
                  Gross Profit = Income − COGS
                </td>
                {selectedYears.map((y) => {
                  const income = sumItemsByYear(INCOME_ITEMS, "income", y);
                  const cogs = sumItemsByYear(COGS_ITEMS, "cogs", y);
                  return (
                    <td
                      key={`gross-${y}`}
                      className="text-right p-2 font-semibold"
                    >
                      {formatCurrency(income - cogs)}
                    </td>
                  );
                })}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce((acc, y) => {
                      const income = sumItemsByYear(INCOME_ITEMS, "income", y);
                      const cogs = sumItemsByYear(COGS_ITEMS, "cogs", y);
                      return acc + (income - cogs);
                    }, 0)
                  )}
                </td>
              </tr>

              {/* Operating Expenses */}
              <tr className="bg-muted/30">
                <td className="p-2 font-semibold">3. Operating Expenses</td>
                {selectedYears.map((y) => (
                  <td
                    key={`opex-total-${y}`}
                    className="text-right p-2 font-semibold"
                  >
                    {formatCurrency(sumItemsByYear(OPEX_ITEMS, "opex", y))}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce(
                      (acc, y) => acc + sumItemsByYear(OPEX_ITEMS, "opex", y),
                      0
                    )
                  )}
                </td>
              </tr>
              {OPEX_ITEMS.map((item) => (
                <tr key={`opex-${item}`} className="border-b">
                  <td className="p-2 text-muted-foreground">{item}</td>
                  {selectedYears.map((y) => (
                    <td key={`opex-${item}-${y}`} className="text-right p-2">
                      {formatCurrency(
                        findRowYearTotal(item, "operating_expenses", y)
                      )}
                    </td>
                  ))}
                  <td className="text-right p-2">
                    {formatCurrency(
                      selectedYears.reduce(
                        (acc, y) =>
                          acc + findRowYearTotal(item, "operating_expenses", y),
                        0
                      )
                    )}
                  </td>
                </tr>
              ))}

              {/* EBIT */}
              <tr className="bg-muted/40">
                <td className="p-2 font-semibold">
                  Operating Profit (EBIT) = Gross Profit − Operating Expenses
                </td>
                {selectedYears.map((y) => {
                  const income = sumItemsByYear(INCOME_ITEMS, "income", y);
                  const cogs = sumItemsByYear(COGS_ITEMS, "cogs", y);
                  const opex = sumItemsByYear(OPEX_ITEMS, "opex", y);
                  return (
                    <td
                      key={`ebit-${y}`}
                      className="text-right p-2 font-semibold"
                    >
                      {formatCurrency(income - cogs - opex)}
                    </td>
                  );
                })}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce((acc, y) => {
                      const income = sumItemsByYear(INCOME_ITEMS, "income", y);
                      const cogs = sumItemsByYear(COGS_ITEMS, "cogs", y);
                      const opex = sumItemsByYear(OPEX_ITEMS, "opex", y);
                      return acc + (income - cogs - opex);
                    }, 0)
                  )}
                </td>
              </tr>

              {/* Other Income */}
              <tr className="bg-muted/30">
                <td className="p-2 font-semibold">4. Other Income</td>
                {selectedYears.map((y) => (
                  <td
                    key={`oi-total-${y}`}
                    className="text-right p-2 font-semibold"
                  >
                    {formatCurrency(
                      sumItemsByYear(OTHER_INCOME_ITEMS, "other_income", y)
                    )}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce(
                      (acc, y) =>
                        acc +
                        sumItemsByYear(OTHER_INCOME_ITEMS, "other_income", y),
                      0
                    )
                  )}
                </td>
              </tr>
              {OTHER_INCOME_ITEMS.map((item) => (
                <tr key={`other-income-${item}`} className="border-b">
                  <td className="p-2 text-muted-foreground">- {item}</td>
                  {selectedYears.map((y) => (
                    <td
                      key={`other-income-${item}-${y}`}
                      className="text-right p-2"
                    >
                      {formatCurrency(
                        findRowYearTotal(item, "other_income", y)
                      )}
                    </td>
                  ))}
                  <td className="text-right p-2">
                    {formatCurrency(
                      selectedYears.reduce(
                        (acc, y) =>
                          acc + findRowYearTotal(item, "other_income", y),
                        0
                      )
                    )}
                  </td>
                </tr>
              ))}

              {/* Other Expenses */}
              <tr className="bg-muted/30">
                <td className="p-2 font-semibold">5. Other Expenses</td>
                {selectedYears.map((y) => (
                  <td
                    key={`oe-total-${y}`}
                    className="text-right p-2 font-semibold"
                  >
                    {formatCurrency(
                      sumItemsByYear(OTHER_EXPENSE_ITEMS, "other_expenses", y)
                    )}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce(
                      (acc, y) =>
                        acc +
                        sumItemsByYear(
                          OTHER_EXPENSE_ITEMS,
                          "other_expenses",
                          y
                        ),
                      0
                    )
                  )}
                </td>
              </tr>
              {OTHER_EXPENSE_ITEMS.map((item) => (
                <tr key={`other-exp-${item}`} className="border-b">
                  <td className="p-2 text-muted-foreground">- {item}</td>
                  {selectedYears.map((y) => (
                    <td
                      key={`other-exp-${item}-${y}`}
                      className="text-right p-2"
                    >
                      {formatCurrency(
                        findRowYearTotal(
                          item,
                          item.toLowerCase().includes("interest expense")
                            ? "financial_expenses"
                            : "other_expenses",
                          y
                        )
                      )}
                    </td>
                  ))}
                  <td className="text-right p-2">
                    {formatCurrency(
                      selectedYears.reduce((acc, y) => {
                        const type = item
                          .toLowerCase()
                          .includes("interest expense")
                          ? "financial_expenses"
                          : "other_expenses";
                        return acc + findRowYearTotal(item, type, y);
                      }, 0)
                    )}
                  </td>
                </tr>
              ))}

              {/* NPBT */}
              <tr className="bg-muted/40">
                <td className="p-2 font-semibold">
                  Net Profit Before Tax = Operating Profit + Other Income −
                  Other Expenses
                </td>
                {selectedYears.map((y) => {
                  const revenue = sumItemsByYear(INCOME_ITEMS, "income", y);
                  const cogs = sumItemsByYear(COGS_ITEMS, "cogs", y);
                  const opex = sumItemsByYear(OPEX_ITEMS, "opex", y);
                  const ebit = revenue - cogs - opex;
                  const otherIncome = sumItemsByYear(
                    OTHER_INCOME_ITEMS,
                    "other_income",
                    y
                  );
                  const otherExpenses = sumItemsByYear(
                    OTHER_EXPENSE_ITEMS,
                    "other_expenses",
                    y
                  );
                  const npbt = ebit + otherIncome - otherExpenses;
                  return (
                    <td
                      key={`npbt-${y}`}
                      className="text-right p-2 font-semibold"
                    >
                      {formatCurrency(npbt)}
                    </td>
                  );
                })}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce((acc, y) => {
                      const revenue = sumItemsByYear(INCOME_ITEMS, "income", y);
                      const cogs = sumItemsByYear(COGS_ITEMS, "cogs", y);
                      const opex = sumItemsByYear(OPEX_ITEMS, "opex", y);
                      const ebit = revenue - cogs - opex;
                      const otherIncome = sumItemsByYear(
                        OTHER_INCOME_ITEMS,
                        "other_income",
                        y
                      );
                      const otherExpenses = sumItemsByYear(
                        OTHER_EXPENSE_ITEMS,
                        "other_expenses",
                        y
                      );
                      return acc + (ebit + otherIncome - otherExpenses);
                    }, 0)
                  )}
                </td>
              </tr>

              {/* Tax */}
              <tr className="bg-muted/30">
                <td className="p-2 font-semibold">Income Tax Expense</td>
                {selectedYears.map((y) => {
                  const revenue = sumItemsByYear(INCOME_ITEMS, "income", y);
                  const cogs = sumItemsByYear(COGS_ITEMS, "cogs", y);
                  const opex = sumItemsByYear(OPEX_ITEMS, "opex", y);
                  const ebit = revenue - cogs - opex;
                  const otherIncome = sumItemsByYear(
                    OTHER_INCOME_ITEMS,
                    "other_income",
                    y
                  );
                  const otherExpenses = sumItemsByYear(
                    OTHER_EXPENSE_ITEMS,
                    "other_expenses",
                    y
                  );
                  const npbt = ebit + otherIncome - otherExpenses;
                  const tax = npbt > 0 ? (npbt * taxRate) / 100 : 0;
                  return (
                    <td
                      key={`tax-${y}`}
                      className="text-right p-2 font-semibold"
                    >
                      {formatCurrency(tax)}
                    </td>
                  );
                })}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce((acc, y) => {
                      const revenue = sumItemsByYear(INCOME_ITEMS, "income", y);
                      const cogs = sumItemsByYear(COGS_ITEMS, "cogs", y);
                      const opex = sumItemsByYear(OPEX_ITEMS, "opex", y);
                      const ebit = revenue - cogs - opex;
                      const otherIncome = sumItemsByYear(
                        OTHER_INCOME_ITEMS,
                        "other_income",
                        y
                      );
                      const otherExpenses = sumItemsByYear(
                        OTHER_EXPENSE_ITEMS,
                        "other_expenses",
                        y
                      );
                      const npbt = ebit + otherIncome - otherExpenses;
                      const tax = npbt > 0 ? (npbt * taxRate) / 100 : 0;
                      return acc + tax;
                    }, 0)
                  )}
                </td>
              </tr>

              {/* NPAT */}
              <tr className="bg-muted/40">
                <td className="p-2 font-semibold">Net Profit After Tax</td>
                {selectedYears.map((y) => {
                  const revenue = sumItemsByYear(INCOME_ITEMS, "income", y);
                  const cogs = sumItemsByYear(COGS_ITEMS, "cogs", y);
                  const opex = sumItemsByYear(OPEX_ITEMS, "opex", y);
                  const ebit = revenue - cogs - opex;
                  const otherIncome = sumItemsByYear(
                    OTHER_INCOME_ITEMS,
                    "other_income",
                    y
                  );
                  const otherExpenses = sumItemsByYear(
                    OTHER_EXPENSE_ITEMS,
                    "other_expenses",
                    y
                  );
                  const npbt = ebit + otherIncome - otherExpenses;
                  const tax = npbt > 0 ? (npbt * taxRate) / 100 : 0;
                  const npat = npbt - tax;
                  return (
                    <td
                      key={`npat-${y}`}
                      className="text-right p-2 font-semibold"
                    >
                      {formatCurrency(npat)}
                    </td>
                  );
                })}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce((acc, y) => {
                      const revenue = sumItemsByYear(INCOME_ITEMS, "income", y);
                      const cogs = sumItemsByYear(COGS_ITEMS, "cogs", y);
                      const opex = sumItemsByYear(OPEX_ITEMS, "opex", y);
                      const ebit = revenue - cogs - opex;
                      const otherIncome = sumItemsByYear(
                        OTHER_INCOME_ITEMS,
                        "other_income",
                        y
                      );
                      const otherExpenses = sumItemsByYear(
                        OTHER_EXPENSE_ITEMS,
                        "other_expenses",
                        y
                      );
                      const npbt = ebit + otherIncome - otherExpenses;
                      const tax = npbt > 0 ? (npbt * taxRate) / 100 : 0;
                      return acc + (npbt - tax);
                    }, 0)
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
