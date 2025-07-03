"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ClientWrapper from "./ClientWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEstimationStore } from "@/lib/store";

const entityTypes = [
  "Individual",
  "Sole Trader",
  "Partnership",
  "Company",
  "Trust",
  "Self-Managed Super Fund (SMSF)",
  "Not-for-Profit",
  "Strata Corporation",
];

export default function ClientInfoForm() {
  const {
    clientInfo,
    updateClientGroup,
    addEntity,
    removeEntity,
    updateEntity,
  } = useEstimationStore();

  const handleEntityUpdate = (
    id: string,
    field: string,
    value: string | boolean
  ) => {
    updateEntity(id, field as keyof import("@/lib/store").Entity, value);
  };

  const handleAddEntity = () => {
    addEntity();
    toast.success("Added new entity");
  };

  const handleRemoveEntity = (id: string) => {
    if (clientInfo.entities.length > 1) {
      removeEntity(id);
      toast.success("Removed entity");
    } else {
      toast.error("At least one entity is required");
    }
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
      <Card className="border-blue-200 bg-blue-50/50" suppressHydrationWarning>
        <CardHeader suppressHydrationWarning>
          <CardTitle className="text-blue-800" suppressHydrationWarning>
            Client Information
          </CardTitle>
          <CardDescription suppressHydrationWarning>
            Enter details about the client and their business entities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" suppressHydrationWarning>
          {/* Client Group */}
          <div className="space-y-2" suppressHydrationWarning>
            <Label htmlFor="client-group" suppressHydrationWarning>
              Client Group
            </Label>
            <Input
              id="client-group"
              placeholder="Enter client group name"
              value={clientInfo.clientGroup}
              onChange={(e) => updateClientGroup(e.target.value)}
              suppressHydrationWarning
            />
          </div>

          {/* Entities Section */}
          <div className="space-y-4" suppressHydrationWarning>
            <div
              className="flex justify-between items-center"
              suppressHydrationWarning
            >
              <Label
                className="text-base font-semibold"
                suppressHydrationWarning
              >
                Business Entities
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddEntity}
                className="flex items-center gap-2"
                suppressHydrationWarning
              >
                <Plus className="h-4 w-4" />
                Add Entity
              </Button>
            </div>

            <div className="space-y-4" suppressHydrationWarning>
              {clientInfo.entities.map((entity, index) => (
                <div
                  key={entity.id}
                  className="p-4 border border-blue-200 rounded-lg bg-white space-y-4"
                  suppressHydrationWarning
                >
                  <div
                    className="flex items-center justify-between"
                    suppressHydrationWarning
                  >
                    <h4
                      className="font-medium text-blue-800"
                      suppressHydrationWarning
                    >
                      Entity {index + 1}
                    </h4>
                    {clientInfo.entities.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEntity(entity.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        suppressHydrationWarning
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Entity details in one row */}
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    suppressHydrationWarning
                  >
                    <div className="space-y-2" suppressHydrationWarning>
                      <Label
                        htmlFor={`entity-name-${entity.id}`}
                        suppressHydrationWarning
                      >
                        Entity Name
                      </Label>
                      <Input
                        id={`entity-name-${entity.id}`}
                        placeholder="Enter entity name"
                        value={entity.name}
                        onChange={(e) =>
                          handleEntityUpdate(entity.id, "name", e.target.value)
                        }
                        suppressHydrationWarning
                      />
                    </div>

                    <div className="space-y-2" suppressHydrationWarning>
                      <Label
                        htmlFor={`entity-type-${entity.id}`}
                        suppressHydrationWarning
                      >
                        Entity Type
                      </Label>
                      <Select
                        value={entity.entityType}
                        onValueChange={(value) =>
                          handleEntityUpdate(entity.id, "entityType", value)
                        }
                      >
                        <SelectTrigger suppressHydrationWarning>
                          <SelectValue placeholder="Select entity type" />
                        </SelectTrigger>
                        <SelectContent suppressHydrationWarning>
                          {entityTypes.map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              suppressHydrationWarning
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2" suppressHydrationWarning>
                      <Label
                        htmlFor={`business-type-${entity.id}`}
                        suppressHydrationWarning
                      >
                        Business Industry
                      </Label>
                      <Input
                        id={`business-type-${entity.id}`}
                        placeholder="Enter business industry"
                        value={entity.businessType}
                        onChange={(e) =>
                          handleEntityUpdate(
                            entity.id,
                            "businessType",
                            e.target.value
                          )
                        }
                        suppressHydrationWarning
                      />
                    </div>
                  </div>

                  {/* Xero subscription in separate row */}
                  <div className="space-y-3" suppressHydrationWarning>
                    <div
                      className="flex items-center space-x-4"
                      suppressHydrationWarning
                    >
                      <span
                        className="text-sm font-medium"
                        suppressHydrationWarning
                      >
                        Does the client have a Xero subscription?
                      </span>

                      <div
                        className="flex items-center space-x-4"
                        suppressHydrationWarning
                      >
                        <div
                          className="flex items-center space-x-2"
                          suppressHydrationWarning
                        >
                          <Checkbox
                            id={`xero-yes-${entity.id}`}
                            checked={entity.hasXeroFile === true}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleEntityUpdate(
                                  entity.id,
                                  "hasXeroFile",
                                  true
                                );
                              }
                            }}
                            suppressHydrationWarning
                          />
                          <Label
                            htmlFor={`xero-yes-${entity.id}`}
                            className="text-sm"
                            suppressHydrationWarning
                          >
                            Yes
                          </Label>
                        </div>

                        <div
                          className="flex items-center space-x-2"
                          suppressHydrationWarning
                        >
                          <Checkbox
                            id={`xero-no-${entity.id}`}
                            checked={entity.hasXeroFile === false}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleEntityUpdate(
                                  entity.id,
                                  "hasXeroFile",
                                  false
                                );
                              }
                            }}
                            suppressHydrationWarning
                          />
                          <Label
                            htmlFor={`xero-no-${entity.id}`}
                            className="text-sm"
                            suppressHydrationWarning
                          >
                            No
                          </Label>
                        </div>
                      </div>

                      {entity.hasXeroFile === false && (
                        <div
                          className="flex items-center space-x-2 flex-1"
                          suppressHydrationWarning
                        >
                          <Label
                            htmlFor={`accounting-software-${entity.id}`}
                            className="text-sm whitespace-nowrap"
                            suppressHydrationWarning
                          >
                            Current Accounting Software:
                          </Label>
                          <Input
                            id={`accounting-software-${entity.id}`}
                            placeholder="Enter current software"
                            value={entity.accountingSoftware ?? ""}
                            onChange={(e) =>
                              handleEntityUpdate(
                                entity.id,
                                "accountingSoftware",
                                e.target.value
                              )
                            }
                            className="flex-1"
                            suppressHydrationWarning
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </ClientWrapper>
  );
}
