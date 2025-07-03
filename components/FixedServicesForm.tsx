"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import ClientWrapper from "./ClientWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEstimationStore } from "@/lib/store";

export default function FixedServicesForm() {
  const {
    fixedServices,
    discount,
    addFixedService,
    removeFixedService,
    updateFixedService,
    updateDiscount,
  } = useEstimationStore();

  const handleAddService = () => {
    addFixedService();
    toast.success("Added new fixed service");
  };

  const handleRemoveService = (id: string) => {
    removeFixedService(id);
    toast.success("Removed fixed service");
  };

  const handleServiceUpdate = (
    id: string,
    field: string,
    value: string | number
  ) => {
    updateFixedService(
      id,
      field as keyof import("@/lib/store").FixedService,
      value
    );
  };

  const handleDiscountUpdate = (field: string, value: string | number) => {
    updateDiscount(field as keyof import("@/lib/store").Discount, value);
  };

  const calculateSubtotal = () => {
    return fixedServices.reduce(
      (total, service) => total + (service.amount || 0),
      0
    );
  };

  return (
    <ClientWrapper
      fallback={
        <Card suppressHydrationWarning>
          <CardHeader suppressHydrationWarning>
            <div className="animate-pulse space-y-2" suppressHydrationWarning>
              <div
                className="h-6 bg-muted rounded w-1/3"
                suppressHydrationWarning
              />
              <div
                className="h-4 bg-muted rounded w-2/3"
                suppressHydrationWarning
              />
            </div>
          </CardHeader>
          <CardContent suppressHydrationWarning>
            <div className="animate-pulse space-y-4" suppressHydrationWarning>
              <div className="h-10 bg-muted rounded" suppressHydrationWarning />
              <div className="h-32 bg-muted rounded" suppressHydrationWarning />
            </div>
          </CardContent>
        </Card>
      }
    >
      <Card
        className="border-green-200 bg-green-50/50"
        suppressHydrationWarning
      >
        <CardHeader suppressHydrationWarning>
          <CardTitle className="text-green-800" suppressHydrationWarning>
            Fixed Services
          </CardTitle>
          <CardDescription suppressHydrationWarning>
            Add custom services with fixed pricing that are not in the standard
            service categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" suppressHydrationWarning>
          {/* Add Service Button */}
          <div className="flex justify-end" suppressHydrationWarning>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddService}
              className="flex items-center gap-2"
              suppressHydrationWarning
            >
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>

          {/* Services List */}
          {fixedServices.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground border-2 border-dashed border-green-200 rounded-lg"
              suppressHydrationWarning
            >
              <p suppressHydrationWarning>
                No fixed services added yet. Click "Add Service" to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4" suppressHydrationWarning>
              {/* Headers */}
              <div
                className="grid grid-cols-12 gap-4 pb-2 border-b border-green-200 font-medium text-green-800"
                suppressHydrationWarning
              >
                <div className="col-span-8" suppressHydrationWarning>
                  Service Description
                </div>
                <div className="col-span-3" suppressHydrationWarning>
                  Amount ($)
                </div>
                <div className="col-span-1" suppressHydrationWarning>
                  {/* Action column */}
                </div>
              </div>

              {/* Service Rows */}
              {fixedServices.map((service) => (
                <div
                  key={service.id}
                  className="grid grid-cols-12 gap-4 items-center py-2 border-b border-green-100 last:border-b-0"
                  suppressHydrationWarning
                >
                  <div className="col-span-8" suppressHydrationWarning>
                    <Input
                      placeholder="Enter service description"
                      value={service.description}
                      onChange={(e) =>
                        handleServiceUpdate(
                          service.id,
                          "description",
                          e.target.value
                        )
                      }
                      className="border-green-200 focus:border-green-400"
                      suppressHydrationWarning
                    />
                  </div>

                  <div className="col-span-3" suppressHydrationWarning>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={service.amount || ""}
                      onChange={(e) =>
                        handleServiceUpdate(
                          service.id,
                          "amount",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="border-green-200 focus:border-green-400"
                      suppressHydrationWarning
                    />
                  </div>

                  <div
                    className="col-span-1 flex justify-center"
                    suppressHydrationWarning
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveService(service.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1"
                      suppressHydrationWarning
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Subtotal Display */}
              {calculateSubtotal() > 0 && (
                <div
                  className="mt-4 p-3 bg-muted rounded-lg"
                  suppressHydrationWarning
                >
                  <div
                    className="flex justify-between items-center"
                    suppressHydrationWarning
                  >
                    <span className="font-medium" suppressHydrationWarning>
                      Fixed Services Subtotal:
                    </span>
                    <span className="font-semibold" suppressHydrationWarning>
                      ${calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Discount Section */}
      <Card className="mt-4" suppressHydrationWarning>
        <CardHeader suppressHydrationWarning>
          <CardTitle className="text-orange-800" suppressHydrationWarning>
            Discount
          </CardTitle>
          <CardDescription suppressHydrationWarning>
            Apply a discount to the total estimate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4" suppressHydrationWarning>
          <div className="grid grid-cols-12 gap-4 items-center" suppressHydrationWarning>
            <div className="col-span-8" suppressHydrationWarning>
              <Label htmlFor="discount-description" suppressHydrationWarning>
                Discount Description
              </Label>
              <Input
                id="discount-description"
                placeholder="Enter discount reason (e.g., Early payment discount)"
                value={discount.description}
                onChange={(e) => handleDiscountUpdate("description", e.target.value)}
                className="mt-1"
                suppressHydrationWarning
              />
            </div>

            <div className="col-span-4" suppressHydrationWarning>
              <Label htmlFor="discount-amount" suppressHydrationWarning>
                Discount Amount ($)
              </Label>
              <Input
                id="discount-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={discount.amount || ""}
                onChange={(e) => handleDiscountUpdate("amount", parseFloat(e.target.value) || 0)}
                className="mt-1"
                suppressHydrationWarning
              />
            </div>
          </div>

          {discount.amount > 0 && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg" suppressHydrationWarning>
              <div className="flex justify-between items-center text-orange-800" suppressHydrationWarning>
                <span className="font-medium" suppressHydrationWarning>
                  Total Discount:
                </span>
                <span className="font-semibold" suppressHydrationWarning>
                  -${discount.amount.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ClientWrapper>
  );
}
