"use client";

import {
  ArrowLeft,
  BarChart3,
  FileText,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { BalanceSheetInput } from "@/components/forecast/pl-statement/balance-sheet-input";
import { BalanceSheetYearlyView } from "@/components/forecast/pl-statement/balance-sheet-yearly-view";
import { Button } from "@/components/ui/button";
import { Dashboard } from "@/components/forecast/analytics/dashboard";
import { ForecastEngine } from "@/components/forecast/forecasting/forecast-engine";
import { KPIDashboard } from "@/components/forecast/analytics/kpi-dashboard";
import Link from "next/link";
import { MobileNav } from "@/components/forecast/mobile-nav";
import { PLStandardYearlyView } from "@/components/forecast/pl-statement/pl-standard-yearly-view";
import { Reports } from "@/components/forecast/reports/reports";
import { SimplePLInput } from "@/components/forecast/pl-statement/simple-pl-input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { toast } from "sonner";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";
import { useForecastDatabase } from "@/lib/forecast/hooks/use-forecast-database";
import { useHydration } from "@/lib/forecast/hooks/use-hydration";

type CategoryType =
  | "sales_revenue"
  | "cogs"
  | "gross_profit"
  | "operating_expenses"
  | "operating_profit"
  | "other_income"
  | "financial_expenses"
  | "other_expenses"
  | "net_profit_before_tax"
  | "income_tax_expense"
  | "net_profit_after_tax"
  | "calculated";

interface FinancialRow {
  id: string;
  name: string;
  type: CategoryType;
  categoryId: string;
  subcategoryId: string;
  order: number;
  values: Array<{
    value: number;
    year: number;
    month: number;
    date: string;
    isProjected: boolean;
  }>;
}

interface Subcategory {
  id: string;
  name: string;
  order: number;
  rows: FinancialRow[];
}

interface Category {
  id: string;
  name: string;
  type: CategoryType;
  order: number;
  isExpanded: boolean;
  subcategories: Subcategory[];
  isCalculated?: boolean;
  formula?: string;
}

interface FinancialData {
  categories: Category[];
  forecastPeriods: Array<{
    year: number;
    month: number;
    label: string;
    date: string;
  }>;
  lastUpdated: string;
  taxRate: number;
  targetIncome: number;
  balanceSheet: {
    accounts: Array<{
      id: string;
      name: string;
      section: string;
      order: number;
      values: Array<{
        value: number;
        year: number;
        month: number;
        date: string;
        isProjected: boolean;
      }>;
    }>;
  };
}

const rowHasNonZeroValue = (row: FinancialRow): boolean => {
  for (const value of row.values) {
    if (value.value !== 0) return true;
  }
  return false;
};

const subcategoryHasNonZeroRow = (subcategory: Subcategory): boolean => {
  for (const row of subcategory.rows) {
    if (rowHasNonZeroValue(row)) return true;
  }
  return false;
};

const categoryHasNonZeroData = (category: Category): boolean => {
  for (const subcategory of category.subcategories) {
    if (subcategoryHasNonZeroRow(subcategory)) return true;
  }
  return false;
};

const hasAnyNonZeroEntry = (data: FinancialData): boolean => {
  for (const category of data.categories) {
    if (categoryHasNonZeroData(category)) return true;
  }
  return false;
};

interface ForecastEditorPageProps {
  readonly params: Promise<{
    readonly id: string;
  }>;
}

export default function ForecastEditorPage({
  params,
}: ForecastEditorPageProps) {
  const { id } = React.use(params);
  const isHydrated = useHydration();
  const { data, getCategoryYearlyTotalByType } = useFinancialStore();
  const [activeTab, setActiveTab] = useState("input");
  const [currentForecast, setCurrentForecast] = useState<{
    id: string;
    name: string;
    companyName?: string;
    status: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const { getForecast, saveForecast } = useForecastDatabase();

  // Load forecast data on mount
  useEffect(() => {
    const loadForecast = async () => {
      try {
        setLoading(true);
        const { forecast, financialData } = await getForecast(id);
        setCurrentForecast(forecast);

        // Update the financial store with loaded data
        useFinancialStore.setState({ data: financialData });

        toast.success(`Loaded forecast: ${forecast.name}`);
      } catch (error) {
        console.error("Error loading forecast:", error);
        toast.error("Failed to load forecast");
        // Redirect back to forecasts page on error
        window.location.href = "/forecast";
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadForecast();
    }
  }, [id, getForecast]);

  // Save forecast data
  const handleSaveForecast = useCallback(
    async (showToast = true) => {
      if (!currentForecast) return;

      try {
        setSaving(true);
        await saveForecast(currentForecast.id, data);
        setLastSaved(new Date());
        if (showToast) {
          toast.success("Forecast saved successfully!");
        }
      } catch (error) {
        console.error("Error saving forecast:", error);
        if (showToast) {
          toast.error("Failed to save forecast");
        }
      } finally {
        setSaving(false);
      }
    },
    [currentForecast, data, saveForecast]
  );

  // Manual save only - no auto-save

  // Check if data is populated
  const hasData = useMemo(() => {
    return hasAnyNonZeroEntry(data);
  }, [data]);

  // Quick metrics for header
  const quickMetrics = useMemo(() => {
    if (!hasData) return null;

    const year = data.forecastPeriods[0]?.year ?? new Date().getFullYear();
    const revenue = getCategoryYearlyTotalByType("sales_revenue", year);
    const netProfit = getCategoryYearlyTotalByType(
      "net_profit_after_tax",
      year
    );
    const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    return {
      revenue: Math.round(revenue),
      netProfit: Math.round(netProfit),
      margin: Math.round(margin * 100) / 100,
    };
  }, [data, getCategoryYearlyTotalByType, hasData]);

  if (!isHydrated || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading forecast...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/forecast">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Forecasts
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  {currentForecast?.name}
                </h1>
                {currentForecast?.companyName && (
                  <p className="text-sm text-muted-foreground">
                    {currentForecast.companyName}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleSaveForecast(true)}
                  size="sm"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                {saving ? (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-primary"></div>
                    Saving...
                  </span>
                ) : lastSaved ? (
                  <span className="text-xs text-muted-foreground">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </span>
                ) : null}
              </div>
              {quickMetrics && (
                <>
                  <Badge variant="outline" className="hidden sm:flex">
                    Revenue: ${quickMetrics.revenue.toLocaleString()}
                  </Badge>
                  <Badge variant="outline" className="hidden sm:flex">
                    Net Profit: ${quickMetrics.netProfit.toLocaleString()}
                  </Badge>
                  <Badge variant="outline" className="hidden sm:flex">
                    Margin: {quickMetrics.margin}%
                  </Badge>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="w-full space-y-4 sm:space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4 sm:space-y-6 container mx-auto px-4 sm:px-6 pt-4 sm:pt-6"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 max-w-5xl mx-auto overflow-x-auto">
              <TabsTrigger
                value="input"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">Input Data</span>
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger
                value="kpis"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">KPIs</span>
              </TabsTrigger>
              <TabsTrigger
                value="forecast"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">Forecasting</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-4 sm:space-y-6 px-0">
              <div className="w-full ">
                <div className="flex items-center gap-2 px-6 pb-2">
                  <Tabs defaultValue="pl" className="w-full">
                    <TabsList className="grid grid-cols-2 w-full sm:w-auto justify-start">
                      <TabsTrigger
                        className="h-8 px-3 text-xs sm:text-sm"
                        value="pl"
                      >
                        Profit & Loss
                      </TabsTrigger>
                      <TabsTrigger
                        className="h-8 px-3 text-xs sm:text-sm"
                        value="balance"
                      >
                        Balance Sheet
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="pl" className="mt-4">
                      <Tabs defaultValue="pl-monthly" className="w-full">
                        <TabsList className="justify-start">
                          <TabsTrigger
                            className="h-7 px-2 text-xs"
                            value="pl-monthly"
                          >
                            Monthly
                          </TabsTrigger>
                          <TabsTrigger
                            className="h-7 px-2 text-xs"
                            value="pl-yearly"
                          >
                            Yearly
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="pl-monthly" className="mt-4">
                          <SimplePLInput forecastId={id} />
                        </TabsContent>
                        <TabsContent value="pl-yearly" className="mt-4">
                          <PLStandardYearlyView />
                        </TabsContent>
                      </Tabs>
                    </TabsContent>
                    <TabsContent value="balance" className="mt-4">
                      <Tabs defaultValue="bs-monthly" className="w-full">
                        <TabsList className="justify-start">
                          <TabsTrigger
                            className="h-7 px-2 text-xs"
                            value="bs-monthly"
                          >
                            Monthly
                          </TabsTrigger>
                          <TabsTrigger
                            className="h-7 px-2 text-xs"
                            value="bs-yearly"
                          >
                            Yearly
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="bs-monthly" className="mt-4">
                          <BalanceSheetInput />
                        </TabsContent>
                        <TabsContent value="bs-yearly" className="mt-4">
                          <BalanceSheetYearlyView />
                        </TabsContent>
                      </Tabs>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <BarChart3 className="h-5 w-5" />
                    Financial Dashboard
                  </CardTitle>
                  <CardDescription>
                    Comprehensive view of your financial performance with
                    real-time insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dashboard />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kpis" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Target className="h-5 w-5" />
                    KPI Analysis
                  </CardTitle>
                  <CardDescription>
                    Advanced key performance indicators and industry
                    benchmarking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <KPIDashboard />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forecast" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <TrendingUp className="h-5 w-5" />
                    Financial Forecasting
                  </CardTitle>
                  <CardDescription>
                    Generate future financial projections using advanced
                    forecasting methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ForecastEngine forecastId={id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <FileText className="h-5 w-5" />
                    Financial Reports
                  </CardTitle>
                  <CardDescription>
                    Generate professional financial reports with customizable
                    settings and PDF export
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Reports />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
