"use client";

import {
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

interface CashFlowConfig {
  // Working Capital Assumptions
  daysInReceivables: number; // Days to collect receivables
  daysInPayables: number; // Days to pay suppliers
  daysInInventory: number; // Days inventory on hand

  // Cash Flow Timing
  salesCollectionDelay: number; // Months delay in collecting sales
  expensePaymentTiming: number; // Months delay in paying expenses

  // Investment & Financing
  capexSchedule: { month: number; amount: number; description: string }[];
  loanPayments: {
    month: number;
    amount: number;
    type: "principal" | "interest";
  }[];

  // Cash Management
  minimumCashBalance: number;
  creditLineLimit: number;
  interestRateOnCredit: number; // Annual rate
}

interface CashFlowProjection {
  month: number;
  year: number;
  date: string;

  // Operating Cash Flow
  cashFromSales: number;
  cashForCogs: number;
  cashForOpex: number;
  operatingCashFlow: number;

  // Working Capital Changes
  receivablesChange: number;
  payablesChange: number;
  inventoryChange: number;
  workingCapitalChange: number;

  // Investing Cash Flow
  capex: number;
  investingCashFlow: number;

  // Financing Cash Flow
  loanPayments: number;
  interestPayments: number;
  creditLineDrawings: number;
  financingCashFlow: number;

  // Summary
  netCashFlow: number;
  cumulativeCashFlow: number;
  cashBalance: number;
  creditLineUsed: number;

  // Ratios
  cashConversionCycle: number;
  operatingCashMargin: number;
}

export function CashFlowForecast() {
  const { data } = useFinancialStore();

  const [config, setConfig] = useState<CashFlowConfig>({
    daysInReceivables: 45,
    daysInPayables: 30,
    daysInInventory: 60,
    salesCollectionDelay: 1,
    expensePaymentTiming: 0,
    capexSchedule: [
      { month: 6, amount: 50000, description: "Equipment upgrade" },
      { month: 12, amount: 25000, description: "Software licenses" },
    ],
    loanPayments: [
      { month: 3, amount: 10000, type: "principal" },
      { month: 6, amount: 10000, type: "principal" },
      { month: 9, amount: 10000, type: "principal" },
      { month: 12, amount: 10000, type: "principal" },
    ],
    minimumCashBalance: 50000,
    creditLineLimit: 100000,
    interestRateOnCredit: 0.08,
  });

  // Extract revenue and expense data from financial model
  const financialData = useMemo(() => {
    const monthlyRevenue: number[] = [];
    const monthlyCogs: number[] = [];
    const monthlyOpex: number[] = [];

    // Use the model's first forecast year for alignment
    const currentYear =
      data.forecastPeriods[0]?.year || new Date().getFullYear();

    for (let i = 0; i < 12; i++) {
      let revenue = 0;
      let cogs = 0;
      let opex = 0;

      data.categories.forEach((category) => {
        if (!category.isCalculated) {
          const categoryTotal = category.subcategories.reduce(
            (catSum, sub) =>
              catSum +
              sub.rows.reduce((subSum, row) => {
                const value = row.values.find(
                  (v) => v.year === currentYear && v.month === i + 1
                );
                return subSum + (value?.value || 0);
              }, 0),
            0
          );

          if (category.type === "sales_revenue") revenue += categoryTotal;
          else if (category.type === "cogs") cogs += categoryTotal;
          else if (category.type === "operating_expenses")
            opex += categoryTotal;
        }
      });

      monthlyRevenue.push(revenue);
      monthlyCogs.push(cogs);
      monthlyOpex.push(opex);
    }

    return { monthlyRevenue, monthlyCogs, monthlyOpex };
  }, [data]);

  // Calculate cash flow projections
  const cashFlowProjections = useMemo<CashFlowProjection[]>(() => {
    const projections: CashFlowProjection[] = [];
    const currentYear = new Date().getFullYear();
    let cumulativeCash = 100000; // Starting cash balance
    let creditLineUsed = 0;

    for (let month = 1; month <= 12; month++) {
      const monthIndex = month - 1;
      const date = new Date(currentYear, month - 1, 1);

      // Operating Cash Flow
      const revenue = financialData.monthlyRevenue[monthIndex] || 0;
      const cogs = financialData.monthlyCogs[monthIndex] || 0;

      // Apply collection delay for sales
      const collectionMonth = Math.max(
        0,
        monthIndex - config.salesCollectionDelay
      );
      const cashFromSales =
        collectionMonth < financialData.monthlyRevenue.length
          ? financialData.monthlyRevenue[collectionMonth]
          : 0;

      // Apply payment timing for expenses
      const paymentMonth = Math.max(
        0,
        monthIndex - config.expensePaymentTiming
      );
      const cashForCogs =
        paymentMonth < financialData.monthlyCogs.length
          ? financialData.monthlyCogs[paymentMonth]
          : 0;
      const cashForOpex =
        paymentMonth < financialData.monthlyOpex.length
          ? financialData.monthlyOpex[paymentMonth]
          : 0;

      const operatingCashFlow = cashFromSales - cashForCogs - cashForOpex;

      // Working Capital Changes
      const dailyRevenue = revenue / 30;
      const dailyCogs = cogs / 30;

      const currentReceivables = dailyRevenue * config.daysInReceivables;
      const previousReceivables =
        monthIndex > 0
          ? (financialData.monthlyRevenue[monthIndex - 1] / 30) *
            config.daysInReceivables
          : 0;
      const receivablesChange = currentReceivables - previousReceivables;

      const currentPayables = dailyCogs * config.daysInPayables;
      const previousPayables =
        monthIndex > 0
          ? (financialData.monthlyCogs[monthIndex - 1] / 30) *
            config.daysInPayables
          : 0;
      const payablesChange = currentPayables - previousPayables;

      const currentInventory = dailyCogs * config.daysInInventory;
      const previousInventory =
        monthIndex > 0
          ? (financialData.monthlyCogs[monthIndex - 1] / 30) *
            config.daysInInventory
          : 0;
      const inventoryChange = currentInventory - previousInventory;

      const workingCapitalChange =
        receivablesChange + inventoryChange - payablesChange;

      // Investing Cash Flow
      const capex = config.capexSchedule
        .filter((item) => item.month === month)
        .reduce((sum, item) => sum + item.amount, 0);
      const investingCashFlow = -capex;

      // Financing Cash Flow
      const principalPayments = config.loanPayments
        .filter((item) => item.month === month && item.type === "principal")
        .reduce((sum, item) => sum + item.amount, 0);

      const interestPayments = config.loanPayments
        .filter((item) => item.month === month && item.type === "interest")
        .reduce((sum, item) => sum + item.amount, 0);

      // Calculate net cash flow before credit line
      const netCashFlowBeforeCredit =
        operatingCashFlow -
        workingCapitalChange +
        investingCashFlow -
        principalPayments -
        interestPayments;

      // Update cumulative cash and credit line
      let newCumulativeCash = cumulativeCash + netCashFlowBeforeCredit;
      let newCreditLineUsed = creditLineUsed;
      let creditLineDrawings = 0;

      // Check if cash falls below minimum
      if (newCumulativeCash < config.minimumCashBalance) {
        const cashNeeded = config.minimumCashBalance - newCumulativeCash;
        const availableCredit = config.creditLineLimit - creditLineUsed;
        creditLineDrawings = Math.min(cashNeeded, availableCredit);
        newCreditLineUsed += creditLineDrawings;
        newCumulativeCash += creditLineDrawings;
      }

      // Apply interest on credit line
      const monthlyInterestRate = config.interestRateOnCredit / 12;
      const creditInterest = newCreditLineUsed * monthlyInterestRate;
      newCumulativeCash -= creditInterest;

      const financingCashFlow =
        creditLineDrawings -
        principalPayments -
        interestPayments -
        creditInterest;
      const netCashFlow =
        operatingCashFlow -
        workingCapitalChange +
        investingCashFlow +
        financingCashFlow;

      // Calculate ratios
      const cashConversionCycle =
        config.daysInReceivables +
        config.daysInInventory -
        config.daysInPayables;
      const operatingCashMargin =
        revenue > 0 ? (operatingCashFlow / revenue) * 100 : 0;

      projections.push({
        month,
        year: currentYear,
        date: date.toISOString().split("T")[0],
        cashFromSales,
        cashForCogs,
        cashForOpex,
        operatingCashFlow,
        receivablesChange,
        payablesChange,
        inventoryChange,
        workingCapitalChange,
        capex,
        investingCashFlow,
        loanPayments: principalPayments,
        interestPayments: interestPayments + creditInterest,
        creditLineDrawings,
        financingCashFlow,
        netCashFlow,
        cumulativeCashFlow: newCumulativeCash,
        cashBalance: newCumulativeCash,
        creditLineUsed: newCreditLineUsed,
        cashConversionCycle,
        operatingCashMargin,
      });

      cumulativeCash = newCumulativeCash;
      creditLineUsed = newCreditLineUsed;
    }

    return projections;
  }, [financialData, config]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getColorForCashFlow = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const cashFlowChartData = cashFlowProjections.map((p) => ({
    month: `${p.year}-${p.month.toString().padStart(2, "0")}`,
    operating: p.operatingCashFlow,
    investing: p.investingCashFlow,
    financing: p.financingCashFlow,
    net: p.netCashFlow,
    cumulative: p.cumulativeCashFlow,
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cash Flow Forecasting & Working Capital Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="forecast" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="forecast">Cash Flow</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="working-capital">Working Capital</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="forecast" className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {formatCurrency(
                          cashFlowProjections[cashFlowProjections.length - 1]
                            ?.cashBalance || 0
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Ending Cash Balance
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {formatCurrency(
                          cashFlowProjections.reduce(
                            (sum, p) => sum + p.operatingCashFlow,
                            0
                          )
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Operating Cash
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {Math.max(
                          ...cashFlowProjections.map((p) => p.creditLineUsed)
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Peak Credit Line Usage
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {Math.round(
                          cashFlowProjections.reduce(
                            (sum, p) => sum + p.cashConversionCycle,
                            0
                          ) / cashFlowProjections.length
                        )}{" "}
                        days
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Avg Cash Conversion Cycle
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cash Flow Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Cash Flow Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cashFlowChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis
                          tickFormatter={(value) => formatCurrency(value)}
                        />
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
                          cursor={{ fill: "rgba(34, 197, 94, 0.1)" }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="operating"
                          stackId="1"
                          stroke="#22c55e"
                          fill="#22c55e"
                          fillOpacity={0.6}
                          name="Operating"
                        />
                        <Area
                          type="monotone"
                          dataKey="investing"
                          stackId="1"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.6}
                          name="Investing"
                        />
                        <Area
                          type="monotone"
                          dataKey="financing"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                          name="Financing"
                        />
                        <Line
                          type="monotone"
                          dataKey="cumulative"
                          stroke="#8b5cf6"
                          strokeWidth={3}
                          name="Cumulative Cash"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Monthly Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Cash Flow Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Month</th>
                          <th className="text-right p-2">Operating CF</th>
                          <th className="text-right p-2">Working Capital Δ</th>
                          <th className="text-right p-2">Investing CF</th>
                          <th className="text-right p-2">Financing CF</th>
                          <th className="text-right p-2">Net CF</th>
                          <th className="text-right p-2">Cash Balance</th>
                          <th className="text-right p-2">Credit Used</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cashFlowProjections.map((projection) => (
                          <tr
                            key={projection.month}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="p-2 font-medium">
                              {projection.year}-
                              {projection.month.toString().padStart(2, "0")}
                            </td>
                            <td
                              className={`text-right p-2 ${getColorForCashFlow(
                                projection.operatingCashFlow
                              )}`}
                            >
                              {formatCurrency(projection.operatingCashFlow)}
                            </td>
                            <td
                              className={`text-right p-2 ${getColorForCashFlow(
                                -projection.workingCapitalChange
                              )}`}
                            >
                              {formatCurrency(-projection.workingCapitalChange)}
                            </td>
                            <td
                              className={`text-right p-2 ${getColorForCashFlow(
                                projection.investingCashFlow
                              )}`}
                            >
                              {formatCurrency(projection.investingCashFlow)}
                            </td>
                            <td
                              className={`text-right p-2 ${getColorForCashFlow(
                                projection.financingCashFlow
                              )}`}
                            >
                              {formatCurrency(projection.financingCashFlow)}
                            </td>
                            <td
                              className={`text-right p-2 font-medium ${getColorForCashFlow(
                                projection.netCashFlow
                              )}`}
                            >
                              {formatCurrency(projection.netCashFlow)}
                            </td>
                            <td className="text-right p-2 font-medium">
                              {formatCurrency(projection.cashBalance)}
                            </td>
                            <td className="text-right p-2">
                              {formatCurrency(projection.creditLineUsed)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="config" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Working Capital Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Working Capital Assumptions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Days in Receivables</Label>
                        <Slider
                          value={[config.daysInReceivables]}
                          onValueChange={([value]) =>
                            setConfig({ ...config, daysInReceivables: value })
                          }
                          min={15}
                          max={90}
                          step={5}
                          className="w-full"
                        />
                        <div className="text-center text-sm text-muted-foreground">
                          {config.daysInReceivables} days
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Days in Payables</Label>
                        <Slider
                          value={[config.daysInPayables]}
                          onValueChange={([value]) =>
                            setConfig({ ...config, daysInPayables: value })
                          }
                          min={15}
                          max={60}
                          step={5}
                          className="w-full"
                        />
                        <div className="text-center text-sm text-muted-foreground">
                          {config.daysInPayables} days
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Days in Inventory</Label>
                        <Slider
                          value={[config.daysInInventory]}
                          onValueChange={([value]) =>
                            setConfig({ ...config, daysInInventory: value })
                          }
                          min={15}
                          max={120}
                          step={5}
                          className="w-full"
                        />
                        <div className="text-center text-sm text-muted-foreground">
                          {config.daysInInventory} days
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cash Management Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Cash Management</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Minimum Cash Balance</Label>
                        <Input
                          type="number"
                          value={config.minimumCashBalance}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              minimumCashBalance: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Credit Line Limit</Label>
                        <Input
                          type="number"
                          value={config.creditLineLimit}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              creditLineLimit: Number(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Credit Interest Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={config.interestRateOnCredit * 100}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              interestRateOnCredit:
                                Number(e.target.value) / 100,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Timing Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Cash Flow Timing</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Sales Collection Delay (months)</Label>
                        <Select
                          value={config.salesCollectionDelay.toString()}
                          onValueChange={(value) =>
                            setConfig({
                              ...config,
                              salesCollectionDelay: Number(value),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Same month</SelectItem>
                            <SelectItem value="1">1 month delay</SelectItem>
                            <SelectItem value="2">2 months delay</SelectItem>
                            <SelectItem value="3">3 months delay</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Expense Payment Timing (months)</Label>
                        <Select
                          value={config.expensePaymentTiming.toString()}
                          onValueChange={(value) =>
                            setConfig({
                              ...config,
                              expensePaymentTiming: Number(value),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Same month</SelectItem>
                            <SelectItem value="1">1 month delay</SelectItem>
                            <SelectItem value="2">2 months delay</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="working-capital" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Working Capital Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {config.daysInReceivables +
                          config.daysInInventory -
                          config.daysInPayables}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Cash Conversion Cycle (days)
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {formatCurrency(
                          cashFlowProjections.reduce(
                            (sum, p) => sum + Math.abs(p.workingCapitalChange),
                            0
                          )
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total WC Investment
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {(
                          cashFlowProjections.reduce(
                            (sum, p) => sum + p.operatingCashMargin,
                            0
                          ) / cashFlowProjections.length
                        ).toFixed(1)}
                        %
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Avg Operating Cash Margin
                      </div>
                    </div>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={cashFlowProjections.map((p) => ({
                          month: `${p.month}`,
                          cycle: p.cashConversionCycle,
                          margin: p.operatingCashMargin,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            name.includes("Cycle")
                              ? `${value.toFixed(0)} days`
                              : `${value.toFixed(1)}%`,
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
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="cycle"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Cash Conversion Cycle (days)"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="margin"
                          stroke="#ef4444"
                          strokeWidth={2}
                          name="Operating Cash Margin (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Cash Flow Health Check
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(() => {
                      const minCash = Math.min(
                        ...cashFlowProjections.map((p) => p.cashBalance)
                      );
                      const maxCredit = Math.max(
                        ...cashFlowProjections.map((p) => p.creditLineUsed)
                      );
                      const avgOperatingCash =
                        cashFlowProjections.reduce(
                          (sum, p) => sum + p.operatingCashFlow,
                          0
                        ) / 12;

                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <span>Minimum Cash Balance</span>
                            <div className="flex items-center gap-2">
                              {minCash >= config.minimumCashBalance ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                              )}
                              <span
                                className={
                                  minCash >= config.minimumCashBalance
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {formatCurrency(minCash)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>Credit Line Utilization</span>
                            <div className="flex items-center gap-2">
                              {maxCredit / config.creditLineLimit <= 0.8 ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-orange-600" />
                              )}
                              <span>
                                {(
                                  (maxCredit / config.creditLineLimit) *
                                  100
                                ).toFixed(1)}
                                %
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>Operating Cash Flow</span>
                            <div className="flex items-center gap-2">
                              {avgOperatingCash > 0 ? (
                                <TrendingUp className="h-4 w-4 text-green-600" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-600" />
                              )}
                              <span
                                className={
                                  avgOperatingCash > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {formatCurrency(avgOperatingCash)}/month
                              </span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Key Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(() => {
                      const recommendations: string[] = [];
                      const minCash = Math.min(
                        ...cashFlowProjections.map((p) => p.cashBalance)
                      );
                      const maxCredit = Math.max(
                        ...cashFlowProjections.map((p) => p.creditLineUsed)
                      );
                      const ccc =
                        config.daysInReceivables +
                        config.daysInInventory -
                        config.daysInPayables;

                      if (minCash < config.minimumCashBalance) {
                        recommendations.push(
                          "Consider increasing credit line or improving cash collection"
                        );
                      }

                      if (ccc > 60) {
                        recommendations.push(
                          "Focus on reducing cash conversion cycle - currently " +
                            ccc +
                            " days"
                        );
                      }

                      if (config.daysInReceivables > 45) {
                        recommendations.push(
                          "Improve receivables collection - currently " +
                            config.daysInReceivables +
                            " days"
                        );
                      }

                      if (maxCredit / config.creditLineLimit > 0.5) {
                        recommendations.push(
                          "Monitor credit line usage - peaks at " +
                            (
                              (maxCredit / config.creditLineLimit) *
                              100
                            ).toFixed(1) +
                            "%"
                        );
                      }

                      if (recommendations.length === 0) {
                        recommendations.push(
                          "Cash flow appears healthy based on current projections"
                        );
                      }

                      return recommendations.map((rec, index) => (
                        <div
                          key={`rec-${index}-${rec.slice(0, 10)}`}
                          className="flex items-start gap-2"
                        >
                          <Target className="h-4 w-4 mt-0.5 text-blue-600" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ));
                    })()}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
