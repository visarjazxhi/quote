"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import type { BalanceSheetSection } from "@/lib/forecast/types/financial";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/ui/section-header";
import { TriangleAlert } from "lucide-react";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

const SECTIONS: Array<{ key: BalanceSheetSection; title: string }> = [
  { key: "current_assets", title: "Current Assets" },
  { key: "non_current_assets", title: "Non-Current Assets" },
  { key: "current_liabilities", title: "Current Liabilities" },
  { key: "non_current_liabilities", title: "Non-Current Liabilities" },
  { key: "equity", title: "Equity" },
];

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

export function BalanceSheetInput() {
  const { data, updateBalanceSheetValue, getBalanceSheetTotals } =
    useFinancialStore();
  const months = monthNames();
  const [year, setYear] = useState<number>(
    () => data.forecastPeriods[0]?.year ?? new Date().getFullYear()
  );

  const years = useMemo(() => {
    const ys = new Set<number>();
    data.forecastPeriods.forEach((p) => ys.add(p.year));
    return Array.from(ys).sort((a, b) => b - a);
  }, [data.forecastPeriods]);

  const totals = getBalanceSheetTotals(year);
  const equationOk =
    Math.round(totals.totalLiabilities + totals.totalEquity) ===
    Math.round(totals.totalAssets);
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-AU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const itemsBySection = useMemo(() => {
    const by: Record<BalanceSheetSection, string[]> = {
      current_assets: [],
      non_current_assets: [],
      current_liabilities: [],
      non_current_liabilities: [],
      equity: [],
    };
    SECTIONS.forEach((s) => {
      const names = data.balanceSheet.accounts
        .filter((a) => a.section === s.key)
        .sort((a, b) => a.order - b.order)
        .map((a) => a.name);
      by[s.key] = names;
    });
    return by;
  }, [data.balanceSheet.accounts]);

  const getCellValue = useCallback(
    (section: BalanceSheetSection, itemName: string, month: number): number => {
      const account = data.balanceSheet.accounts.find(
        (a) =>
          a.section === section &&
          a.name.trim().toLowerCase() === itemName.trim().toLowerCase()
      );
      if (!account) return 0;
      const v = account.values.find(
        (val) => val.year === year && val.month === month
      );
      return v?.value ?? 0;
    },
    [data.balanceSheet.accounts, year]
  );

  const setCellValue = useCallback(
    (
      section: BalanceSheetSection,
      itemName: string,
      month: number,
      inputValue: number
    ) => {
      const account = data.balanceSheet.accounts.find(
        (a) =>
          a.section === section &&
          a.name.trim().toLowerCase() === itemName.trim().toLowerCase()
      );
      if (!account) return;
      const index = account.values.findIndex(
        (v) => v.year === year && v.month === month
      );
      if (index === -1) return;
      updateBalanceSheetValue(account.id, index, inputValue);
    },
    [data.balanceSheet.accounts, updateBalanceSheetValue, year]
  );

  const GroupTable = ({
    title,
    items,
    section,
  }: {
    title: string;
    items: readonly string[];
    section: BalanceSheetSection;
  }) => {
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const focusKey = (item: string, month: number) =>
      `${section}-${item}-${month}`;
    const totalsByMonth = months.map((_, mIdx) =>
      items.reduce(
        (sum, item) => sum + getCellValue(section, item, mIdx + 1),
        0
      )
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
                    <td className="p-2 text-muted-foreground">- {item}</td>
                    {months.map((m, mIdx) => {
                      const monthNumber = mIdx + 1;
                      const val = getCellValue(section, item, monthNumber);
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
                            defaultValue={val === 0 ? "" : formatNumber(val)}
                            onWheel={(e) => {
                              const target =
                                e.currentTarget as HTMLInputElement;
                              target.blur();
                              e.preventDefault();
                            }}
                            onBlur={(e) => {
                              const input = e.currentTarget as HTMLInputElement;
                              const raw = input.value.replace(/,/g, "").trim();
                              const parsed = parseFloat(raw || "0");
                              const safeNum = isNaN(parsed) ? 0 : parsed;
                              requestAnimationFrame(() => {
                                setCellValue(
                                  section,
                                  item,
                                  monthNumber,
                                  safeNum
                                );
                                try {
                                  input.value =
                                    safeNum === 0 ? "" : formatNumber(safeNum);
                                } catch {}
                              });
                            }}
                          />
                        </td>
                      );
                    })}
                    <td className="text-right p-2 font-semibold">
                      {formatCurrency(
                        months.reduce(
                          (sum, _, mIdx) =>
                            sum + getCellValue(section, item, mIdx + 1),
                          0
                        )
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

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Balance Sheet Input"
        description="Enter monthly balances for assets, liabilities and equity."
        icon={TriangleAlert}
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
                {(years.length ? years : [year]).map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      {!equationOk && (
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Accounting equation not balanced</AlertTitle>
          <AlertDescription>
            Total Liabilities + Total Equity must equal Total Assets. Current
            totals for {year}: Assets {formatCurrency(totals.totalAssets)},
            Liabilities {formatCurrency(totals.totalLiabilities)}, Equity{" "}
            {formatCurrency(totals.totalEquity)}.
          </AlertDescription>
        </Alert>
      )}

      <GroupTable
        title="1. Current Assets"
        items={itemsBySection.current_assets}
        section="current_assets"
      />
      <GroupTable
        title="2. Non-Current Assets"
        items={itemsBySection.non_current_assets}
        section="non_current_assets"
      />
      <GroupTable
        title="3. Current Liabilities"
        items={itemsBySection.current_liabilities}
        section="current_liabilities"
      />
      <GroupTable
        title="4. Non-Current Liabilities"
        items={itemsBySection.non_current_liabilities}
        section="non_current_liabilities"
      />
      <GroupTable
        title="5. Equity"
        items={itemsBySection.equity}
        section="equity"
      />

      <Card className="bg-muted/40">
        <CardHeader>
          <CardTitle className="text-base">Balance Summary ({year})</CardTitle>
        </CardHeader>
        <CardContent className="py-3 overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: "60%" }} />
              <col style={{ width: "40%" }} />
            </colgroup>
            <tbody>
              <tr>
                <td className="p-2 font-semibold">Total Assets</td>
                <td className="text-right p-2 font-bold">
                  {formatCurrency(totals.totalAssets)}
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Total Liabilities</td>
                <td className="text-right p-2 font-bold">
                  {formatCurrency(totals.totalLiabilities)}
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Total Equity</td>
                <td className="text-right p-2 font-bold">
                  {formatCurrency(totals.totalEquity)}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
