"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  Calculator,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Edit2,
  Eye,
  FileText,
  Pause,
  Play,
  Plus,
  Settings,
  Target,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  ForecastMethod,
  ForecastRecord,
} from "@/lib/forecast/types/financial";
import React, { useMemo, useState } from "react";
import {
  STANDARD_GROUPS,
  categoryDisplayNameFromType,
  categoryTypeForItem,
} from "@/lib/forecast/data/pl-items";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { createEmptyValues } from "@/lib/forecast/types/financial";
import { toast } from "sonner";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";
import { useForecastDatabase } from "@/lib/forecast/hooks/use-forecast-database";

// Forecast Methods Configuration
const FORECAST_METHODS = {
  growth_rate: {
    name: "Percentage Growth",
    description:
      "Applies a monthly growth percentage (compounded month over month)",
    icon: Target,
    color: "orange",
    complexity: "Simple",
    requirements: "1+ months of historical data",
  },
  fixed_amount: {
    name: "Fixed Amount",
    description:
      "Applies the same fixed amount for each month in the selected period",
    icon: DollarSign,
    color: "emerald",
    complexity: "Simple",
    requirements: "No historical data required",
  },
} as const;

// Wizard Steps
type WizardStep = "basic" | "method" | "accounts" | "config" | "review";

interface ForecastParameters {
  growthRate?: number; // for percentage growth method
  fixedAmount?: number; // for fixed amount method
  seasonalityFactor?: number;
  smoothingAlpha?: number;
  revenuePercentage?: number;
  baselineMonths?: number;
  [key: string]: number | undefined;
}

interface ForecastWizardData {
  name: string;
  description: string;
  method: ForecastMethod;
  accountIds: string[];
  startDate: string;
  endDate: string;
  parameters: ForecastParameters;
}

interface ForecastEngineState {
  activeTab: "create" | "manage";
  wizardStep: WizardStep;
  wizardData: ForecastWizardData;
  editingRecord: ForecastRecord | null;
  showDeleteDialog: boolean;
  recordToDelete: string | null;
}

interface ForecastEngineProps {
  forecastId: string;
}

