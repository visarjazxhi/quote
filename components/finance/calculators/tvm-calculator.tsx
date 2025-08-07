"use client";

import {
  COMPOUNDING_OPTIONS,
  CompoundingFrequency,
  PaymentTiming,
  TVMCalculationMode,
  TVMFormData,
  TVMResult,
} from "@/lib/finance/types/financial";
import {
  Calculator,
  Calendar,
  DollarSign,
  HelpCircle,
  Percent,
  TrendingUp,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCallback, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { calculateTVM } from "@/lib/finance/financial-calculations";

const MODE_OPTIONS = [
  {
    value: "futureValue" as TVMCalculationMode,
    label: "Future Value",
    icon: TrendingUp,
    description: "What will my investment be worth in the future?",
  },
  {
    value: "presentValue" as TVMCalculationMode,
    label: "Present Value",
    icon: DollarSign,
    description: "What is the current value of future cash flows?",
  },
  {
    value: "payment" as TVMCalculationMode,
    label: "Payment Amount",
    icon: Calculator,
    description: "How much should I pay/save each period?",
  },
  {
    value: "annualRate" as TVMCalculationMode,
    label: "Interest Rate",
    icon: Percent,
    description: "What rate of return do I need?",
  },
  {
    value: "periods" as TVMCalculationMode,
    label: "Time Periods",
    icon: Calendar,
    description: "How long will it take to reach my goal?",
  },
];

const PRESET_SCENARIOS = [
  {
    name: "Retirement Planning",
    mode: "futureValue" as TVMCalculationMode,
    presentValue: "50000",
    payment: "500",
    annualRate: "7",
    periods: "360", // 30 years monthly
    compoundingFrequency: "monthly" as CompoundingFrequency,
    paymentTiming: "end" as PaymentTiming,
  },
  {
    name: "College Fund",
    mode: "payment" as TVMCalculationMode,
    futureValue: "200000",
    presentValue: "10000",
    annualRate: "6",
    periods: "216", // 18 years monthly
    compoundingFrequency: "monthly" as CompoundingFrequency,
    paymentTiming: "end" as PaymentTiming,
  },
  {
    name: "Emergency Fund",
    mode: "periods" as TVMCalculationMode,
    futureValue: "25000",
    presentValue: "5000",
    payment: "300",
    annualRate: "4",
    compoundingFrequency: "monthly" as CompoundingFrequency,
    paymentTiming: "end" as PaymentTiming,
  },
];

export default function TVMCalculator() {
  const [formData, setFormData] = useState<TVMFormData>({
    mode: "futureValue",
    presentValue: "",
    futureValue: "",
    payment: "",
    annualRate: "",
    periods: "",
    compoundingFrequency: "monthly",
    paymentTiming: "end",
  });

  const [result, setResult] = useState<TVMResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleInputChange = useCallback(
    (field: keyof TVMFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    []
  );

  const loadPreset = useCallback((preset: (typeof PRESET_SCENARIOS)[0]) => {
    setFormData({
      mode: preset.mode,
      presentValue: preset.presentValue || "",
      futureValue: preset.futureValue || "",
      payment: preset.payment || "",
      annualRate: preset.annualRate,
      periods: preset.periods || "",
      compoundingFrequency: preset.compoundingFrequency,
      paymentTiming: preset.paymentTiming,
    });
    setError(null);
    setResult(null);
  }, []);

  const validateInputs = useCallback((): boolean => {
    const { mode, presentValue, futureValue, payment, annualRate, periods } =
      formData;

    const pv = parseFloat(presentValue);
    const fv = parseFloat(futureValue);
    const pmt = parseFloat(payment);
    const rate = parseFloat(annualRate);
    const n = parseFloat(periods);

    if (isNaN(rate) || rate < 0) {
      setError("Please enter a valid annual interest rate");
      return false;
    }

    if (isNaN(n) || n <= 0) {
      setError("Please enter a valid number of periods");
      return false;
    }

    switch (mode) {
      case "futureValue":
        if (isNaN(pv) && isNaN(pmt)) {
          setError("Please enter either Present Value or Payment Amount");
          return false;
        }
        break;
      case "presentValue":
        if (isNaN(fv) && isNaN(pmt)) {
          setError("Please enter either Future Value or Payment Amount");
          return false;
        }
        break;
      case "payment":
        if (isNaN(pv) && isNaN(fv)) {
          setError("Please enter either Present Value or Future Value");
          return false;
        }
        break;
      case "annualRate":
      case "periods":
        if (isNaN(pv) && isNaN(fv) && isNaN(pmt)) {
          setError("Please enter at least two known values");
          return false;
        }
        break;
    }

    return true;
  }, [formData]);

  const handleCalculate = useCallback(async () => {
    if (!validateInputs()) return;

    setIsCalculating(true);
    setError(null);

    try {
      const {
        mode,
        presentValue,
        futureValue,
        payment,
        annualRate,
        periods,
        compoundingFrequency,
        paymentTiming,
      } = formData;

      const inputs = {
        presentValue: parseFloat(presentValue) || 0,
        futureValue: parseFloat(futureValue) || 0,
        payment: parseFloat(payment) || 0,
        annualRate: parseFloat(annualRate),
        periods: parseFloat(periods),
        compoundingFrequency,
        paymentTiming,
      };

      const calculationResult = calculateTVM(inputs, mode);

      setResult(calculationResult);

      // Scroll to results after a short delay to ensure rendering
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
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

  const getMainResultValue = useCallback(() => {
    if (!result) return formatCurrency(0);

    if (formData.mode === "periods") {
      return `${result.periods?.toFixed(1)} periods`;
    }
    if (formData.mode === "annualRate") {
      return formatPercent(result.annualRate || 0);
    }
    if (formData.mode === "futureValue") {
      return formatCurrency(result.futureValue);
    }
    if (formData.mode === "presentValue") {
      return formatCurrency(result.presentValue);
    }
    if (formData.mode === "payment") {
      return formatCurrency(result.payment);
    }
    return formatCurrency(0);
  }, [result, formData.mode]);

  const getResultSubtitle = useCallback(() => {
    if (!result) return "Calculated Value";

    if (formData.mode === "payment" && result.payment < 0) {
      return "Monthly Payment Required";
    }
    if (formData.mode === "periods") {
      return `${(result.periods / 12).toFixed(1)} years`;
    }
    return "Calculated Value";
  }, [result, formData.mode]);

  const selectedModeOption = MODE_OPTIONS.find(
    (option) => option.value === formData.mode
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Time Value of Money
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate present value, future value, payments, interest rates, or
          time periods. Perfect for retirement planning, investments, and loan
          analysis.
        </p>
      </div>

      {/* Preset Scenarios */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-blue-600" />
            Quick Start Scenarios
          </CardTitle>
          <CardDescription>
            Choose a preset scenario to get started quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESET_SCENARIOS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                onClick={() => loadPreset(preset)}
                className="h-auto p-4 text-left bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300"
              >
                <div>
                  <div className="font-semibold text-gray-900">
                    {preset.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Calculate{" "}
                    {MODE_OPTIONS.find((m) => m.value === preset.mode)?.label}
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
                {selectedModeOption && (
                  <selectedModeOption.icon className="w-5 h-5 text-blue-600" />
                )}
                Calculator Setup
              </CardTitle>
              <CardDescription>
                {selectedModeOption?.description ||
                  "Configure your calculation parameters"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode Selection */}
              <div className="space-y-3">
                <Label htmlFor="mode" className="text-base font-semibold">
                  What do you want to calculate?
                </Label>
                <Select
                  value={formData.mode}
                  onValueChange={(value: TVMCalculationMode) =>
                    handleInputChange("mode", value)
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="w-4 h-4" />
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formData.mode !== "presentValue" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="presentValue"
                      className="flex items-center gap-1"
                    >
                      Present Value
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-3 h-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Current value of your investment or loan</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="presentValue"
                        type="number"
                        placeholder=""
                        value={formData.presentValue}
                        onChange={(e) =>
                          handleInputChange("presentValue", e.target.value)
                        }
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                )}

                {formData.mode !== "futureValue" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="futureValue"
                      className="flex items-center gap-1"
                    >
                      Future Value
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-3 h-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Target value you want to achieve</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="relative">
                      <TrendingUp className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="futureValue"
                        type="number"
                        placeholder=""
                        value={formData.futureValue}
                        onChange={(e) =>
                          handleInputChange("futureValue", e.target.value)
                        }
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                )}

                {formData.mode !== "payment" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="payment"
                      className="flex items-center gap-1"
                    >
                      Payment Amount
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-3 h-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Regular payment or contribution amount</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="relative">
                      <Calculator className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="payment"
                        type="number"
                        placeholder=""
                        value={formData.payment}
                        onChange={(e) =>
                          handleInputChange("payment", e.target.value)
                        }
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                )}

                {formData.mode !== "annualRate" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="annualRate"
                      className="flex items-center gap-1"
                    >
                      Annual Interest Rate (%)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-3 h-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Expected annual rate of return or interest</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="relative">
                      <Percent className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                  </div>
                )}

                {formData.mode !== "periods" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="periods"
                      className="flex items-center gap-1"
                    >
                      Number of Periods
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="w-3 h-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Total number of compounding periods (e.g., months,
                              years)
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="periods"
                        type="number"
                        placeholder=""
                        value={formData.periods}
                        onChange={(e) =>
                          handleInputChange("periods", e.target.value)
                        }
                        className="pl-10 h-11"
                      />
                    </div>
                  </div>
                )}

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
                  <Label>Payment Timing</Label>
                  <Select
                    value={formData.paymentTiming}
                    onValueChange={(value: PaymentTiming) =>
                      handleInputChange("paymentTiming", value)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="end">End of Period</SelectItem>
                      <SelectItem value="beginning">
                        Beginning of Period
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
                    Calculate {selectedModeOption?.label}
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div ref={resultsRef} className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Results
              </CardTitle>
              <CardDescription>Calculated values and summary</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Main Result Highlight */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                    <div className="text-center">
                      <div className="text-sm text-blue-700 font-medium mb-2 uppercase tracking-wider">
                        {selectedModeOption?.label}
                      </div>
                      <div className="text-3xl font-bold text-blue-900 mb-1">
                        {getMainResultValue()}
                      </div>
                      <div className="text-xs text-blue-600 font-medium">
                        {getResultSubtitle()}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="space-y-4">
                    {/* Input Values */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-600" />
                        Input Values
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Present Value:</span>
                          <span className="font-medium text-right">
                            {formatCurrency(result.presentValue)}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Future Value:</span>
                          <span className="font-medium text-right">
                            {formatCurrency(result.futureValue)}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Payment Amount:</span>
                          <span className="font-medium text-right">
                            {formatCurrency(result.payment)}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Annual Rate:</span>
                          <span className="font-medium text-right">
                            {formatPercent(result.annualRate)}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Time Period:</span>
                          <span className="font-medium text-right">
                            {result.periods} periods
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Compounding:</span>
                          <span className="font-medium text-right capitalize">
                            {formData.compoundingFrequency}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Calculated Summary */}
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Financial Summary
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Total Payments:</span>
                          <span className="font-medium text-right">
                            {formatCurrency(Math.abs(result.totalPayments))}
                          </span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Total Interest:</span>
                          <span
                            className={`font-medium text-right ${
                              result.totalInterest >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(result.totalInterest)}
                          </span>
                        </div>
                        <div className="border-t border-green-200 pt-2 mt-3">
                          <div className="flex justify-between py-1">
                            <span className="text-gray-900 font-semibold">
                              Net Result:
                            </span>
                            <span className="font-bold text-green-700 text-right">
                              {formatCurrency(
                                result.futureValue || result.presentValue
                              )}
                            </span>
                          </div>
                        </div>
                        {formData.mode === "payment" && (
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">
                              Cost per Year:
                            </span>
                            <span className="font-medium text-right">
                              {formatCurrency(Math.abs(result.payment * 12))}
                            </span>
                          </div>
                        )}
                        {result.periods > 12 && (
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium text-right">
                              {(result.periods / 12).toFixed(1)} years
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      Key Insights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {formData.mode === "payment" && result.payment < 0 && (
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
                          <div>
                            <span className="font-medium text-amber-800">
                              Payment Direction:{" "}
                            </span>
                            <span className="text-amber-700">
                              You pay {formatCurrency(Math.abs(result.payment))}{" "}
                              monthly
                            </span>
                          </div>
                        </div>
                      )}

                      {result.totalInterest > 0 && (
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                          <div>
                            <span className="font-medium text-amber-800">
                              Interest Earned:{" "}
                            </span>
                            <span className="text-amber-700">
                              {(
                                (result.totalInterest /
                                  Math.abs(
                                    result.presentValue || result.totalPayments
                                  )) *
                                100
                              ).toFixed(1)}
                              % total return
                            </span>
                          </div>
                        </div>
                      )}

                      {result.totalInterest < 0 && (
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                          <div>
                            <span className="font-medium text-amber-800">
                              Interest Cost:{" "}
                            </span>
                            <span className="text-amber-700">
                              {formatCurrency(Math.abs(result.totalInterest))}{" "}
                              total interest paid
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                        <div>
                          <span className="font-medium text-amber-800">
                            Compounding Effect:{" "}
                          </span>
                          <span className="text-amber-700">
                            {formData.compoundingFrequency === "monthly"
                              ? "Strong"
                              : formData.compoundingFrequency === "quarterly"
                              ? "Moderate"
                              : "Basic"}{" "}
                            compounding frequency
                          </span>
                        </div>
                      </div>

                      {formData.paymentTiming === "beginning" && (
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                          <div>
                            <span className="font-medium text-amber-800">
                              Payment Timing:{" "}
                            </span>
                            <span className="text-amber-700">
                              Beginning of period provides slight advantage
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium mb-2">Ready to Calculate</p>
                  <p className="text-sm">
                    Enter your values and click Calculate to see detailed
                    results
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  TIP
                </Badge>
                <p className="text-blue-800">
                  Use realistic interest rates: 4-6% for conservative, 7-10% for
                  moderate investments.
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  TIP
                </Badge>
                <p className="text-blue-800">
                  For retirement planning, consider inflation when setting your
                  future value target.
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  TIP
                </Badge>
                <p className="text-blue-800">
                  Monthly compounding typically provides better results than
                  annual compounding.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
