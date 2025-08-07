"use client";

import * as XLSX from "xlsx";

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
  FileSpreadsheet,
  HelpCircle,
  Home,
  PiggyBank,
  Table,
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
  PAYMENT_STRUCTURE_OPTIONS,
  PaymentFrequency,
  PaymentStructure,
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
import { useCallback, useRef, useState } from "react";

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
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showRepaymentTable, setShowRepaymentTable] = useState(false);

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

    if (
      formData.paymentStructure !== "principal_only" &&
      (isNaN(annualRate) || annualRate < 0)
    ) {
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

    // Validate payment structure specific fields
    if (formData.paymentStructure === "balloon" && formData.balloonAmount) {
      const balloonAmount = parseFloat(formData.balloonAmount);
      if (
        isNaN(balloonAmount) ||
        balloonAmount <= 0 ||
        balloonAmount >= loanAmount
      ) {
        setError(
          "Please enter a valid balloon amount less than the loan amount"
        );
        return false;
      }
    }

    if (
      formData.paymentStructure === "interest_only" &&
      formData.interestOnlyPeriodMonths
    ) {
      const interestOnlyPeriod = parseFloat(formData.interestOnlyPeriodMonths);
      const totalMonths = loanTermYears * 12 + loanTermMonths;
      if (
        isNaN(interestOnlyPeriod) ||
        interestOnlyPeriod <= 0 ||
        interestOnlyPeriod >= totalMonths
      ) {
        setError(
          "Please enter a valid interest-only period less than the total loan term"
        );
        return false;
      }
    }

    if (formData.paymentStructure === "graduated") {
      if (formData.graduationPeriodYears) {
        const graduationPeriod = parseFloat(formData.graduationPeriodYears);
        if (isNaN(graduationPeriod) || graduationPeriod <= 0) {
          setError("Please enter a valid graduation period");
          return false;
        }
      }
      if (formData.paymentIncreaseRate) {
        const increaseRate = parseFloat(formData.paymentIncreaseRate);
        if (isNaN(increaseRate) || increaseRate <= 0) {
          setError("Please enter a valid payment increase rate");
          return false;
        }
      }
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
        annualRate:
          formData.paymentStructure === "principal_only"
            ? 0
            : parseFloat(formData.annualRate),
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const getSelectedLoanTypeInfo = () => {
    return LOAN_TYPE_OPTIONS.find((type) => type.value === selectedLoanType);
  };

  const exportToExcel = useCallback(() => {
    if (!result || !result.amortizationSchedule.length) return;

    // Prepare data for Excel export
    const worksheetData = [
      [
        "Payment #",
        "Payment Date",
        "Payment Amount",
        "Principal",
        "Interest",
        "Extra Payment",
        "Remaining Balance",
      ],
      ...result.amortizationSchedule.map((entry) => [
        entry.paymentNumber,
        entry.paymentDate,
        entry.paymentAmount,
        entry.principalPayment,
        entry.interestPayment,
        entry.extraPayment,
        entry.remainingBalance,
      ]),
    ];

    // Create summary data
    const summaryData = [
      ["Loan Summary", ""],
      ["Original Loan Amount", result.loanSummary.originalLoanAmount],
      ["Monthly Payment", result.loanSummary.monthlyPayment],
      ["Total Payments", result.loanSummary.totalPayments],
      ["Total Interest", result.loanSummary.totalInterest],
      ["Total Extra Payments", result.loanSummary.totalExtraPayments],
      ["Interest Saved", result.loanSummary.interestSaved],
      ["Time Saved", result.loanSummary.timeSaved],
      ["Payoff Date", result.loanSummary.payoffDate],
      ["", ""],
      ["Input Parameters", ""],
      ["Loan Amount", formData.loanAmount],
      ["Annual Rate (%)", formData.annualRate],
      ["Loan Term (Years)", formData.loanTermYears],
      ["Loan Term (Months)", formData.loanTermMonths],
      ["Payment Frequency", formData.paymentFrequency],
      ["Payment Structure", formData.paymentStructure],
      ["Extra Payment", formData.extraPayment],
      ["Start Date", formData.startDate],
    ];

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Add summary worksheet
    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Loan Summary");

    // Add amortization schedule worksheet
    const scheduleWorksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(
      workbook,
      scheduleWorksheet,
      "Amortization Schedule"
    );

    // Generate filename with current date
    const today = new Date();
    const dateString = today.toISOString().split("T")[0];
    const filename = `loan-calculation-${dateString}.xlsx`;

    // Download the file
    XLSX.writeFile(workbook, filename);
  }, [result, formData]);

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
                let IconComponent = PiggyBank;
                if (loanType.value === "mortgage") {
                  IconComponent = Home;
                } else if (loanType.value === "auto") {
                  IconComponent = CreditCard;
                }
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
                    Typical rate: {getSelectedLoanTypeInfo()?.typicalRate}%
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
                <Label className="flex items-center gap-1">
                  Payment Structure
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-3 h-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Choose how your payments are structured</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </Label>
                <Select
                  value={formData.paymentStructure}
                  onValueChange={(value: PaymentStructure) =>
                    handleInputChange("paymentStructure", value)
                  }
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_STRUCTURE_OPTIONS.map((structure) => (
                      <SelectItem key={structure.value} value={structure.value}>
                        <div className="text-left">
                          <div className="font-medium">{structure.label}</div>
                          <div className="text-xs text-gray-500">
                            {structure.description}
                          </div>
                        </div>
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

          {/* Conditional Payment Structure Fields */}
          {(formData.paymentStructure === "balloon" ||
            formData.paymentStructure === "interest_only" ||
            formData.paymentStructure === "graduated") && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="text-sm font-semibold text-gray-700">
                  {formData.paymentStructure === "balloon" &&
                    "Balloon Payment Options"}
                  {formData.paymentStructure === "interest_only" &&
                    "Interest-Only Period Options"}
                  {formData.paymentStructure === "graduated" &&
                    "Graduated Payment Options"}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.paymentStructure === "balloon" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="balloonAmount"
                        className="flex items-center gap-1"
                      >
                        Balloon Amount
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-3 h-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Large final payment at the end of the loan term
                              </p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="balloonAmount"
                          type="number"
                          placeholder=""
                          value={formData.balloonAmount}
                          onChange={(e) =>
                            handleInputChange("balloonAmount", e.target.value)
                          }
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>
                  )}

                  {formData.paymentStructure === "interest_only" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="interestOnlyPeriodMonths"
                        className="flex items-center gap-1"
                      >
                        Interest-Only Period (Months)
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-3 h-3 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Number of months to pay only interest before
                                principal payments begin
                              </p>
                            </TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="interestOnlyPeriodMonths"
                          type="number"
                          placeholder=""
                          value={formData.interestOnlyPeriodMonths}
                          onChange={(e) =>
                            handleInputChange(
                              "interestOnlyPeriodMonths",
                              e.target.value
                            )
                          }
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>
                  )}

                  {formData.paymentStructure === "graduated" && (
                    <>
                      <div className="space-y-2">
                        <Label
                          htmlFor="graduationPeriodYears"
                          className="flex items-center gap-1"
                        >
                          Graduation Period (Years)
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger>
                                <HelpCircle className="w-3 h-3 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>How often payments increase</p>
                              </TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            id="graduationPeriodYears"
                            type="number"
                            placeholder=""
                            value={formData.graduationPeriodYears}
                            onChange={(e) =>
                              handleInputChange(
                                "graduationPeriodYears",
                                e.target.value
                              )
                            }
                            className="pl-10 h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="paymentIncreaseRate"
                          className="flex items-center gap-1"
                        >
                          Payment Increase Rate (%)
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger>
                                <HelpCircle className="w-3 h-3 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Percentage by which payments increase each
                                  period
                                </p>
                              </TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        </Label>
                        <div className="relative">
                          <BarChart3 className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            id="paymentIncreaseRate"
                            type="number"
                            step="0.1"
                            placeholder=""
                            value={formData.paymentIncreaseRate}
                            onChange={(e) =>
                              handleInputChange(
                                "paymentIncreaseRate",
                                e.target.value
                              )
                            }
                            className="pl-10 h-11"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

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
        <div ref={resultsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          {/* Repayment Schedule Table */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Table className="w-5 h-5 text-green-600" />
                    Repayment Schedule
                  </CardTitle>
                  <CardDescription>
                    Detailed payment-by-payment breakdown
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRepaymentTable(!showRepaymentTable)}
                    className="flex items-center gap-2"
                  >
                    <Table className="w-4 h-4" />
                    {showRepaymentTable ? "Hide Table" : "Show Table"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToExcel}
                    className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Export to Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            {showRepaymentTable && (
              <CardContent>
                <div className="max-h-96 overflow-auto custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-gray-50 border-b">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          #
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Date
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-gray-700">
                          Payment
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-gray-700">
                          Principal
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-gray-700">
                          Interest
                        </th>
                        {result.amortizationSchedule.some(
                          (entry) => entry.extraPayment > 0
                        ) && (
                          <th className="px-3 py-2 text-right font-medium text-gray-700">
                            Extra
                          </th>
                        )}
                        <th className="px-3 py-2 text-right font-medium text-gray-700">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.amortizationSchedule.map((entry, index) => (
                        <tr
                          key={entry.paymentNumber}
                          className={`border-b hover:bg-gray-50 ${
                            index % 12 === 0 ? "bg-blue-50" : ""
                          }`}
                        >
                          <td className="px-3 py-2 font-medium">
                            {entry.paymentNumber}
                          </td>
                          <td className="px-3 py-2">
                            {formatDate(entry.paymentDate)}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            {formatCurrency(entry.paymentAmount)}
                          </td>
                          <td className="px-3 py-2 text-right text-blue-600">
                            {formatCurrency(entry.principalPayment)}
                          </td>
                          <td className="px-3 py-2 text-right text-red-600">
                            {formatCurrency(entry.interestPayment)}
                          </td>
                          {result.amortizationSchedule.some(
                            (e) => e.extraPayment > 0
                          ) && (
                            <td className="px-3 py-2 text-right text-green-600">
                              {entry.extraPayment > 0
                                ? formatCurrency(entry.extraPayment)
                                : "-"}
                            </td>
                          )}
                          <td className="px-3 py-2 text-right font-medium">
                            {formatCurrency(entry.remainingBalance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-100 rounded"></div>
                      <span>Annual boundaries highlighted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">Principal</span>
                      <span className="text-red-600">Interest</span>
                      {result.amortizationSchedule.some(
                        (e) => e.extraPayment > 0
                      ) && (
                        <span className="text-green-600">Extra Payment</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
