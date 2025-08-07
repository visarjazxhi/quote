"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  Calculator,
  DollarSign,
  HelpCircle,
  PiggyBank,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  COMPOUNDING_OPTIONS,
  CONTRIBUTION_OPTIONS,
  CONTRIBUTION_TIMING_OPTIONS,
  CompoundInterestFormData,
  CompoundInterestResult,
  CompoundingFrequency,
  ContributionFrequency,
  ContributionTiming,
  YearlyBreakdown,
} from "@/lib/finance/types/compound-interest";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UITooltip,
} from "@/components/ui/tooltip";
import {
  calculateCompoundInterest,
  calculateTimeToTarget,
} from "@/lib/finance/compound-interest-calculations";
import { useCallback, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const PRESET_SCENARIOS = [
  {
    name: "Conservative Retirement",
    principal: "25000",
    annualRate: "6",
    timeInYears: "30",
    additionalContributions: "300",
    compoundingFrequency: "monthly" as CompoundingFrequency,
    contributionFrequency: "monthly" as ContributionFrequency,
    contributionTiming: "end" as ContributionTiming,
  },
  {
    name: "Aggressive Growth",
    principal: "10000",
    annualRate: "10",
    timeInYears: "20",
    additionalContributions: "500",
    compoundingFrequency: "monthly" as CompoundingFrequency,
    contributionFrequency: "monthly" as ContributionFrequency,
    contributionTiming: "end" as ContributionTiming,
  },
  {
    name: "Emergency Fund",
    principal: "5000",
    annualRate: "4",
    timeInYears: "5",
    additionalContributions: "200",
    compoundingFrequency: "monthly" as CompoundingFrequency,
    contributionFrequency: "monthly" as ContributionFrequency,
    contributionTiming: "end" as ContributionTiming,
  },
  {
    name: "College Fund",
    principal: "15000",
    annualRate: "7",
    timeInYears: "18",
    additionalContributions: "250",
    compoundingFrequency: "monthly" as CompoundingFrequency,
    contributionFrequency: "monthly" as ContributionFrequency,
    contributionTiming: "end" as ContributionTiming,
  },
];

export default function CompoundInterestCalculator() {
  const [formData, setFormData] = useState<CompoundInterestFormData>({
    principal: "10000",
    annualRate: "7",
    compoundingFrequency: "monthly",
    timeInYears: "10",
    additionalContributions: "100",
    contributionFrequency: "monthly",
    contributionTiming: "end",
  });

  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = useCallback(
    (field: keyof CompoundInterestFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    []
  );

  const loadPreset = useCallback((preset: (typeof PRESET_SCENARIOS)[0]) => {
    setFormData(preset);
    setError(null);
    setResult(null);
  }, []);

  const validateInputs = useCallback((): boolean => {
    const principal = parseFloat(formData.principal);
    const annualRate = parseFloat(formData.annualRate);
    const timeInYears = parseFloat(formData.timeInYears);
    const additionalContributions = parseFloat(
      formData.additionalContributions
    );

    if (isNaN(principal) || principal < 0) {
      setError("Please enter a valid initial principal amount");
      return false;
    }

    if (isNaN(annualRate) || annualRate < 0) {
      setError("Please enter a valid annual interest rate");
      return false;
    }

    if (isNaN(timeInYears) || timeInYears <= 0) {
      setError("Please enter a valid time period in years");
      return false;
    }

    if (isNaN(additionalContributions) || additionalContributions < 0) {
      setError("Please enter a valid additional contribution amount");
      return false;
    }

    return true;
  }, [formData]);

  const handleCalculate = useCallback(async () => {
    if (!validateInputs()) return;

    setIsCalculating(true);
    setError(null);

    try {
      const inputs = {
        principal: parseFloat(formData.principal),
        annualRate: parseFloat(formData.annualRate),
        compoundingFrequency: formData.compoundingFrequency,
        timeInYears: parseFloat(formData.timeInYears),
        additionalContributions: parseFloat(formData.additionalContributions),
        contributionFrequency: formData.contributionFrequency,
        contributionTiming: formData.contributionTiming,
      };

      const calculationResult = calculateCompoundInterest(inputs);
      setResult(calculationResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during calculation"
      );
    } finally {
      setIsCalculating(false);
    }
  }, [formData, validateInputs]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const getTimeToTarget = (targetAmount: number): string => {
    try {
      const inputs = {
        principal: parseFloat(formData.principal),
        annualRate: parseFloat(formData.annualRate),
        compoundingFrequency: formData.compoundingFrequency,
        additionalContributions: parseFloat(formData.additionalContributions),
        contributionFrequency: formData.contributionFrequency,
        contributionTiming: formData.contributionTiming,
      };

      const years = calculateTimeToTarget(
        inputs.principal,
        targetAmount,
        inputs.annualRate,
        inputs.compoundingFrequency,
        inputs.additionalContributions,
        inputs.contributionFrequency
      );
      return `${years.toFixed(1)} years`;
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Compound Interest Calculator
          </h1>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Discover the power of compound interest with regular contributions.
          See how your investments can grow exponentially over time with
          detailed analysis and interactive charts.
        </p>
      </div>

      {/* Preset Scenarios */}
      <Card className="bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-emerald-600" />
            Investment Scenarios
          </CardTitle>
          <CardDescription>
            Start with proven investment strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_SCENARIOS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                onClick={() => loadPreset(preset)}
                className="h-auto p-4 text-left bg-white hover:bg-emerald-50 border-emerald-200 hover:border-emerald-300"
              >
                <div>
                  <div className="font-semibold text-gray-900">
                    {preset.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {formatPercent(parseFloat(preset.annualRate))} •{" "}
                    {preset.timeInYears} years
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                Investment Parameters
              </CardTitle>
              <CardDescription>
                Configure your investment details and contribution schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="principal"
                    className="flex items-center gap-1"
                  >
                    Initial Investment
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-3 h-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The amount you&apos;re starting with today</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="principal"
                      type="number"
                      placeholder=""
                      value={formData.principal}
                      onChange={(e) =>
                        handleInputChange("principal", e.target.value)
                      }
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="annualRate"
                    className="flex items-center gap-1"
                  >
                    Annual Return Rate (%)
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-3 h-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Expected annual rate of return (e.g., 7% for stock
                            market average)
                          </p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="relative">
                    <TrendingUp className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="annualRate"
                      type="number"
                      step="0.1"
                      placeholder=""
                      value={formData.annualRate}
                      onChange={(e) =>
                        handleInputChange("annualRate", e.target.value)
                      }
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="timeInYears"
                    className="flex items-center gap-1"
                  >
                    Investment Period (Years)
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-3 h-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How long you plan to keep the investment</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="relative">
                    <Target className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="timeInYears"
                      type="number"
                      placeholder=""
                      value={formData.timeInYears}
                      onChange={(e) =>
                        handleInputChange("timeInYears", e.target.value)
                      }
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="additionalContributions"
                    className="flex items-center gap-1"
                  >
                    Regular Contribution
                    <TooltipProvider>
                      <UITooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-3 h-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Amount you plan to add regularly</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="relative">
                    <PiggyBank className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="additionalContributions"
                      type="number"
                      placeholder=""
                      value={formData.additionalContributions}
                      onChange={(e) =>
                        handleInputChange(
                          "additionalContributions",
                          e.target.value
                        )
                      }
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Advanced Settings */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Advanced Settings
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Compounding Frequency</Label>
                    <Select
                      value={formData.compoundingFrequency}
                      onValueChange={(value: CompoundingFrequency) =>
                        handleInputChange("compoundingFrequency", value)
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COMPOUNDING_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Contribution Frequency</Label>
                    <Select
                      value={formData.contributionFrequency}
                      onValueChange={(value: ContributionFrequency) =>
                        handleInputChange("contributionFrequency", value)
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTRIBUTION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Contribution Timing</Label>
                    <Select
                      value={formData.contributionTiming}
                      onValueChange={(value: ContributionTiming) =>
                        handleInputChange("contributionTiming", value)
                      }
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTRIBUTION_TIMING_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <Button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                size="lg"
              >
                {isCalculating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Calculating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Calculate Growth
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Investment Results
              </CardTitle>
              <CardDescription>
                Your investment growth projection
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-emerald-700 font-medium mb-1">
                        Final Amount
                      </div>
                      <div className="text-2xl font-bold text-emerald-900">
                        {formatCurrency(result.finalAmount)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Initial Investment:</span>
                      <span className="font-medium">
                        {formatCurrency(result.principal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Total Contributions:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(result.totalContributions)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Interest Earned:</span>
                      <span className="font-medium text-emerald-600">
                        {formatCurrency(result.totalInterestEarned)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-900 font-semibold">
                        Total Return:
                      </span>
                      <span className="font-bold text-emerald-600">
                        {formatPercent(
                          ((result.finalAmount -
                            result.principal -
                            result.totalContributions) /
                            (result.principal + result.totalContributions)) *
                            100
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Quick Goals */}
                  <div className="pt-3 border-t">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Time to Goals
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">$100K:</span>
                        <span className="font-medium">
                          {getTimeToTarget(100000)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">$500K:</span>
                        <span className="font-medium">
                          {getTimeToTarget(500000)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">$1M:</span>
                        <span className="font-medium">
                          {getTimeToTarget(1000000)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>
                    Configure your investment and calculate to see projected
                    growth
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-emerald-50 border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                Investment Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  TIP
                </Badge>
                <p className="text-emerald-800">
                  Start early - time is your greatest asset in compound growth.
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  TIP
                </Badge>
                <p className="text-emerald-800">
                  Consistent contributions matter more than investment timing.
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  TIP
                </Badge>
                <p className="text-emerald-800">
                  Consider dollar-cost averaging with regular contributions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      {result && result.yearlyBreakdown.length > 0 && (
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Investment Growth Visualization
              </CardTitle>
              <CardDescription>
                Interactive charts showing your investment growth over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Growth Chart */}
                <div>
                  <h4 className="font-semibold mb-4">Total Growth Over Time</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={result.yearlyBreakdown}>
                        <defs>
                          <linearGradient
                            id="colorBalance"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#10b981"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#10b981"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="year"
                          tick={{ fontSize: 12 }}
                          tickLine={{ stroke: "#e5e7eb" }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickLine={{ stroke: "#e5e7eb" }}
                          tickFormatter={(value) =>
                            `$${(value / 1000).toFixed(0)}k`
                          }
                        />
                        <Tooltip
                          formatter={(value: number) => [
                            formatCurrency(value),
                            "Total Balance",
                          ]}
                          labelFormatter={(label) => `Year ${label}`}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "none",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="endingBalance"
                          stroke="#10b981"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorBalance)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Annual Breakdown Chart */}
                <div>
                  <h4 className="font-semibold mb-4">
                    Annual Contributions vs Interest
                  </h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.yearlyBreakdown.slice(-10)}>
                        <XAxis
                          dataKey="year"
                          tick={{ fontSize: 12 }}
                          tickLine={{ stroke: "#e5e7eb" }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickLine={{ stroke: "#e5e7eb" }}
                          tickFormatter={(value) =>
                            `$${(value / 1000).toFixed(0)}k`
                          }
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            formatCurrency(value),
                            name === "contributions"
                              ? "Contributions"
                              : "Interest Earned",
                          ]}
                          labelFormatter={(label) => `Year ${label}`}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            border: "none",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="contributions"
                          fill="#3b82f6"
                          radius={[2, 2, 0, 0]}
                        />
                        <Bar
                          dataKey="interestEarned"
                          fill="#10b981"
                          radius={[2, 2, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Key Milestones
              </CardTitle>
              <CardDescription>
                Important points in your investment journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.yearlyBreakdown
                  .filter(
                    (_, index) =>
                      index %
                        Math.max(
                          1,
                          Math.floor(result.yearlyBreakdown.length / 4)
                        ) ===
                        0 || index === result.yearlyBreakdown.length - 1
                  )
                  .map((year: YearlyBreakdown, index, filteredArray) => {
                    const milestones = ["Start", "25%", "50%", "75%", "Final"];
                    const milestoneIndex =
                      index === filteredArray.length - 1 ? 4 : index;

                    return (
                      <div
                        key={year.year}
                        className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border"
                      >
                        <div className="text-center">
                          <div className="text-xs text-gray-500 font-medium">
                            {milestones[milestoneIndex]}
                          </div>
                          <div className="text-lg font-bold text-gray-900 mt-1">
                            {formatCurrency(year.endingBalance)}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            Year {year.year}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
