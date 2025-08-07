"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  Calculator,
  Calendar,
  CreditCard,
  DollarSign,
  HelpCircle,
  Home,
  PiggyBank,
  TrendingDown,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LOAN_TYPE_OPTIONS,
  LoanFormData,
  LoanResult,
  LoanType,
  PAYMENT_FREQUENCY_OPTIONS,
  PaymentFrequency,
} from "@/lib/finance/types/loan";
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
import { useCallback, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { calculateLoan } from "@/lib/finance/loan-calculations";

const PRESET_LOANS = [
  {
    name: "30-Year Home Mortgage",
    loanAmount: "400000",
    annualRate: "6.5",
    loanTermYears: "30",
    loanTermMonths: "0",
    type: "mortgage" as LoanType,
    description: "Traditional fixed-rate mortgage",
  },
  {
    name: "15-Year Home Mortgage",
    loanAmount: "400000",
    annualRate: "6.0",
    loanTermYears: "15",
    loanTermMonths: "0",
    type: "mortgage" as LoanType,
    description: "Faster payoff, higher payments",
  },
  {
    name: "New Car Loan",
    loanAmount: "35000",
    annualRate: "5.5",
    loanTermYears: "5",
    loanTermMonths: "0",
    type: "auto" as LoanType,
    description: "Standard auto financing",
  },
  {
    name: "Personal Loan",
    loanAmount: "15000",
    annualRate: "8.5",
    loanTermYears: "3",
    loanTermMonths: "0",
    type: "personal" as LoanType,
    description: "Unsecured personal loan",
  },
];

export default function LoanCalculator() {
  const [formData, setFormData] = useState<LoanFormData>({
    loanAmount: "",
    annualRate: "",
    loanTermYears: "",
    loanTermMonths: "",
    paymentFrequency: "monthly",
    extraPayment: "0",
    startDate: new Date().toISOString().split("T")[0],
    paymentStructure: "standard",
    balloonAmount: "",
    interestOnlyPeriodMonths: "",
    graduationPeriodYears: "",
    paymentIncreaseRate: "",
  });

  const [result, setResult] = useState<LoanResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLoanType, setSelectedLoanType] =
    useState<LoanType>("mortgage");

  const handleInputChange = useCallback(
    (field: keyof LoanFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    []
  );

  const loadPreset = useCallback((preset: (typeof PRESET_LOANS)[0]) => {
    setFormData({
      loanAmount: preset.loanAmount,
      annualRate: preset.annualRate,
      loanTermYears: preset.loanTermYears,
      loanTermMonths: preset.loanTermMonths,
      paymentFrequency: "monthly",
      extraPayment: "0",
      startDate: new Date().toISOString().split("T")[0],
      paymentStructure: "standard",
      balloonAmount: "",
      interestOnlyPeriodMonths: "",
      graduationPeriodYears: "",
      paymentIncreaseRate: "",
    });
    setSelectedLoanType(preset.type);
    setError(null);
    setResult(null);
  }, []);

  const validateInputs = useCallback((): boolean => {
    const loanAmount = parseFloat(formData.loanAmount);
    const annualRate = parseFloat(formData.annualRate);
    const loanTermYears = parseFloat(formData.loanTermYears);
    const loanTermMonths = parseFloat(formData.loanTermMonths);
    const extraPayment = parseFloat(formData.extraPayment);

    if (isNaN(loanAmount) || loanAmount <= 0) {
      setError("Please enter a valid loan amount greater than 0");
      return false;
    }

    if (isNaN(annualRate) || annualRate < 0) {
      setError("Please enter a valid annual interest rate");
      return false;
    }

    if (
      (isNaN(loanTermYears) || loanTermYears < 0) &&
      (isNaN(loanTermMonths) || loanTermMonths <= 0)
    ) {
      setError("Please enter a valid loan term");
      return false;
    }

    if (isNaN(extraPayment) || extraPayment < 0) {
      setError("Please enter a valid extra payment amount");
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
        loanAmount: parseFloat(formData.loanAmount),
        annualRate: parseFloat(formData.annualRate),
        loanTermYears: parseFloat(formData.loanTermYears) || 0,
        loanTermMonths: parseFloat(formData.loanTermMonths) || 0,
        paymentFrequency: formData.paymentFrequency,
        extraPayment: parseFloat(formData.extraPayment) || 0,
        startDate: formData.startDate,
        paymentStructure: formData.paymentStructure,
        balloonAmount: formData.balloonAmount
          ? parseFloat(formData.balloonAmount)
          : undefined,
        interestOnlyPeriodMonths: formData.interestOnlyPeriodMonths
          ? parseFloat(formData.interestOnlyPeriodMonths)
          : undefined,
        graduationPeriodYears: formData.graduationPeriodYears
          ? parseFloat(formData.graduationPeriodYears)
          : undefined,
        paymentIncreaseRate: formData.paymentIncreaseRate
          ? parseFloat(formData.paymentIncreaseRate)
          : undefined,
      };

      const calculationResult = calculateLoan(inputs);
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const getSelectedLoanTypeInfo = () => {
    return LOAN_TYPE_OPTIONS.find((type) => type.value === selectedLoanType);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg">
            <PiggyBank className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Calculator</h1>
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Calculate loan payments, total interest, and create detailed
          amortization schedules. Perfect for mortgages, auto loans, and
          personal loans with extra payment analysis.
        </p>
      </div>

      {/* Preset Scenarios */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-indigo-600" />
            Common Loan Types
          </CardTitle>
          <CardDescription>
            Quick setup for popular loan scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_LOANS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                onClick={() => loadPreset(preset)}
                className="h-auto p-4 text-left bg-white hover:bg-indigo-50 border-indigo-200 hover:border-indigo-300"
              >
                <div>
                  <div className="font-semibold text-gray-900">
                    {preset.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {preset.description}
                  </div>
                  <div className="text-xs text-indigo-600 mt-1 font-medium">
                    {formatCurrency(parseFloat(preset.loanAmount))} •{" "}
                    {preset.loanTermYears} years
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calculator Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            Loan Details
          </CardTitle>
          <CardDescription>
            Enter your loan information to calculate payments and schedules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Loan Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Loan Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {LOAN_TYPE_OPTIONS.map((loanType) => {
                const IconComponent =
                  loanType.value === "mortgage"
                    ? Home
                    : loanType.value === "auto"
                    ? CreditCard
                    : PiggyBank;
                const isSelected = selectedLoanType === loanType.value;

                return (
                  <Button
                    key={loanType.value}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => {
                      setSelectedLoanType(loanType.value);
                      setFormData((prev) => ({
                        ...prev,
                        annualRate: loanType.typicalRate.toString(),
                      }));
                    }}
                    className={`h-12 ${
                      isSelected
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "hover:bg-indigo-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      <span className="text-sm">{loanType.label}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loanAmount" className="flex items-center gap-1">
                  Loan Amount
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total amount you want to borrow</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder=""
                    value={formData.loanAmount}
                    onChange={(e) =>
                      handleInputChange("loanAmount", e.target.value)
                    }
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualRate" className="flex items-center gap-1">
                  Annual Interest Rate (%)
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Annual percentage rate (APR) for your loan</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <BarChart3 className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="annualRate"
                    type="number"
                    step="0.01"
                    placeholder=""
                    value={formData.annualRate}
                    onChange={(e) =>
                      handleInputChange("annualRate", e.target.value)
                    }
                    className="pl-10 h-11"
                  />
                </div>
                {getSelectedLoanTypeInfo() && (
                  <p className="text-xs text-gray-500">
                    Typical rate: {getSelectedLoanTypeInfo()!.typicalRate}%
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="loanTermYears">Years</Label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="loanTermYears"
                      type="number"
                      placeholder=""
                      value={formData.loanTermYears}
                      onChange={(e) =>
                        handleInputChange("loanTermYears", e.target.value)
                      }
                      className="pl-10 h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanTermMonths">+ Months</Label>
                  <Input
                    id="loanTermMonths"
                    type="number"
                    placeholder=""
                    value={formData.loanTermMonths}
                    onChange={(e) =>
                      handleInputChange("loanTermMonths", e.target.value)
                    }
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Frequency</Label>
                <Select
                  value={formData.paymentFrequency}
                  onValueChange={(value: PaymentFrequency) =>
                    handleInputChange("paymentFrequency", value)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_FREQUENCY_OPTIONS.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="extraPayment"
                  className="flex items-center gap-1"
                >
                  Extra Payment (Optional)
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Additional amount to pay each period</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <PiggyBank className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="extraPayment"
                    type="number"
                    placeholder=""
                    value={formData.extraPayment}
                    onChange={(e) =>
                      handleInputChange("extraPayment", e.target.value)
                    }
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">First Payment Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  className="h-11"
                />
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
            className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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
                Calculate Loan
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Monthly Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(result.monthlyPayment)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Principal & Interest
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Total Interest
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(result.loanSummary.totalInterest)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Over {result.amortizationSchedule.length} payments
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Payoff Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatDate(result.payoffDate)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Final payment date
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      {result && result.amortizationSchedule.length > 0 && (
        <div className="space-y-6">
          {/* Loan Balance Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                Loan Balance Over Time
              </CardTitle>
              <CardDescription>
                Watch your loan balance decrease with each payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={result.amortizationSchedule.filter(
                      (_, index) =>
                        index %
                          Math.max(
                            1,
                            Math.floor(result.amortizationSchedule.length / 100)
                          ) ===
                        0
                    )}
                  >
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
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="paymentNumber"
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
                        "Remaining Balance",
                      ]}
                      labelFormatter={(label) => `Payment #${label}`}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="remainingBalance"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorBalance)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Payment Breakdown and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Breakdown */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-green-600" />
                  Payment Breakdown
                </CardTitle>
                <CardDescription>
                  How your payments are allocated
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-blue-900">
                        Principal
                      </div>
                      <div className="text-sm text-blue-700">
                        {(
                          (result.loanSummary.originalLoanAmount /
                            (result.loanSummary.originalLoanAmount +
                              result.loanSummary.totalInterest)) *
                          100
                        ).toFixed(1)}
                        % of total
                      </div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(result.loanSummary.originalLoanAmount)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-red-900">Interest</div>
                      <div className="text-sm text-red-700">
                        {(
                          (result.loanSummary.totalInterest /
                            (result.loanSummary.originalLoanAmount +
                              result.loanSummary.totalInterest)) *
                          100
                        ).toFixed(1)}
                        % of total
                      </div>
                    </div>
                    <div className="text-xl font-bold text-red-600">
                      {formatCurrency(result.loanSummary.totalInterest)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div>
                      <div className="font-semibold text-gray-900">
                        Total Paid
                      </div>
                      <div className="text-sm text-gray-700">
                        Principal + Interest
                      </div>
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(result.totalAmount)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loan Summary */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Loan Summary
                </CardTitle>
                <CardDescription>
                  Key loan details and milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Amount:</span>
                    <span className="font-semibold">
                      {formatCurrency(result.loanSummary.originalLoanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-semibold">
                      {parseFloat(formData.annualRate).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Loan Term:</span>
                    <span className="font-semibold">
                      {formData.loanTermYears} years{" "}
                      {formData.loanTermMonths &&
                        parseFloat(formData.loanTermMonths) > 0 &&
                        `, ${formData.loanTermMonths} months`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Payments:</span>
                    <span className="font-semibold">
                      {result.amortizationSchedule.length}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Payment:</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(result.monthlyPayment)}
                    </span>
                  </div>
                  {parseFloat(formData.extraPayment) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Extra Payment:</span>
                      <span className="font-semibold">
                        {formatCurrency(parseFloat(formData.extraPayment))}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tips Card */}
          <Card className="bg-indigo-50 border-indigo-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                Loan Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  TIP
                </Badge>
                <p className="text-indigo-800">
                  Make extra payments toward principal to save thousands in
                  interest.
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  TIP
                </Badge>
                <p className="text-indigo-800">
                  Consider bi-weekly payments to pay off your loan faster.
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  TIP
                </Badge>
                <p className="text-indigo-800">
                  Shop around for the best interest rates before committing.
                </p>
              </div>
              {parseFloat(formData.extraPayment) === 0 && (
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs bg-green-100 text-green-800"
                  >
                    IDEA
                  </Badge>
                  <p className="text-indigo-800">
                    Try adding an extra payment above to see the interest
                    savings!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
