"use client";

import { AnimatePresence, motion } from "framer-motion";
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
import { ServiceOption, useEstimationStore } from "@/lib/store";

import { Checkbox } from "@/components/ui/checkbox";
import ClientWrapper from "./ClientWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    category: string;
    timeEstimate?: string;
    complexity?: "Low" | "Medium" | "High";
  };
  sectionId: string;
}

export default function ServiceCard({ service, sectionId }: ServiceCardProps) {
  const {
    sections,
    updateOption,
    updateQuantity,
    updateFixedCost,
    updateCustomRate,
    toggleCustomRate,
    toggleService,
    getServiceOptions,
  } = useEstimationStore();

  // Find the corresponding service in the store
  const section = sections.find((s) => s.id === sectionId);
  const storeService = section?.services.find((s) => s.id === service.id);

  // Check if service is selected (works for both service types)
  const isSelected = Boolean(
    storeService &&
      ((storeService.type === "withOptions" &&
        storeService.selectedOption !== undefined) ||
        (storeService.type === "fixedCost" && storeService.value !== undefined))
  );

  const selectedOption =
    storeService?.type === "withOptions"
      ? storeService.selectedOption
      : undefined;
  const quantity =
    storeService?.type === "withOptions" ? storeService.quantity : undefined;
  const fixedValue =
    storeService?.type === "fixedCost" ? storeService.value : undefined;
  const customRate =
    storeService?.type === "withOptions" ? storeService.customRate : undefined;
  const useCustomRate =
    storeService?.type === "withOptions" ? storeService.useCustomRate : false;

  const handleToggle = (checked: boolean) => {
    toggleService(sectionId, service.id);
    if (checked) {
      toast.success(`Added ${service.name} to estimate`);
    } else {
      toast.success(`Removed ${service.name} from estimate`);
    }
  };

  const handleOptionChange = (value: string) => {
    updateOption(sectionId, service.id, value);
    toast.success(`Selected ${value} rate for ${service.name}`);
  };

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(sectionId, service.id, newQuantity);
  };

  const handleFixedCostChange = (newValue: number) => {
    updateFixedCost(sectionId, service.id, newValue);
  };

  const handleCustomRateToggle = (checked: boolean) => {
    toggleCustomRate(sectionId, service.id);
    if (checked) {
      toast.success(`Enabled custom rate for ${service.name}`);
    } else {
      toast.success(`Disabled custom rate for ${service.name}`);
    }
  };

  const handleCustomRateChange = (newRate: number) => {
    updateCustomRate(sectionId, service.id, newRate);
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
    const option = rateOptions.find(
      (opt: ServiceOption) => opt.value === selectedOption
    );
    return option?.rate || 0;
  };

  const getTotalCost = () => {
    if (storeService?.type === "withOptions") {
      return getSelectedRate() * (quantity || 0);
    } else if (storeService?.type === "fixedCost") {
      return fixedValue || 0;
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
    <ClientWrapper
      fallback={
        <Card className="h-16 flex flex-col" suppressHydrationWarning>
          <CardHeader suppressHydrationWarning>
            <div className="animate-pulse space-y-2" suppressHydrationWarning />
          </CardHeader>
        </Card>
      }
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        className="w-full h-full"
        suppressHydrationWarning
      >
        <Card
          className={`w-full flex flex-col transition-all duration-300 hover:shadow-md group ${
            isSelected ? "h-96" : "h-16"
          }`}
          suppressHydrationWarning
        >
          {/* Compact Header - Always Visible */}
          <CardHeader
            className="pb-2 pt-3 px-4 flex-row items-start justify-between space-y-0 min-h-[4rem]"
            suppressHydrationWarning
          >
            <CardTitle
              className="text-sm font-semibold leading-tight flex-1 pr-2 line-clamp-2"
              suppressHydrationWarning
              title={service.name}
            >
              {service.name}
            </CardTitle>
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleToggle}
              className="flex-shrink-0 mt-0.5"
              suppressHydrationWarning
            />
          </CardHeader>

          {/* Expanded Content - Only when selected */}
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                suppressHydrationWarning
              >
                <CardHeader className="pt-0 pb-3 px-4" suppressHydrationWarning>
                  <CardDescription
                    className="text-sm line-clamp-2"
                    title={service.description}
                    suppressHydrationWarning
                  >
                    {service.description}
                  </CardDescription>
                </CardHeader>

                <CardContent
                  className="flex-grow flex flex-col space-y-2 pt-0 px-4 pb-3"
                  suppressHydrationWarning
                >
                  {/* For withOptions services */}
                  {storeService?.type === "withOptions" && (
                    <div className="space-y-4" suppressHydrationWarning>
                      {/* Form Fields Container */}
                      <div className="space-y-3" suppressHydrationWarning>
                        {/* Rate Selection - Hidden when custom rate is active */}
                        {!useCustomRate && (
                          <div className="space-y-2" suppressHydrationWarning>
                            <Label
                              htmlFor={`rate-${service.id}`}
                              suppressHydrationWarning
                            >
                              Select Rate Level
                            </Label>
                            <Select
                              value={selectedOption || ""}
                              onValueChange={handleOptionChange}
                            >
                              <SelectTrigger suppressHydrationWarning>
                                <SelectValue placeholder="Choose rate level" />
                              </SelectTrigger>
                              <SelectContent suppressHydrationWarning>
                                {rateOptions.map((option: ServiceOption) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    suppressHydrationWarning
                                  >
                                    {option.label} - ${option.rate}/hour
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Custom Rate Toggle */}
                        {selectedOption && (
                          <div
                            className="flex items-center space-x-2"
                            suppressHydrationWarning
                          >
                            <Checkbox
                              id={`custom-rate-${service.id}`}
                              checked={useCustomRate}
                              onCheckedChange={handleCustomRateToggle}
                              suppressHydrationWarning
                            />
                            <Label
                              htmlFor={`custom-rate-${service.id}`}
                              suppressHydrationWarning
                              className="text-sm"
                            >
                              Use custom rate
                            </Label>
                          </div>
                        )}

                        {/* Dynamic Fields Container - Fixed Height */}
                        <div className="min-h-[80px]" suppressHydrationWarning>
                          {/* Custom Rate Input */}
                          {selectedOption && useCustomRate && (
                            <div className="space-y-2 mb-3" suppressHydrationWarning>
                              <Label
                                htmlFor={`custom-rate-input-${service.id}`}
                                suppressHydrationWarning
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
                                  handleCustomRateChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                suppressHydrationWarning
                              />
                            </div>
                          )}

                          {/* Quantity Input */}
                          {selectedOption && (
                            <div className="space-y-2" suppressHydrationWarning>
                              <Label
                                htmlFor={`quantity-${service.id}`}
                                suppressHydrationWarning
                              >
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
                                  handleQuantityChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                suppressHydrationWarning
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Fixed Cost Display */}
                      <div className="mt-auto" suppressHydrationWarning>
                        {selectedOption && quantity && quantity > 0 ? (
                          <div
                            className="p-2 bg-muted rounded-lg border-l-4 border-primary overflow-hidden"
                            suppressHydrationWarning
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-primary text-sm truncate">
                                Total: ${getSelectedRate()} x {quantity} = ${getTotalCost().toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="p-2 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center"
                            suppressHydrationWarning
                          >
                            <span className="text-muted-foreground text-xs">
                              Select rate and quantity
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* For fixedCost services */}
                  {storeService?.type === "fixedCost" && (
                    <>
                      {/* Fixed Cost Input */}
                      <div className="space-y-2" suppressHydrationWarning>
                        <Label
                          htmlFor={`fixed-cost-${service.id}`}
                          suppressHydrationWarning
                        >
                          Fixed Cost Amount ($)
                        </Label>
                        <Input
                          id={`fixed-cost-${service.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={fixedValue || ""}
                          onChange={(e) =>
                            handleFixedCostChange(
                              parseFloat(e.target.value) || 0
                            )
                          }
                          suppressHydrationWarning
                        />
                      </div>

                      {/* Cost Display for fixedCost - Compact */}
                      <div className="mt-2" suppressHydrationWarning>
                        {fixedValue && fixedValue > 0 ? (
                          <div
                            className="p-2 bg-muted rounded-lg border-l-4 border-green-500 overflow-hidden"
                            suppressHydrationWarning
                          >
                            <div
                              className="flex justify-between items-center"
                              suppressHydrationWarning
                            >
                              <span className="font-semibold text-green-700 text-sm truncate">
                                Fixed Cost:
                              </span>
                              <span className="font-bold text-green-700 text-right text-sm">
                                ${getTotalCost().toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="p-2 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-center"
                            suppressHydrationWarning
                          >
                            <span className="text-muted-foreground text-xs">
                              Enter amount
                            </span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </ClientWrapper>
  );
}