export function ForecastEngine({ forecastId }: ForecastEngineProps) {
  const { data, forecastRecords, checkDateOverlap, addSubcategory, addRow } =
    useFinancialStore();

  const { createForecastRecord } = useForecastDatabase();

  const [state, setState] = useState<ForecastEngineState>({
    activeTab: "manage",
    wizardStep: "basic",
    wizardData: {
      name: "",
      description: "",
      method: "growth_rate",
      accountIds: [],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      parameters: {
        growthRate: 5,
        fixedAmount: 0,
        seasonalityFactor: 1.2,
        smoothingAlpha: 0.3,
        revenuePercentage: 10,
        baselineMonths: 12,
      },
    },
    editingRecord: null,
    showDeleteDialog: false,
    recordToDelete: null,
  });

  // Ensure all standard P&L items exist as rows (create if missing)
  React.useEffect(() => {
    STANDARD_GROUPS.forEach(({ group, items }) => {
      items.forEach((item) => {
        const typeKey = categoryTypeForItem(group, item);
        const category = data.categories.find((c) => c.type === typeKey);
        if (!category) return;

        // Check if row exists (case-insensitive name match)
        const existing = category.subcategories
          .flatMap((s) => s.rows)
          .find(
            (r) => r.name.trim().toLowerCase() === item.trim().toLowerCase()
          );
        if (existing) return;

        // Ensure a "Standard Entries" subcategory exists
        let targetSub = category.subcategories.find((s) =>
          s.name.toLowerCase().includes("standard")
        );
        if (!targetSub) {
          addSubcategory(category.id, {
            name: "Standard Entries",
            order: 0,
            rows: [],
          });
          // refresh category from store immediately
          const s = useFinancialStore.getState();
          const refreshedCategory = s.data.categories.find(
            (c) => c.id === category.id
          );
          targetSub = refreshedCategory?.subcategories.find((sb) =>
            sb.name.toLowerCase().includes("standard")
          );
          if (!targetSub) return;
        }

        // Create the row with empty values across all forecast periods
        const emptyValues = createEmptyValues();
        addRow({
          name: item,
          type: typeKey,
          subcategoryId: targetSub.id,
          categoryId: category.id,
          order: 0,
          values: emptyValues,
        });
      });
    });
  }, [data.categories, addSubcategory, addRow]);

  // Build the selectable accounts strictly from the P&L standard items
  const allAccounts = useMemo(() => {
    const accs: Array<{
      id: string;
      name: string;
      categoryName: string;
      subcategoryName: string;
      type: string;
      hasData: boolean;
    }> = [];

    STANDARD_GROUPS.forEach(({ group, items }) => {
      items.forEach((item) => {
        const typeKey = categoryTypeForItem(group, item);
        const category = data.categories.find((c) => c.type === typeKey);
        if (!category) return;

        // Find the row by standardized name
        let foundRow: {
          rowId: string;
          subName: string;
          hasData: boolean;
        } | null = null;
        for (const sub of category.subcategories) {
          const row = sub.rows.find(
            (r) => r.name.trim().toLowerCase() === item.trim().toLowerCase()
          );
          if (row) {
            foundRow = {
              rowId: row.id,
              subName: sub.name,
              hasData: row.values.some((v) => v.value !== 0),
            };
            break;
          }
        }
        if (!foundRow) return; // will appear after ensure effect runs

        accs.push({
          id: foundRow.rowId,
          name: item,
          categoryName: categoryDisplayNameFromType(typeKey, data.taxRate),
          subcategoryName: foundRow.subName,
          type: typeKey,
          hasData: foundRow.hasData,
        });
      });
    });

    return accs;
  }, [data]);

  // Check for overlaps in current wizard data
  const wizardOverlapCheck = useMemo(() => {
    if (state.wizardData.accountIds.length === 0) {
      return {
        hasOverlap: false,
        overlappingRecords: [],
        overlappingAccountIds: [],
      };
    }
    return checkDateOverlap(
      state.wizardData.accountIds,
      state.wizardData.startDate,
      state.wizardData.endDate,
      state.editingRecord?.id
    );
  }, [
    state.wizardData.accountIds,
    state.wizardData.startDate,
    state.wizardData.endDate,
    state.editingRecord?.id,
    checkDateOverlap,
  ]);

  const updateWizardData = (updates: Partial<ForecastWizardData>) => {
    setState((prev) => ({
      ...prev,
      wizardData: { ...prev.wizardData, ...updates },
    }));
  };

  const resetWizard = () => {
    setState((prev) => ({
      ...prev,
      wizardStep: "basic",
      wizardData: {
        name: "",
        description: "",
        method: "linear_trend",
        accountIds: [],
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        parameters: {
          growthRate: 5,
          fixedAmount: 0,
          seasonalityFactor: 1.2,
          smoothingAlpha: 0.3,
          revenuePercentage: 10,
          baselineMonths: 12,
        },
      },
      editingRecord: null,
    }));
  };

  const handleCreateForecast = async () => {
    if (!state.wizardData.name.trim()) {
      toast.error("Please enter a forecast name");
      return;
    }

    if (state.wizardData.accountIds.length === 0) {
      toast.error("Please select at least one account");
      return;
    }

    if (wizardOverlapCheck.hasOverlap) {
      toast.error("Date overlap detected with existing forecasts");
      return;
    }

    const newRecord = {
      name: state.wizardData.name.trim(),
      accountIds: state.wizardData.accountIds,
      method: state.wizardData.method,
      parameters: state.wizardData.parameters,
      startDate: state.wizardData.startDate,
      endDate: state.wizardData.endDate,
      status: "active" as const,
    };

    try {
      if (state.editingRecord) {
        // TODO: Add update functionality to database service
        toast.error("Update functionality not yet implemented");
      } else {
        await createForecastRecord(forecastId, newRecord);
        toast.success("Forecast created successfully");
        // Immediately apply after creation
        useFinancialStore.getState().applyForecastConfig(newRecord);
      }

      resetWizard();
      setState((prev) => ({ ...prev, activeTab: "manage" }));
    } catch (error) {
      console.error("Error creating forecast record:", error);
      toast.error("Failed to create forecast record");
    }
  };

  const handleEditRecord = (record: ForecastRecord) => {
    setState((prev) => ({
      ...prev,
      activeTab: "create",
      wizardStep: "basic",
      editingRecord: record,
      wizardData: {
        name: record.name,
        description: "",
        method: record.method,
        accountIds: record.accountIds,
        startDate: record.startDate,
        endDate: record.endDate,
        parameters: record.parameters as ForecastParameters,
      },
    }));
  };

  const handleDeleteRecord = (recordId: string) => {
    setState((prev) => ({
      ...prev,
      showDeleteDialog: true,
      recordToDelete: recordId,
    }));
  };

  const confirmDelete = async () => {
    if (state.recordToDelete) {
      try {
        // TODO: Add delete functionality to database service
        toast.error("Delete functionality not yet implemented");
      } catch (error) {
        console.error("Error deleting forecast record:", error);
        toast.error("Failed to delete forecast record");
      }
    }
    setState((prev) => ({
      ...prev,
      showDeleteDialog: false,
      recordToDelete: null,
    }));
  };

  const handleToggleStatus = async () => {
    try {
      // TODO: Add update functionality to database service
      toast.error("Toggle status functionality not yet implemented");
    } catch (error) {
      console.error("Error updating forecast record:", error);
      toast.error("Failed to update forecast record");
    }
  };

  const getAccountName = (accountId: string) => {
    const account = allAccounts.find((acc) => acc.id === accountId);
    return account ? account.name : "Unknown Account";
  };

  const canProceedToNextStep = () => {
    switch (state.wizardStep) {
      case "basic":
        return state.wizardData.name.trim().length > 0;
      case "method":
        return true; // Method is always selected
      case "accounts":
        return state.wizardData.accountIds.length > 0;
      case "config":
        return !wizardOverlapCheck.hasOverlap;
      case "review":
        return true;
      default:
        return false;
    }
  };

  const getStepNumber = (step: WizardStep): number => {
    const steps: WizardStep[] = [
      "basic",
      "method",
      "accounts",
      "config",
      "review",
    ];
    return steps.indexOf(step) + 1;
  };

  const nextStep = () => {
    const steps: WizardStep[] = [
      "basic",
      "method",
      "accounts",
      "config",
      "review",
    ];
    const currentIndex = steps.indexOf(state.wizardStep);
    if (currentIndex < steps.length - 1) {
      setState((prev) => ({
        ...prev,
        wizardStep: steps[currentIndex + 1],
      }));
    }
  };

  const prevStep = () => {
    const steps: WizardStep[] = [
      "basic",
      "method",
      "accounts",
      "config",
      "review",
    ];
    const currentIndex = steps.indexOf(state.wizardStep);
    if (currentIndex > 0) {
      setState((prev) => ({
        ...prev,
        wizardStep: steps[currentIndex - 1],
      }));
    }
  };

  const goToStep = (target: WizardStep) => {
    setState((prev) => ({ ...prev, wizardStep: target }));
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <TrendingUp className="h-5 w-5" />
                Forecast Engine
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Create and manage financial forecasts with advanced modeling
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Calculator className="h-3 w-3" />
                {forecastRecords.length} forecasts
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Target className="h-3 w-3" />
                {
                  forecastRecords.filter((r) => r.status === "active").length
                }{" "}
                active
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={state.activeTab}
            onValueChange={(value) =>
              setState((prev) => ({
                ...prev,
                activeTab: value as "create" | "manage",
              }))
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Manage Forecasts</span>
                <span className="sm:hidden">Manage</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create Forecast</span>
                <span className="sm:hidden">Create</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manage" className="space-y-6">
              <ForecastManagement
                records={forecastRecords}
                onEdit={handleEditRecord}
                onDelete={handleDeleteRecord}
                onToggleStatus={handleToggleStatus}
                getAccountName={getAccountName}
              />
            </TabsContent>

            <TabsContent value="create" className="space-y-6">
              <ForecastWizard
                step={state.wizardStep}
                data={state.wizardData}
                allAccounts={allAccounts}
                overlapCheck={wizardOverlapCheck}
                isEditing={state.editingRecord !== null}
                onUpdateData={updateWizardData}
                onNext={nextStep}
                onPrev={prevStep}
                onCancel={resetWizard}
                onComplete={handleCreateForecast}
                canProceed={canProceedToNextStep()}
                getStepNumber={getStepNumber}
                goToStep={goToStep}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={state.showDeleteDialog}
        onOpenChange={() =>
          setState((prev) => ({ ...prev, showDeleteDialog: false }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Forecast</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this forecast? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setState((prev) => ({ ...prev, showDeleteDialog: false }))
              }
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Forecast Management Component
interface ForecastManagementProps {
  records: ForecastRecord[];
  allAccounts: Array<{
    id: string;
    name: string;
    categoryName: string;
    subcategoryName: string;
    type: string;
    hasData: boolean;
  }>;
  onEdit: (record: ForecastRecord) => void;
  onDelete: (recordId: string) => void;
  onToggleStatus: (record: ForecastRecord) => void;
  getAccountName: (accountId: string) => string;
}

function ForecastManagement({
  records,
  onEdit,
  onDelete,
  onToggleStatus,
  getAccountName,
}: Omit<ForecastManagementProps, "allAccounts">) {
  const activeRecords = records.filter((r) => r.status === "active");
  const pausedRecords = records.filter((r) => r.status === "paused");

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium mb-2">No forecasts created yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Create your first forecast to start predicting future financial
          performance using advanced modeling techniques.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Badge variant="outline" className="gap-1">
            <Calculator className="h-3 w-3" />
            Multiple methods available
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Target className="h-3 w-3" />
            Step-by-step wizard
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-lg font-semibold">{records.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-lg font-semibold text-green-600">
                {activeRecords.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Pause className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-sm text-muted-foreground">Paused</p>
              <p className="text-lg font-semibold text-orange-600">
                {pausedRecords.length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Accounts</p>
              <p className="text-lg font-semibold text-purple-600">
                {new Set(records.flatMap((r) => r.accountIds)).size}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Forecasts */}
      {activeRecords.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Active Forecasts</h3>
            <Badge variant="default" className="gap-1">
              <Play className="h-3 w-3" />
              {activeRecords.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {activeRecords.map((record) => (
              <ForecastCard
                key={record.id}
                record={record}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                getAccountName={getAccountName}
                variant="active"
              />
            ))}
          </div>
        </div>
      )}

      {/* Paused Forecasts */}
      {pausedRecords.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Paused Forecasts</h3>
            <Badge variant="secondary" className="gap-1">
              <Pause className="h-3 w-3" />
              {pausedRecords.length}
            </Badge>
          </div>
          <div className="space-y-3">
            {pausedRecords.map((record) => (
              <ForecastCard
                key={record.id}
                record={record}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                getAccountName={getAccountName}
                variant="paused"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Forecast Card Component
interface ForecastCardProps {
  record: ForecastRecord;
  onEdit: (record: ForecastRecord) => void;
  onDelete: (recordId: string) => void;
  onToggleStatus: (record: ForecastRecord) => void;
  getAccountName: (accountId: string) => string;
  variant: "active" | "paused";
}

function ForecastCard({
  record,
  onEdit,
  onDelete,
  onToggleStatus,
  getAccountName,
  variant,
}: ForecastCardProps) {
  const method =
    FORECAST_METHODS[record.method as "growth_rate" | "fixed_amount"];
  const IconComponent = method.icon;
  const colorText = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    red: "text-red-600",
    pink: "text-pink-600",
    cyan: "text-cyan-600",
    amber: "text-amber-600",
    lime: "text-lime-600",
    emerald: "text-emerald-600",
    indigo: "text-indigo-600",
  } as const;
  // Soft background map reserved for future use to label methods visually

  return (
    <Card
      className={`border-l-4 ${
        variant === "active" ? "border-l-green-500" : "border-l-orange-500"
      } hover:shadow-md transition-shadow`}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <IconComponent
                className={`h-4 w-4 ${
                  colorText[method.color as keyof typeof colorText]
                }`}
              />
              <h4 className="font-medium text-sm sm:text-base truncate">
                {record.name}
              </h4>
              <Badge
                variant={variant === "active" ? "default" : "secondary"}
                className="text-xs"
              >
                {record.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calculator className="h-3 w-3" />
                <span>{method.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {record.startDate} → {record.endDate}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{record.accountIds.length} accounts</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span>{method.complexity} complexity</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {record.accountIds.slice(0, 2).map((accountId) => (
                  <Badge key={accountId} variant="outline" className="text-xs">
                    {getAccountName(accountId)}
                  </Badge>
                ))}
                {record.accountIds.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{record.accountIds.length - 2} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              Created: {new Date(record.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus(record)}
              title={
                record.status === "active"
                  ? "Pause forecast"
                  : "Activate forecast"
              }
              className="h-8 w-8 p-0"
            >
              {record.status === "active" ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(record)}
              title="Edit forecast"
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(record.id)}
              title="Delete forecast"
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Forecast Wizard Component
interface ForecastWizardProps {
  step: WizardStep;
  data: ForecastWizardData;
  allAccounts: Array<{
    id: string;
    name: string;
    categoryName: string;
    subcategoryName: string;
    type: string;
    hasData: boolean;
  }>;
  overlapCheck: {
    hasOverlap: boolean;
    overlappingRecords: ForecastRecord[];
    overlappingAccountIds: string[];
  };
  isEditing: boolean;
  onUpdateData: (updates: Partial<ForecastWizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onCancel: () => void;
  onComplete: () => void;
  canProceed: boolean;
  getStepNumber: (step: WizardStep) => number;
  goToStep: (step: WizardStep) => void;
}

function ForecastWizard({
  step,
  data,
  allAccounts,
  overlapCheck,
  isEditing,
  onUpdateData,
  onNext,
  onPrev,
  onCancel,
  onComplete,
  canProceed,
  getStepNumber,
  goToStep,
}: ForecastWizardProps) {
  const currentStepNumber = getStepNumber(step);
  const totalSteps = 5;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium">
              {isEditing ? "Edit Forecast" : "Create New Forecast"}
            </h3>
            <p className="text-sm text-muted-foreground">
              Step {currentStepNumber} of {totalSteps}: {getStepTitle(step)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => goToStep("basic")}
              size="sm"
              className="hidden sm:inline-flex"
            >
              Start Over
            </Button>
            <Button variant="outline" onClick={onCancel} size="sm">
              Cancel
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted/60 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-primary/70 rounded-full h-2 transition-all duration-300"
            style={{ width: `${(currentStepNumber / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Indicators (clickable) */}
        <div className="flex justify-between text-xs text-muted-foreground">
          {(
            [
              { key: "basic", label: "Basic Info" },
              { key: "method", label: "Method" },
              { key: "accounts", label: "Accounts" },
              { key: "config", label: "Configure" },
              { key: "review", label: "Review" },
            ] as Array<{ key: WizardStep; label: string }>
          ).map((s) => {
            const sn = getStepNumber(s.key);
            const active = currentStepNumber >= sn;
            return (
              <button
                type="button"
                key={s.key}
                onClick={() => active && goToStep(s.key)}
                className={`px-2 py-1 rounded transition-colors ${
                  active ? "text-primary font-medium hover:bg-muted" : ""
                }`}
                aria-current={step === s.key}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {step === "basic" && (
            <BasicInfoStep data={data} onUpdateData={onUpdateData} />
          )}
          {step === "method" && (
            <MethodSelectionStep data={data} onUpdateData={onUpdateData} />
          )}
          {step === "accounts" && (
            <AccountSelectionStep
              data={data}
              allAccounts={allAccounts}
              onUpdateData={onUpdateData}
            />
          )}
          {step === "config" && (
            <ConfigurationStep
              data={data}
              overlapCheck={overlapCheck}
              onUpdateData={onUpdateData}
            />
          )}
          {step === "review" && (
            <ReviewStep data={data} allAccounts={allAccounts} />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={currentStepNumber === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {currentStepNumber === totalSteps ? (
          <Button onClick={onComplete} disabled={!canProceed} className="gap-2">
            <Check className="h-4 w-4" />
            {isEditing ? "Update Forecast" : "Create Forecast"}
          </Button>
        ) : (
          <Button onClick={onNext} disabled={!canProceed} className="gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function getStepTitle(step: WizardStep): string {
  switch (step) {
    case "basic":
      return "Basic Information";
    case "method":
      return "Select Method";
    case "accounts":
      return "Choose Accounts";
    case "config":
      return "Configuration";
    case "review":
      return "Review & Create";
    default:
      return "";
  }
}

// Step Components
function BasicInfoStep({
  data,
  onUpdateData,
}: {
  data: ForecastWizardData;
  onUpdateData: (updates: Partial<ForecastWizardData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-medium mb-2">Basic Information</h3>
        <p className="text-sm text-muted-foreground">
          Give your forecast a descriptive name and optional description
        </p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="forecast-name">Forecast Name *</Label>
          <Input
            id="forecast-name"
            placeholder="e.g., Q1 2025 Revenue Growth"
            value={data.name}
            onChange={(e) => onUpdateData({ name: e.target.value })}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Choose a clear, descriptive name for easy identification
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="forecast-description">Description (Optional)</Label>
          <Textarea
            id="forecast-description"
            placeholder="Additional details about this forecast..."
            value={data.description}
            onChange={(e) => onUpdateData({ description: e.target.value })}
            className="w-full"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Quick Start Preset</Label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  onUpdateData({
                    method: "growth_rate",
                    parameters: { ...data.parameters, growthRate: 10 },
                  })
                }
              >
                +10% Growth
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  onUpdateData({
                    method: "fixed_amount",
                    parameters: { ...data.parameters, fixedAmount: 1000 },
                  })
                }
              >
                $1,000 / month
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              One-click presets to speed up setup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MethodSelectionStep({
  data,
  onUpdateData,
}: {
  data: ForecastWizardData;
  onUpdateData: (updates: Partial<ForecastWizardData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-medium mb-2">Select Forecast Method</h3>
        <p className="text-sm text-muted-foreground">
          Choose the forecasting technique that best fits your data and
          requirements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Object.entries(FORECAST_METHODS).map(([key, method]) => {
          const IconComponent = method.icon;
          const isSelected = data.method === key;

          // Local color maps (mirrors ForecastCard)
          const colorText = {
            blue: "text-blue-600",
            green: "text-green-600",
            purple: "text-purple-600",
            orange: "text-orange-600",
            red: "text-red-600",
            pink: "text-pink-600",
            cyan: "text-cyan-600",
            amber: "text-amber-600",
            lime: "text-lime-600",
            emerald: "text-emerald-600",
            indigo: "text-indigo-600",
          } as const;
          const bgSoft = {
            blue: "bg-blue-100",
            green: "bg-green-100",
            purple: "bg-purple-100",
            orange: "bg-orange-100",
            red: "bg-red-100",
            pink: "bg-pink-100",
            cyan: "bg-cyan-100",
            amber: "bg-amber-100",
            lime: "bg-lime-100",
            emerald: "bg-emerald-100",
            indigo: "bg-indigo-100",
          } as const;

          return (
            <Card
              key={key}
              className={`cursor-pointer border-2 transition-all hover:shadow-md ${
                isSelected ? "border-primary bg-primary/5" : "border-muted"
              }`}
              onClick={() => onUpdateData({ method: key as ForecastMethod })}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      bgSoft[method.color as keyof typeof bgSoft]
                    }`}
                  >
                    <IconComponent
                      className={`h-5 w-5 ${
                        colorText[method.color as keyof typeof colorText]
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{method.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {method.complexity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {method.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" /> Suitable for most accounts
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Target className="h-3 w-3" /> {method.requirements}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="h-5 w-5 text-primary" />}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AccountSelectionStep({
  data,
  allAccounts,
  onUpdateData,
}: {
  data: ForecastWizardData;
  allAccounts: Array<{
    id: string;
    name: string;
    categoryName: string;
    subcategoryName: string;
    type: string;
    hasData: boolean;
  }>;
  onUpdateData: (updates: Partial<ForecastWizardData>) => void;
}) {
  const [search, setSearch] = React.useState("");
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allAccounts;
    return allAccounts.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.categoryName.toLowerCase().includes(q) ||
        a.subcategoryName.toLowerCase().includes(q)
    );
  }, [allAccounts, search]);

  const handleToggleAccount = (accountId: string) => {
    const isSelected = data.accountIds.includes(accountId);
    if (isSelected) {
      onUpdateData({
        accountIds: data.accountIds.filter((id) => id !== accountId),
      });
    } else {
      onUpdateData({
        accountIds: [...data.accountIds, accountId],
      });
    }
  };

  const handleSelectAll = () => {
    if (data.accountIds.length === filtered.length) {
      onUpdateData({
        accountIds: data.accountIds.filter(
          (id) => !filtered.some((f) => f.id === id)
        ),
      });
    } else {
      const ids = new Set([
        ...data.accountIds,
        ...filtered.map((acc) => acc.id),
      ]);
      onUpdateData({ accountIds: Array.from(ids) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-medium mb-2">Select Accounts</h3>
        <p className="text-sm text-muted-foreground">
          Choose which financial accounts to include in this forecast
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button variant="outline" size="sm" onClick={handleSelectAll}>
            {data.accountIds.length === filtered.length
              ? "Deselect Filtered"
              : "Select Filtered"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {data.accountIds.length} selected · {filtered.length} shown /{" "}
          {allAccounts.length} total
        </p>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-2 border rounded-lg p-3">
        {filtered.map((account) => (
          <div
            key={account.id}
            className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Checkbox
              checked={data.accountIds.includes(account.id)}
              onCheckedChange={() => handleToggleAccount(account.id)}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-medium text-sm truncate">
                  {account.name}
                </div>
                {!account.hasData && (
                  <Badge variant="secondary" className="text-xs">
                    No data
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {account.categoryName} → {account.subcategoryName}
              </div>
            </div>
            <Badge variant="outline" className="text-xs shrink-0">
              {account.type.replace("_", " ")}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfigurationStep({
  data,
  overlapCheck,
  onUpdateData,
}: {
  data: ForecastWizardData;
  overlapCheck: {
    hasOverlap: boolean;
    overlappingRecords: ForecastRecord[];
    overlappingAccountIds: string[];
  };
  onUpdateData: (updates: Partial<ForecastWizardData>) => void;
}) {
  const method =
    FORECAST_METHODS[data.method as "growth_rate" | "fixed_amount"];
  const IconComponent = method.icon;
  const monthsBetween = React.useMemo(() => {
    const s = new Date(data.startDate);
    const e = new Date(data.endDate);
    const d =
      (e.getFullYear() - s.getFullYear()) * 12 +
      (e.getMonth() - s.getMonth()) +
      1;
    return isNaN(d) || d < 0 ? 0 : d;
  }, [data.startDate, data.endDate]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Settings className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h3 className="text-lg font-medium mb-2">Configuration</h3>
        <p className="text-sm text-muted-foreground">
          Set the forecast period and method-specific parameters
        </p>
      </div>

      {/* Overlap Warning */}
      {overlapCheck.hasOverlap && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-400">
            <strong>Date Overlap Detected:</strong> The selected period overlaps
            with existing forecast records.
            {overlapCheck.overlappingRecords.length > 0 && (
              <div className="mt-2">
                <p>Conflicting forecasts:</p>
                <ul className="list-disc list-inside mt-1">
                  {overlapCheck.overlappingRecords.map((record) => (
                    <li key={record.id} className="text-sm">
                      {record.name} ({record.startDate} to {record.endDate})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecast Period */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Forecast Period</h4>
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Start Month</Label>
                <Input
                  type="month"
                  value={data.startDate.slice(0, 7)}
                  onChange={(e) => {
                    const ym = e.target.value; // YYYY-MM
                    const normalized = `${ym}-01`;
                    onUpdateData({ startDate: normalized });
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <Label className="text-sm">End Month</Label>
                <Input
                  type="month"
                  value={data.endDate.slice(0, 7)}
                  onChange={(e) => {
                    const ym = e.target.value; // YYYY-MM
                    const normalized = `${ym}-01`;
                    onUpdateData({ endDate: normalized });
                  }}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {monthsBetween} month(s) selected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Method Parameters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <IconComponent className="h-4 w-4" />
            <h4 className="font-medium">{method.name} Parameters</h4>
          </div>
          <MethodParameters data={data} onUpdateData={onUpdateData} />
          <div className="rounded-md border p-3 bg-muted/30 text-xs text-muted-foreground">
            Tip: You can tweak parameters later and re-apply the forecast;
            overlapping periods are prevented automatically.
          </div>
        </div>
      </div>
    </div>
  );
}

function MethodParameters({
  data,
  onUpdateData,
}: {
  data: ForecastWizardData;
  onUpdateData: (updates: Partial<ForecastWizardData>) => void;
}) {
  const updateParameter = (key: string, value: number) => {
    onUpdateData({
      parameters: {
        ...data.parameters,
        [key]: value,
      },
    });
  };

  switch (data.method) {
    case "growth_rate":
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-sm mb-2 block">
              Monthly Growth Rate: {data.parameters.growthRate}%
            </Label>
            <Slider
              value={[data.parameters.growthRate || 0]}
              onValueChange={([value]) => updateParameter("growthRate", value)}
              max={50}
              min={-20}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>-20%</span>
              <span>50%</span>
            </div>
          </div>
          <div>
            <Label className="text-sm mb-2 block">
              Baseline Months: {data.parameters.baselineMonths}
            </Label>
            <Slider
              value={[data.parameters.baselineMonths || 3]}
              onValueChange={([value]) =>
                updateParameter("baselineMonths", value)
              }
              max={12}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 month</span>
              <span>12 months</span>
            </div>
          </div>
        </div>
      );
    case "fixed_amount":
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-sm mb-2 block">
              Fixed Amount per Month: ${data.parameters.fixedAmount ?? 0}
            </Label>
            <Input
              type="number"
              value={data.parameters.fixedAmount ?? 0}
              onChange={(e) =>
                updateParameter("fixedAmount", Number(e.target.value) || 0)
              }
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This amount will be applied to each month in the selected period.
            </p>
          </div>
        </div>
      );

    case "seasonal":
      return (
        <div>
          <Label className="text-sm mb-2 block">
            Seasonality Factor:{" "}
            {(data.parameters.seasonalityFactor || 1).toFixed(1)}x
          </Label>
          <Slider
            value={[data.parameters.seasonalityFactor || 1]}
            onValueChange={([value]) =>
              updateParameter("seasonalityFactor", value)
            }
            max={3}
            min={0.1}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0.1x</span>
            <span>3x</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Adjusts the seasonal variation strength
          </p>
        </div>
      );

    case "percentage_of_revenue":
      return (
        <div>
          <Label className="text-sm mb-2 block">
            Percentage of Revenue:{" "}
            {(data.parameters.revenuePercentage || 0).toFixed(1)}%
          </Label>
          <Slider
            value={[data.parameters.revenuePercentage || 0]}
            onValueChange={([value]) =>
              updateParameter("revenuePercentage", value)
            }
            max={100}
            min={0}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      );

    case "exponential_smoothing":
      return (
        <div>
          <Label className="text-sm mb-2 block">
            Smoothing Alpha:{" "}
            {(data.parameters.smoothingAlpha || 0.3).toFixed(2)}
          </Label>
          <Slider
            value={[data.parameters.smoothingAlpha || 0.3]}
            onValueChange={([value]) =>
              updateParameter("smoothingAlpha", value)
            }
            max={0.9}
            min={0.1}
            step={0.05}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0.1 (stable)</span>
            <span>0.9 (responsive)</span>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center py-6 text-muted-foreground">
          <p>No additional parameters required for this method.</p>
        </div>
      );
  }
}

function ReviewStep({
  data,
  allAccounts,
}: {
  data: ForecastWizardData;
  allAccounts: Array<{
    id: string;
    name: string;
    categoryName: string;
    subcategoryName: string;
    type: string;
    hasData: boolean;
  }>;
}) {
  const method =
    FORECAST_METHODS[data.method as "growth_rate" | "fixed_amount"];
  const IconComponent = method.icon;
  const selectedAccounts = allAccounts.filter((acc) =>
    data.accountIds.includes(acc.id)
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Check className="h-12 w-12 mx-auto mb-4 text-green-600" />
        <h3 className="text-lg font-medium mb-2">Review & Create</h3>
        <p className="text-sm text-muted-foreground">
          Review your forecast configuration before creating
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <p className="font-medium">{data.name}</p>
            </div>
            {data.description && (
              <div>
                <Label className="text-xs text-muted-foreground">
                  Description
                </Label>
                <p className="text-sm">{data.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Method & Period */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <IconComponent className="h-4 w-4" />
              Method & Period
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Method</Label>
              <div className="flex items-center gap-2">
                <span className="font-medium">{method.name}</span>
                <Badge variant="outline" className="text-xs">
                  {method.complexity}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Period</Label>
              <p className="font-medium">
                {data.startDate} → {data.endDate}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Selected Accounts */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Selected Accounts ({selectedAccounts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedAccounts.map((account) => (
                <div key={account.id} className="p-2 border rounded text-sm">
                  <div className="font-medium truncate">{account.name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {account.categoryName}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
