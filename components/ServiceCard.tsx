"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import React from "react";
import type { Service } from "@/lib/store";
import { Textarea } from "./ui/textarea";
import { useEstimationStore } from "@/lib/store";

interface ServiceCardProps {
  service: Service;
  sectionId: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  sectionId,
}) => {
  const {
    sections,
    toggleService,
    updateOption,
    updateQuantity,
    updateCustomRate,
    toggleCustomRate,
    updateFixedCost,
    updateManualInput,
    updateRnDExpenses,
    updateFeedsRange,
    updateEmployeesRange,
    getServiceOptions,
  } = useEstimationStore();

  // Find the corresponding service in the store
  const section = sections.find((s) => s.id === sectionId);
  const storeService = section?.services.find((s) => s.id === service.id);

  // Check if service is selected (works for all service types)
  const isSelected = Boolean(
    storeService &&
      ((storeService.type === "withOptions" &&
        storeService.selectedOption !== undefined) ||
        (storeService.type === "fixedCost" &&
          storeService.value !== undefined) ||
        (storeService.type === "manualInput" &&
          storeService.customDescription !== undefined) ||
        (storeService.type === "rnD" && storeService.rdExpenses !== undefined))
  );

  const selectedOption =
    storeService?.type === "withOptions"
      ? storeService.selectedOption
      : undefined;

  const quantity =
    storeService?.type === "withOptions" ? storeService.quantity : undefined;

  const customRate =
    storeService?.type === "withOptions" ? storeService.customRate : undefined;

  const useCustomRate =
    storeService?.type === "withOptions" ? storeService.useCustomRate : false;

  const handleToggle = () => {
    toggleService(sectionId, service.id);
  };

  const handleOptionChange = (value: string) => {
    updateOption(sectionId, service.id, value);
  };

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(sectionId, service.id, newQuantity);
  };

  const handleCustomRateToggle = () => {
    toggleCustomRate(sectionId, service.id);
  };

  const handleCustomRateChange = (newRate: number) => {
    updateCustomRate(sectionId, service.id, newRate);
  };

  const handleManualInputChange = (
    field: "customDescription" | "customAmount" | "customRate",
    value: string | number
  ) => {
    updateManualInput(sectionId, service.id, field, value);
  };

  const handleRnDExpensesChange = (expenses: number) => {
    updateRnDExpenses(sectionId, service.id, expenses);
  };

  const handleFeedsRangeChange = (value: string) => {
    updateFeedsRange(sectionId, service.id, value);
  };

  const handleEmployeesRangeChange = (value: string) => {
    updateEmployeesRange(sectionId, service.id, value);
  };

  const isBookkeepingService = sectionId === "Bookkeeping ";
  const isEmployeeRangeService =
    isBookkeepingService &&
    (service.id === "payroll-process-aba-file" || service.id === "stp-filing");

  // Only "Data Entry and Bank Coding and Reconciliation" should have feeds dropdown
  const isFeedsRangeService =
    isBookkeepingService &&
    service.id === "data-entry-bank-coding-reconciliation";

  const feedsRangeOptions = [
    { value: "1-200", label: "1-200 feeds" },
    { value: "201-400", label: "201-400 feeds" },
    { value: "401-600", label: "401-600 feeds" },
    { value: "601-800", label: "601-800 feeds" },
    { value: "801-1000+", label: "801-1000+ feeds" },
  ];

  const employeesRangeOptions = [
    { value: "1-3", label: "1-3 employees" },
    { value: "3-5", label: "3-5 employees" },
    { value: "5-10", label: "5-10 employees" },
    { value: "10-20+", label: "10-20+ employees" },
  ];

  const getManualInputValue = (
    field: "customDescription" | "customAmount" | "customRate"
  ) => {
    if (storeService?.type === "manualInput") {
      return storeService[field] ?? (field === "customDescription" ? "" : 0);
    }
    return field === "customDescription" ? "" : 0;
  };

  const calculateManualTotal = () => {
    if (storeService?.type === "manualInput") {
      const amount = storeService.customAmount ?? 0;
      const rate = storeService.customRate ?? 0;
      return amount * rate;
    }
    return 0;
  };

  const isManualInputComplete = (): boolean => {
    if (storeService?.type === "manualInput") {
      const { customDescription, customAmount, customRate } = storeService;
      return Boolean(
        customDescription &&
          customDescription.trim() !== "" &&
          customAmount &&
          customAmount > 0 &&
          customRate &&
          customRate > 0
      );
    }
    return false;
  };

  // Get rate options from the store service (only for withOptions type)
  const rateOptions =
    storeService?.type === "withOptions"
      ? getServiceOptions(sectionId, service.id)
      : [];

  const getSelectedRate = () => {
    if (useCustomRate && customRate) {
      return customRate;
    }
    if (!selectedOption || !rateOptions) return 0;
    const option = rateOptions.find((opt) => opt.value === selectedOption);
    return option?.rate || 0;
  };

  const calculateRnDRefund = () => {
    if (storeService?.type === "rnD" && storeService.rdExpenses) {
      return storeService.rdExpenses * 0.435;
    }
    return 0;
  };

  const calculateRnDFees = () => {
    const refundAmount = calculateRnDRefund();
    return Math.max(refundAmount * 0.1, 2500);
  };

  const getTotalCost = () => {
    if (storeService?.type === "withOptions") {
      return getSelectedRate() * (quantity || 0);
    } else if (storeService?.type === "fixedCost") {
      return storeService.value || 0;
    } else if (storeService?.type === "manualInput") {
      return calculateManualTotal();
    } else if (storeService?.type === "rnD") {
      return calculateRnDFees();
    }
    return 0;
  };

  // If no store service found, don't render the card
  if (!storeService) {
    console.warn(
      `Service with ID "${service.id}" not found in section "${sectionId}"`
    );
    return null;
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Checkbox
            id={service.id}
            checked={isSelected}
            onCheckedChange={handleToggle}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <CardTitle
              className="text-sm font-medium leading-tight line-clamp-2 cursor-default"
              title={service.name}
            >
              {service.name}
            </CardTitle>
            {service.description && (
              <p
                className="text-xs text-muted-foreground mt-1 leading-tight line-clamp-2 cursor-default"
                title={service.description}
              >
                {service.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {storeService.type === "withOptions" && isSelected && (
          <div className="space-y-4">
            {/* Form Fields Container */}
            <div className="space-y-3">
              {/* Rate Selection - Hidden when custom rate is active */}
              {!useCustomRate && (
                <div className="space-y-2">
                  <Label htmlFor={`rate-${service.id}`} className="text-xs">
                    Select Rate Level
                  </Label>
                  <Select
                    value={selectedOption || ""}
                    onValueChange={handleOptionChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose rate level" />
                    </SelectTrigger>
                    <SelectContent>
                      {getServiceOptions(sectionId, service.id).map(
                        (option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label} - ${option.rate}/hour
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Custom Rate Toggle */}
              {selectedOption && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`custom-rate-${service.id}`}
                    checked={useCustomRate}
                    onCheckedChange={handleCustomRateToggle}
                  />
                  <Label
                    htmlFor={`custom-rate-${service.id}`}
                    className="text-xs"
                  >
                    Use custom rate
                  </Label>
                </div>
              )}

              {/* Custom Rate Input */}
              {selectedOption && useCustomRate && (
                <div className="space-y-2 mb-3">
                  <Label
                    htmlFor={`custom-rate-input-${service.id}`}
                    className="text-xs"
                  >
                    Custom Rate ($/hour)
                  </Label>
                  <Input
                    id={`custom-rate-input-${service.id}`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={customRate || ""}
                    onChange={(e) =>
                      handleCustomRateChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              )}

              {/* Number of Feeds Dropdown for Bookkeeping Services */}
              {isFeedsRangeService && selectedOption && (
                <div className="space-y-2">
                  <Label
                    htmlFor={`feeds-range-${service.id}`}
                    className="text-xs"
                  >
                    Number of Feeds
                  </Label>
                  <Select
                    value={storeService.feedsRange || ""}
                    onValueChange={handleFeedsRangeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of feeds" />
                    </SelectTrigger>
                    <SelectContent>
                      {feedsRangeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Number of Employees Dropdown for specific services */}
              {isEmployeeRangeService && selectedOption && (
                <div className="space-y-2">
                  <Label
                    htmlFor={`employees-range-${service.id}`}
                    className="text-xs"
                  >
                    Number of Employees
                  </Label>
                  <Select
                    value={storeService.employeesRange || ""}
                    onValueChange={handleEmployeesRangeChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of employees" />
                    </SelectTrigger>
                    <SelectContent>
                      {employeesRangeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Quantity Input */}
              {selectedOption && (
                <div className="space-y-2">
                  <Label htmlFor={`quantity-${service.id}`} className="text-xs">
                    Quantity (Hours)
                  </Label>
                  <Input
                    id={`quantity-${service.id}`}
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="0"
                    value={quantity || ""}
                    onChange={(e) =>
                      handleQuantityChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              )}
            </div>

            {/* Cost Display */}
            <div className="pt-3">
              {selectedOption && quantity && quantity > 0 ? (
                <div className="p-2 bg-muted rounded-lg border-l-4 border-primary overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary text-sm truncate">
                      Total: ${getSelectedRate()} x {quantity} = $
                      {getTotalCost().toFixed(2)}
                    </span>
                  </div>
                  {/* Show selected range if applicable */}
                  {(storeService.feedsRange || storeService.employeesRange) && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {storeService.feedsRange &&
                        `Feeds: ${storeService.feedsRange}`}
                      {storeService.employeesRange &&
                        `Employees: ${storeService.employeesRange}`}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                  <span className="text-muted-foreground text-xs">
                    Select rate and quantity
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {storeService.type === "manualInput" && isSelected && (
          <div className="space-y-3">
            <div>
              <Label htmlFor={`${service.id}-description`} className="text-xs">
                Description
              </Label>
              <Textarea
                id={`${service.id}-description`}
                placeholder="Enter service description"
                value={getManualInputValue("customDescription") as string}
                onChange={(e) =>
                  handleManualInputChange("customDescription", e.target.value)
                }
                className="mt-1 min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`${service.id}-amount`} className="text-xs">
                  Amount
                </Label>
                <Input
                  id={`${service.id}-amount`}
                  type="number"
                  placeholder="0"
                  value={getManualInputValue("customAmount") || ""}
                  onChange={(e) =>
                    handleManualInputChange(
                      "customAmount",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="mt-1"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor={`${service.id}-rate`} className="text-xs">
                  Rate
                </Label>
                <Input
                  id={`${service.id}-rate`}
                  type="number"
                  placeholder="0.00"
                  value={getManualInputValue("customRate") || ""}
                  onChange={(e) =>
                    handleManualInputChange(
                      "customRate",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="mt-1"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {isManualInputComplete() && (
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Total:</span>
                  <span className="text-sm font-medium">
                    ${calculateManualTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {storeService.type === "fixedCost" && isSelected && (
          <div className="space-y-3">
            {/* Fixed Cost Input */}
            <div className="space-y-2">
              <Label htmlFor={`fixed-cost-${service.id}`} className="text-xs">
                Fixed Cost Amount ($)
              </Label>
              <Input
                id={`fixed-cost-${service.id}`}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={storeService.value || ""}
                onChange={(e) =>
                  updateFixedCost(
                    sectionId,
                    service.id,
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>

            {/* Cost Display for fixedCost */}
            <div className="mt-4">
              {storeService.value && storeService.value > 0 ? (
                <div className="p-2 bg-muted rounded-lg border-l-4 border-green-500 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-700 text-sm truncate">
                      Fixed Cost:
                    </span>
                    <span className="font-bold text-green-700 text-right text-sm">
                      ${getTotalCost().toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-2 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center">
                  <span className="text-muted-foreground text-xs">
                    Enter amount
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {storeService.type === "rnD" && isSelected && (
          <div className="space-y-4">
            {/* R&D Expenses Input */}
            <div className="space-y-2">
              <Label htmlFor={`rnd-expenses-${service.id}`} className="text-xs">
                What are your total R&D Expenses (GST Excluded) ($)?
              </Label>
              <Input
                id={`rnd-expenses-${service.id}`}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={storeService.rdExpenses || ""}
                onChange={(e) =>
                  handleRnDExpensesChange(parseFloat(e.target.value) || 0)
                }
              />
            </div>

            {/* R&D Calculations Display */}
            {storeService.rdExpenses && storeService.rdExpenses > 0 && (
              <div className="space-y-3 p-3 bg-blue-50 rounded-lg border">
                <div className="text-xs font-medium text-blue-900">
                  R&D Tax Incentive Calculation
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">R&D Expenses:</span>
                    <span className="font-medium">
                      ${storeService.rdExpenses.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Refund Amount (43.5%):
                    </span>
                    <span className="font-medium text-green-600">
                      ${calculateRnDRefund().toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="text-gray-600">
                      Our Fees (10% min $2,500):
                    </span>
                    <span className="font-semibold text-blue-600">
                      ${calculateRnDFees().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
