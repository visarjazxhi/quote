"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import type { BalanceSheetSection } from "@/lib/forecast/types/financial";
import { Building2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionHeader } from "@/components/ui/section-header";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function BalanceSheetYearlyView() {
  const { data } = useFinancialStore();

  const availableYears = useMemo(() => {
    const set = new Set<number>();
    data.balanceSheet.accounts.forEach((acc) =>
      acc.values.forEach((v) => set.add(v.year))
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

  const itemsBySection = useMemo(() => {
    const make = (section: BalanceSheetSection): string[] =>
      data.balanceSheet.accounts
        .filter((a) => a.section === section)
        .sort((a, b) => a.order - b.order)
        .map((a) => a.name);
    return {
      current_assets: make("current_assets"),
      non_current_assets: make("non_current_assets"),
      current_liabilities: make("current_liabilities"),
      non_current_liabilities: make("non_current_liabilities"),
      equity: make("equity"),
    };
  }, [data.balanceSheet.accounts]);

  const findAccountYearTotal = (
    section: BalanceSheetSection,
    name: string,
    year: number
  ): number => {
    const acc = data.balanceSheet.accounts.find(
      (a) =>
        a.section === section &&
        a.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (!acc) return 0;
    return acc.values
      .filter((v) => v.year === year)
      .reduce((sum, v) => sum + v.value, 0);
  };

  const sumAccountsByYear = (
    section: BalanceSheetSection,
    names: readonly string[],
    year: number
  ): number => {
    return names.reduce(
      (sum, name) => sum + findAccountYearTotal(section, name, year),
      0
    );
  };

  const totalAssetsForYear = (year: number) =>
    sumAccountsByYear("current_assets", itemsBySection.current_assets, year) +
    sumAccountsByYear(
      "non_current_assets",
      itemsBySection.non_current_assets,
      year
    );

  const totalLiabilitiesForYear = (year: number) =>
    sumAccountsByYear(
      "current_liabilities",
      itemsBySection.current_liabilities,
      year
    ) +
    sumAccountsByYear(
      "non_current_liabilities",
      itemsBySection.non_current_liabilities,
      year
    );

  const totalEquityForYear = (year: number) =>
    sumAccountsByYear("equity", itemsBySection.equity, year);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Balance Sheet Yearly"
        description="View yearly totals for assets, liabilities, and equity. Select one or multiple years."
        icon={Building2}
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
              {/* Assets */}
              <tr className="bg-muted/30">
                <td className="p-2 font-semibold">1. Current Assets</td>
                {selectedYears.map((y) => (
                  <td
                    key={`ca-total-${y}`}
                    className="text-right p-2 font-semibold"
                  >
                    {formatCurrency(
                      sumAccountsByYear(
                        "current_assets",
                        itemsBySection.current_assets,
                        y
                      )
                    )}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce(
                      (acc, y) =>
                        acc +
                        sumAccountsByYear(
                          "current_assets",
                          itemsBySection.current_assets,
                          y
                        ),
                      0
                    )
                  )}
                </td>
              </tr>
              {itemsBySection.current_assets.map((name) => (
                <tr key={`ca-${name}`} className="border-b">
                  <td className="p-2 text-muted-foreground">- {name}</td>
                  {selectedYears.map((y) => (
                    <td key={`ca-${name}-${y}`} className="text-right p-2">
                      {formatCurrency(
                        findAccountYearTotal("current_assets", name, y)
                      )}
                    </td>
                  ))}
                  <td className="text-right p-2">
                    {formatCurrency(
                      selectedYears.reduce(
                        (acc, y) =>
                          acc + findAccountYearTotal("current_assets", name, y),
                        0
                      )
                    )}
                  </td>
                </tr>
              ))}

              <tr className="bg-muted/30">
                <td className="p-2 font-semibold">2. Non-Current Assets</td>
                {selectedYears.map((y) => (
                  <td
                    key={`nca-total-${y}`}
                    className="text-right p-2 font-semibold"
                  >
                    {formatCurrency(
                      sumAccountsByYear(
                        "non_current_assets",
                        itemsBySection.non_current_assets,
                        y
                      )
                    )}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce(
                      (acc, y) =>
                        acc +
                        sumAccountsByYear(
                          "non_current_assets",
                          itemsBySection.non_current_assets,
                          y
                        ),
                      0
                    )
                  )}
                </td>
              </tr>
              {itemsBySection.non_current_assets.map((name) => (
                <tr key={`nca-${name}`} className="border-b">
                  <td className="p-2 text-muted-foreground">- {name}</td>
                  {selectedYears.map((y) => (
                    <td key={`nca-${name}-${y}`} className="text-right p-2">
                      {formatCurrency(
                        findAccountYearTotal("non_current_assets", name, y)
                      )}
                    </td>
                  ))}
                  <td className="text-right p-2">
                    {formatCurrency(
                      selectedYears.reduce(
                        (acc, y) =>
                          acc +
                          findAccountYearTotal("non_current_assets", name, y),
                        0
                      )
                    )}
                  </td>
                </tr>
              ))}

              <tr className="bg-muted/40">
                <td className="p-2 font-semibold">Total Assets</td>
                {selectedYears.map((y) => (
                  <td
                    key={`assets-${y}`}
                    className="text-right p-2 font-semibold"
                  >
                    {formatCurrency(totalAssetsForYear(y))}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce(
                      (acc, y) => acc + totalAssetsForYear(y),
                      0
                    )
                  )}
                </td>
              </tr>

              {/* Liabilities */}
              <tr className="bg-muted/30">
                <td className="p-2 font-semibold">3. Current Liabilities</td>
                {selectedYears.map((y) => (
                  <td
                    key={`cl-total-${y}`}
                    className="text-right p-2 font-semibold"
                  >
                    {formatCurrency(
                      sumAccountsByYear(
                        "current_liabilities",
                        itemsBySection.current_liabilities,
                        y
                      )
                    )}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce(
                      (acc, y) =>
                        acc +
                        sumAccountsByYear(
                          "current_liabilities",
                          itemsBySection.current_liabilities,
                          y
                        ),
                      0
                    )
                  )}
                </td>
              </tr>
              {itemsBySection.current_liabilities.map((name) => (
                <tr key={`cl-${name}`} className="border-b">
                  <td className="p-2 text-muted-foreground">- {name}</td>
                  {selectedYears.map((y) => (
                    <td key={`cl-${name}-${y}`} className="text-right p-2">
                      {formatCurrency(
                        findAccountYearTotal("current_liabilities", name, y)
                      )}
                    </td>
                  ))}
                  <td className="text-right p-2">
                    {formatCurrency(
                      selectedYears.reduce(
                        (acc, y) =>
                          acc +
                          findAccountYearTotal("current_liabilities", name, y),
                        0
                      )
                    )}
                  </td>
                </tr>
              ))}

              <tr className="bg-muted/30">
                <td className="p-2 font-semibold">
                  4. Non-Current Liabilities
                </td>
                {selectedYears.map((y) => (
                  <td
                    key={`ncl-total-${y}`}
                    className="text-right p-2 font-semibold"
                  >
                    {formatCurrency(
                      sumAccountsByYear(
                        "non_current_liabilities",
                        itemsBySection.non_current_liabilities,
                        y
                      )
                    )}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce(
                      (acc, y) =>
                        acc +
                        sumAccountsByYear(
                          "non_current_liabilities",
                          itemsBySection.non_current_liabilities,
                          y
                        ),
                      0
                    )
                  )}
                </td>
              </tr>
              {itemsBySection.non_current_liabilities.map((name) => (
                <tr key={`ncl-${name}`} className="border-b">
                  <td className="p-2 text-muted-foreground">- {name}</td>
                  {selectedYears.map((y) => (
                    <td key={`ncl-${name}-${y}`} className="text-right p-2">
                      {formatCurrency(
                        findAccountYearTotal("non_current_liabilities", name, y)
                      )}
                    </td>
                  ))}
                  <td className="text-right p-2">
                    {formatCurrency(
                      selectedYears.reduce(
                        (acc, y) =>
                          acc +
                          findAccountYearTotal(
                            "non_current_liabilities",
                            name,
                            y
                          ),
                        0
                      )
                    )}
                  </td>
                </tr>
              ))}

              <tr className="bg-muted/40">
                <td className="p-2 font-semibold">Total Liabilities</td>
                {selectedYears.map((y) => (
                  <td
                    key={`liab-${y}`}
                    className="text-right p-2 font-semibold"
                  >
                    {formatCurrency(totalLiabilitiesForYear(y))}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce(
                      (acc, y) => acc + totalLiabilitiesForYear(y),
                      0
                    )
                  )}
                </td>
              </tr>

              {/* Equity */}
              <tr className="bg-muted/30">
                <td className="p-2 font-semibold">5. Equity</td>
                {selectedYears.map((y) => (
                  <td
                    key={`eq-total-${y}`}
                    className="text-right p-2 font-semibold"
                  >
                    {formatCurrency(
                      sumAccountsByYear("equity", itemsBySection.equity, y)
                    )}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce(
                      (acc, y) =>
                        acc +
                        sumAccountsByYear("equity", itemsBySection.equity, y),
                      0
                    )
                  )}
                </td>
              </tr>
              {itemsBySection.equity.map((name) => (
                <tr key={`eq-${name}`} className="border-b">
                  <td className="p-2 text-muted-foreground">- {name}</td>
                  {selectedYears.map((y) => (
                    <td key={`eq-${name}-${y}`} className="text-right p-2">
                      {formatCurrency(findAccountYearTotal("equity", name, y))}
                    </td>
                  ))}
                  <td className="text-right p-2">
                    {formatCurrency(
                      selectedYears.reduce(
                        (acc, y) =>
                          acc + findAccountYearTotal("equity", name, y),
                        0
                      )
                    )}
                  </td>
                </tr>
              ))}

              {/* Equation check */}
              <tr className="bg-muted/40">
                <td className="p-2 font-semibold">Liabilities + Equity</td>
                {selectedYears.map((y) => (
                  <td key={`le-${y}`} className="text-right p-2 font-semibold">
                    {formatCurrency(
                      totalLiabilitiesForYear(y) + totalEquityForYear(y)
                    )}
                  </td>
                ))}
                <td className="text-right p-2 font-bold">
                  {formatCurrency(
                    selectedYears.reduce(
                      (acc, y) =>
                        acc +
                        totalLiabilitiesForYear(y) +
                        totalEquityForYear(y),
                      0
                    )
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
