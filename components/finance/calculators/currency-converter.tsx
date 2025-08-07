"use client";

import {
  ALL_CURRENCIES,
  ConversionResult,
  Currency,
  CurrencyFormData,
  POPULAR_CURRENCIES,
} from "@/lib/finance/types/currency";
import {
  AlertCircle,
  ArrowUpDown,
  Clock,
  DollarSign,
  RefreshCw,
  TrendingUp,
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
  checkApiHealth,
  convertCurrency,
  formatCurrencyAmount,
  getMultipleRates,
} from "@/lib/finance/services/currency-api";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const QUICK_AMOUNTS = [1, 10, 100, 1000, 10000];

export default function CurrencyConverter() {
  const [formData, setFormData] = useState<CurrencyFormData>({
    fromCurrency: "USD",
    toCurrency: "EUR",
    amount: "100",
  });

  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [popularRates, setPopularRates] = useState<{ [key: string]: number }>(
    {}
  );
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check API health on component mount
  useEffect(() => {
    if (!isClient) return;

    const checkHealth = async () => {
      const isHealthy = await checkApiHealth();
      setApiStatus(isHealthy ? "online" : "offline");
    };
    checkHealth();
  }, [isClient]);

  const handleInputChange = useCallback(
    (field: keyof CurrencyFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    []
  );

  const handleSwapCurrencies = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency,
    }));
    setError(null);
  }, []);

  const handleQuickAmount = useCallback((amount: number) => {
    setFormData((prev) => ({ ...prev, amount: amount.toString() }));
    setError(null);
  }, []);

  const validateInputs = useCallback((): boolean => {
    const amount = parseFloat(formData.amount);

    if (!formData.fromCurrency || !formData.toCurrency) {
      setError("Please select both currencies");
      return false;
    }

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return false;
    }

    if (amount > 1000000000) {
      setError("Amount is too large for conversion");
      return false;
    }

    return true;
  }, [formData]);

  const handleConvert = useCallback(async () => {
    if (!validateInputs()) return;

    setIsConverting(true);
    setError(null);

    try {
      const amount = parseFloat(formData.amount);
      const conversionResult = await convertCurrency(
        formData.fromCurrency,
        formData.toCurrency,
        amount
      );
      setResult(conversionResult);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during conversion"
      );
    } finally {
      setIsConverting(false);
    }
  }, [formData, validateInputs]);

  const loadPopularRates = useCallback(async () => {
    if (!isClient) return;

    setIsLoadingRates(true);
    try {
      const targetCurrencies = ["EUR", "GBP", "JPY", "AUD", "CAD", "CHF"];
      const rates = await getMultipleRates("USD", targetCurrencies);
      setPopularRates(rates);
    } catch (err) {
      console.error("Failed to load popular rates:", err);
    } finally {
      setIsLoadingRates(false);
    }
  }, [isClient]);

  useEffect(() => {
    loadPopularRates();
  }, [loadPopularRates]);

  const getCurrencyInfo = (code: string): Currency | undefined => {
    return ALL_CURRENCIES.find((currency) => currency.code === code);
  };

  const formatRate = (rate: number): string => {
    if (rate < 0.01) {
      return rate.toFixed(6);
    } else if (rate < 1) {
      return rate.toFixed(4);
    } else {
      return rate.toFixed(2);
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case "online":
        return "text-green-600";
      case "offline":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const getStatusIndicatorColor = () => {
    switch (apiStatus) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case "online":
        return "API Online";
      case "offline":
        return "API Offline";
      default:
        return "Checking...";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* API Status */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div
          className={`w-3 h-3 rounded-full ${getStatusIndicatorColor()} animate-pulse`}
        />
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          API Status: {getStatusText()}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Converter Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="w-5 h-5" />
                Currency Converter
              </CardTitle>
              <CardDescription>
                Enter an amount and select currencies to convert.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder=""
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="text-lg"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="space-y-2">
                <Label>Quick amounts</Label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_AMOUNTS.map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAmount(amount)}
                      className="text-xs"
                    >
                      {amount.toLocaleString()}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Currency Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="fromCurrency">From</Label>
                  <Select
                    value={formData.fromCurrency}
                    onValueChange={(value) =>
                      handleInputChange("fromCurrency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                        Popular Currencies
                      </div>
                      {POPULAR_CURRENCIES.slice(0, 10).map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span className="font-medium">{currency.code}</span>
                            <span className="text-muted-foreground">
                              {currency.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                      <Separator className="my-1" />
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                        All Currencies
                      </div>
                      {ALL_CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span className="font-medium">{currency.code}</span>
                            <span className="text-muted-foreground">
                              {currency.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSwapCurrencies}
                    className="h-10 w-10"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toCurrency">To</Label>
                  <Select
                    value={formData.toCurrency}
                    onValueChange={(value) =>
                      handleInputChange("toCurrency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                        Popular Currencies
                      </div>
                      {POPULAR_CURRENCIES.slice(0, 10).map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span className="font-medium">{currency.code}</span>
                            <span className="text-muted-foreground">
                              {currency.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                      <Separator className="my-1" />
                      <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                        All Currencies
                      </div>
                      {ALL_CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span className="font-medium">{currency.code}</span>
                            <span className="text-muted-foreground">
                              {currency.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Convert Button */}
              <Button
                onClick={handleConvert}
                disabled={isConverting || apiStatus === "offline"}
                className="w-full"
                size="lg"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Convert
                  </>
                )}
              </Button>

              {/* Error Display */}
              {error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results & Info Panel */}
        <div className="space-y-6">
          {/* Conversion Result */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Result</CardTitle>
              <CardDescription>Live exchange rate conversion</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold">
                      {formatCurrencyAmount(result.toAmount, result.toCurrency)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrencyAmount(
                        result.fromAmount,
                        result.fromCurrency
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Exchange Rate:</span>
                      <span className="font-mono">
                        1 {result.fromCurrency} ={" "}
                        {formatRate(result.exchangeRate)} {result.toCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Inverse Rate:</span>
                      <span className="font-mono">
                        1 {result.toCurrency} ={" "}
                        {formatRate(1 / result.exchangeRate)}{" "}
                        {result.fromCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last Updated:
                      </span>
                      <span className="text-muted-foreground">
                        {result.lastUpdated.split("T")[0]}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select currencies and click Convert to see results</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Rates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                USD Exchange Rates
              </CardTitle>
              <CardDescription>
                Popular currency rates against USD
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRates ? (
                <div className="text-center py-4">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Loading rates...
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(popularRates).map(([currency, rate]) => {
                    const currencyInfo = getCurrencyInfo(currency);
                    return (
                      <div
                        key={currency}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2">
                          <span>{currencyInfo?.flag}</span>
                          <span className="font-medium">{currency}</span>
                        </div>
                        <div className="font-mono text-sm">
                          {formatRate(rate)}
                        </div>
                      </div>
                    );
                  })}
                  <div className="text-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadPopularRates}
                      disabled={isLoadingRates}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Refresh
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About Exchange Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Exchange rates are updated daily</p>
              <p>• Supports 200+ currencies including crypto</p>
              <p>• Rates are for informational purposes only</p>
              <p>• Data provided by financial institutions</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
