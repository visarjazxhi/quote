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
  PiggyBank,
  TrendingDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LoanFormData,
  LoanResult,
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
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { calculateLoan } from "@/lib/finance/loan-calculations";

const PRESET_LOANS = [
  {
    label: "30-Year Mortgage",
    amount: 300000,
    rate: 6.5,
    years: 30,
    months: 0,
    type: "mortgage",
  },
  {
    label: "15-Year Mortgage",
    amount: 300000,
    rate: 6.0,
    years: 15,
    months: 0,
    type: "mortgage",
  },
  {
    label: "Auto Loan",
    amount: 35000,
    rate: 5.5,
    years: 5,
    months: 0,
    type: "auto",
  },
  {
    label: "Personal Loan",
    amount: 15000,
    rate: 8.5,
    years: 3,
    months: 0,
    type: "personal",
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

  const handleInputChange = useCallback(
    (field: keyof LoanFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    []
  );

  const handlePresetLoan = useCallback((preset: (typeof PRESET_LOANS)[0]) => {
    setFormData({
      loanAmount: preset.amount.toString(),
      annualRate: preset.rate.toString(),
      loanTermYears: preset.years.toString(),
      loanTermMonths: preset.months.toString(),
      paymentFrequency: "monthly",
      extraPayment: "0",
      startDate: new Date().toISOString().split("T")[0],
      paymentStructure: "standard",
      balloonAmount: "",
      interestOnlyPeriodMonths: "",
      graduationPeriodYears: "",
      paymentIncreaseRate: "",
    });
    setError(null);
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Calculator Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Loan Calculator
          </CardTitle>
          <CardDescription>
            Calculate loan payments, interest, and create amortization
            schedules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preset Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {PRESET_LOANS.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => handlePresetLoan(preset)}
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder=""
                  value={formData.loanAmount}
                  onChange={(e) =>
                    handleInputChange("loanAmount", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualRate">Annual Interest Rate (%)</Label>
                <Input
                  id="annualRate"
                  type="number"
                  step="0.01"
                  placeholder=""
                  value={formData.annualRate}
                  onChange={(e) =>
                    handleInputChange("annualRate", e.target.value)
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="loanTermYears">Years</Label>
                  <Input
                    id="loanTermYears"
                    type="number"
                    placeholder=""
                    value={formData.loanTermYears}
                    onChange={(e) =>
                      handleInputChange("loanTermYears", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanTermMonths">Additional Months</Label>
                  <Input
                    id="loanTermMonths"
                    type="number"
                    placeholder=""
                    value={formData.loanTermMonths}
                    onChange={(e) =>
                      handleInputChange("loanTermMonths", e.target.value)
                    }
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
                  <SelectTrigger>
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
                <Label htmlFor="extraPayment">Extra Payment</Label>
                <Input
                  id="extraPayment"
                  type="number"
                  placeholder=""
                  value={formData.extraPayment}
                  onChange={(e) =>
                    handleInputChange("extraPayment", e.target.value)
                  }
                />
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
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full"
            size="lg"
          >
            {isCalculating ? "Calculating..." : "Calculate Loan"}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Loan Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(result.monthlyPayment)}
                </div>
                <div className="text-sm text-blue-800">Monthly Payment</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(result.loanSummary.originalLoanAmount)}
                </div>
                <div className="text-sm text-green-800">Principal</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(result.loanSummary.totalInterest)}
                </div>
                <div className="text-sm text-red-800">Total Interest</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      {result && result.amortizationSchedule.length > 0 && (
        <div className="space-y-6">
          {/* Loan Balance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-blue-600" />
                Loan Balance Over Time
              </CardTitle>
              <CardDescription>
                Watch how your loan balance decreases with each payment
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
                            Math.floor(result.amortizationSchedule.length / 50)
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
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorBalance)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Payment Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-green-600" />
                  Principal vs Interest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {(
                          (result.loanSummary.originalLoanAmount /
                            (result.loanSummary.originalLoanAmount +
                              result.loanSummary.totalInterest)) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <div className="text-sm text-blue-800">Principal</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-red-600">
                        {(
                          (result.loanSummary.totalInterest /
                            (result.loanSummary.originalLoanAmount +
                              result.loanSummary.totalInterest)) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <div className="text-sm text-red-800">Interest</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Key Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Payoff Date:</span>
                    <span className="font-medium">
                      {formatDate(result.payoffDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Total Payments:
                    </span>
                    <span className="font-medium">
                      {result.amortizationSchedule.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Amount:</span>
                    <span className="font-medium">
                      {formatCurrency(result.totalAmount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
