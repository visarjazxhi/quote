"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  Calculator,
  Calendar,
  Copy,
  DollarSign,
  Edit2,
  Pause,
  Percent,
  Play,
  Plus,
  Target,
  Trash2,
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
import React, { useMemo, useState } from "react";
import type { ScenarioConfig, ScenarioType } from "@/lib/forecast/types/financial";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useFinancialStore } from "@/lib/forecast/store/financial-store";

interface CreateScenarioForm {
  name: string;
  description: string;
  type: ScenarioType;
  value: number;
  accountIds: string[];
  startDate: string;
  endDate: string;
}

interface ScenarioModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly scenario?: ScenarioConfig;
  readonly isEditing?: boolean;
}

const DEFAULT_FORM: CreateScenarioForm = {
  name: "",
  description: "",
  type: "percentage",
  value: 0,
  accountIds: [],
  startDate: new Date().toISOString().slice(0, 7) + "-01",
  endDate:
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7) +
    "-01",
};

export function ScenarioModeling() {
  const {
    data,
    scenarios,
    addScenario,
    updateScenario,
    deleteScenario,
    applyScenario,
  } = useFinancialStore();

  const [showModal, setShowModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState<
    ScenarioConfig | undefined
  >();
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);

  // Get all available accounts/rows
  const allAccounts = useMemo(() => {
    const accounts: Array<{
      id: string;
      name: string;
      categoryName: string;
      subcategoryName: string;
      type: string;
      hasData: boolean;
    }> = [];

    const categoryDisplayName = (cat: (typeof data.categories)[number]) => {
      if (cat.type === "income_tax_expense") {
        return `9. Income Tax Expense (${data.taxRate}%)`;
      }
      switch (cat.type) {
        case "sales_revenue":
          return "1. Sales Revenue";
        case "cogs":
          return "2. Cost of Goods Sold";
        case "operating_expenses":
          return "4. Operating Expenses";
        case "other_income":
          return "6. Other Income";
        case "financial_expenses":
          return "7. Financial Expenses";
        case "other_expenses":
          return "8. Other Expenses";
        default:
          return cat.name;
      }
    };

    // Sort to mirror P&L order
    const sortedCategories = [...data.categories].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    sortedCategories.forEach((category) => {
      if (category.isCalculated) return; // rows listed only under non-calculated categories
      const sortedSubs = [...category.subcategories].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      sortedSubs.forEach((subcategory) => {
        const sortedRows = [...subcategory.rows].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        );
        sortedRows.forEach((row) => {
          const hasData = row.values.some((v) => v.value !== 0);
          accounts.push({
            id: row.id,
            name: row.name,
            categoryName: categoryDisplayName(category),
            subcategoryName: subcategory.name,
            type: row.type,
            hasData,
          });
        });
      });
    });

    return accounts;
  }, [data]);

  const handleCreateScenario = () => {
    setEditingScenario(undefined);
    setShowModal(true);
  };

  const handleEditScenario = (scenario: ScenarioConfig) => {
    setEditingScenario(scenario);
    setShowModal(true);
  };

  const handleDeleteScenario = (id: string) => {
    setShowDeleteDialog(id);
  };

  const confirmDelete = () => {
    if (showDeleteDialog) {
      deleteScenario(showDeleteDialog);
      toast.success("Scenario deleted successfully");
    }
    setShowDeleteDialog(null);
  };

  const handleDuplicateScenario = (scenario: ScenarioConfig) => {
    const duplicatedScenario = {
      name: `${scenario.name} (Copy)`,
      description: scenario.description,
      type: scenario.type,
      value: scenario.value,
      accountIds: scenario.accountIds,
      startDate: scenario.startDate,
      endDate: scenario.endDate,
      status: "paused" as const,
    };

    addScenario(duplicatedScenario);
    toast.success("Scenario duplicated successfully");
  };

  const handleToggleStatus = (scenario: ScenarioConfig) => {
    const newStatus = scenario.status === "active" ? "paused" : "active";
    updateScenario(scenario.id, { status: newStatus });

    if (newStatus === "active") {
      applyScenario(scenario.id);
      toast.success("Scenario activated and applied");
    } else {
      toast.success("Scenario paused");
    }
  };

  const getAccountName = (accountId: string) => {
    const account = allAccounts.find((acc) => acc.id === accountId);
    return account ? account.name : "Unknown Account";
  };

  const activeScenarios = scenarios.filter((s) => s.status === "active");
  const pausedScenarios = scenarios.filter((s) => s.status === "paused");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Scenario Modeling
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Create forecasting scenarios with percentage growth or fixed
                amounts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Calculator className="h-3 w-3" />
                {scenarios.length} scenarios
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Play className="h-3 w-3" />
                {activeScenarios.length} active
              </Badge>
              <Button onClick={handleCreateScenario} className="gap-2">
                <Plus className="h-4 w-4" />
                New Scenario
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scenarios" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="scenarios">All Scenarios</TabsTrigger>
              <TabsTrigger value="active">Active Only</TabsTrigger>
            </TabsList>

            <TabsContent value="scenarios" className="space-y-6">
              {scenarios.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">
                    No scenarios created yet
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Create scenarios to model different forecasting conditions
                    using percentage growth or fixed amounts.
                  </p>
                  <Button onClick={handleCreateScenario} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Scenario
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Active Scenarios */}
                  {activeScenarios.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">
                          Active Scenarios
                        </h3>
                        <Badge variant="default" className="gap-1">
                          <Play className="h-3 w-3" />
                          {activeScenarios.length}
                        </Badge>
                      </div>
                      <div className="grid gap-4">
                        {activeScenarios.map((scenario) => (
                          <ScenarioCard
                            key={scenario.id}
                            scenario={scenario}
                            getAccountName={getAccountName}
                            onEdit={handleEditScenario}
                            onDelete={handleDeleteScenario}
                            onDuplicate={handleDuplicateScenario}
                            onToggleStatus={handleToggleStatus}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Paused Scenarios */}
                  {pausedScenarios.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium">
                          Paused Scenarios
                        </h3>
                        <Badge variant="secondary" className="gap-1">
                          <Pause className="h-3 w-3" />
                          {pausedScenarios.length}
                        </Badge>
                      </div>
                      <div className="grid gap-4">
                        {pausedScenarios.map((scenario) => (
                          <ScenarioCard
                            key={scenario.id}
                            scenario={scenario}
                            getAccountName={getAccountName}
                            onEdit={handleEditScenario}
                            onDelete={handleDeleteScenario}
                            onDuplicate={handleDuplicateScenario}
                            onToggleStatus={handleToggleStatus}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              {activeScenarios.length === 0 ? (
                <div className="text-center py-12">
                  <Play className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium mb-2">
                    No active scenarios
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Activate scenarios to see their impact on your financial
                    forecasts.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {activeScenarios.map((scenario) => (
                    <ScenarioCard
                      key={scenario.id}
                      scenario={scenario}
                      getAccountName={getAccountName}
                      onEdit={handleEditScenario}
                      onDelete={handleDeleteScenario}
                      onDuplicate={handleDuplicateScenario}
                      onToggleStatus={handleToggleStatus}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create/Edit Scenario Modal */}
      <ScenarioModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        scenario={editingScenario}
        isEditing={!!editingScenario}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog !== null}
        onOpenChange={() => setShowDeleteDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Scenario</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this scenario? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(null)}>
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

// Scenario Card Component
interface ScenarioCardProps {
  readonly scenario: ScenarioConfig;
  readonly getAccountName: (accountId: string) => string;
  readonly onEdit: (scenario: ScenarioConfig) => void;
  readonly onDelete: (id: string) => void;
  readonly onDuplicate: (scenario: ScenarioConfig) => void;
  readonly onToggleStatus: (scenario: ScenarioConfig) => void;
}

function ScenarioCard({
  scenario,
  getAccountName,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleStatus,
}: ScenarioCardProps) {
  const formatValue = (type: ScenarioType, value: number) => {
    if (type === "percentage") {
      return `${value > 0 ? "+" : ""}${value}%`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const formatMonth = (date: Date) =>
      date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    return `${formatMonth(start)} → ${formatMonth(end)}`;
  };

  return (
    <Card
      className={`border-l-4 ${
        scenario.status === "active"
          ? "border-l-green-500"
          : "border-l-orange-500"
      } hover:shadow-md transition-shadow`}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {scenario.type === "percentage" ? (
                <Percent className="h-4 w-4 text-orange-600" />
              ) : (
                <DollarSign className="h-4 w-4 text-green-600" />
              )}
              <h4 className="font-medium text-sm sm:text-base truncate">
                {scenario.name}
              </h4>
              <Badge
                variant={scenario.status === "active" ? "default" : "secondary"}
                className="text-xs"
              >
                {scenario.status}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${
                  scenario.type === "percentage"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {formatValue(scenario.type, scenario.value)}
              </Badge>
            </div>

            {scenario.description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {scenario.description}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDateRange(scenario.startDate, scenario.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{scenario.accountIds.length} accounts</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {scenario.accountIds.slice(0, 2).map((accountId) => (
                  <Badge key={accountId} variant="outline" className="text-xs">
                    {getAccountName(accountId)}
                  </Badge>
                ))}
                {scenario.accountIds.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{scenario.accountIds.length - 2} more
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              Created: {new Date(scenario.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus(scenario)}
              title={
                scenario.status === "active"
                  ? "Pause scenario"
                  : "Activate scenario"
              }
              className="h-8 w-8 p-0"
            >
              {scenario.status === "active" ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(scenario)}
              title="Edit scenario"
              className="h-8 w-8 p-0"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDuplicate(scenario)}
              title="Duplicate scenario"
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(scenario.id)}
              title="Delete scenario"
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

// Scenario Modal Component
function ScenarioModal({
  isOpen,
  onClose,
  scenario,
  isEditing,
}: ScenarioModalProps) {
  const { addScenario, updateScenario, checkScenarioOverlap, data } =
    useFinancialStore();
  const [form, setForm] = useState<CreateScenarioForm>(DEFAULT_FORM);
  const [overlapCheck, setOverlapCheck] = useState<{
    hasOverlap: boolean;
    overlappingScenarios: ScenarioConfig[];
    overlappingAccountIds: string[];
  }>({
    hasOverlap: false,
    overlappingScenarios: [],
    overlappingAccountIds: [],
  });

  // Get all available accounts
  const allAccounts = useMemo(() => {
    const accounts: Array<{
      id: string;
      name: string;
      categoryName: string;
      subcategoryName: string;
      type: string;
      hasData: boolean;
    }> = [];

    const categoryDisplayName = (cat: (typeof data.categories)[number]) => {
      if (cat.type === "income_tax_expense") {
        return `9. Income Tax Expense (${data.taxRate}%)`;
      }
      switch (cat.type) {
        case "sales_revenue":
          return "1. Sales Revenue";
        case "cogs":
          return "2. Cost of Goods Sold";
        case "operating_expenses":
          return "4. Operating Expenses";
        case "other_income":
          return "6. Other Income";
        case "financial_expenses":
          return "7. Financial Expenses";
        case "other_expenses":
          return "8. Other Expenses";
        default:
          return cat.name;
      }
    };

    const sortedCategories = [...data.categories].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );
    sortedCategories.forEach((category) => {
      if (category.isCalculated) return;
      const sortedSubs = [...category.subcategories].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );
      sortedSubs.forEach((subcategory) => {
        const sortedRows = [...subcategory.rows].sort(
          (a, b) => (a.order ?? 0) - (b.order ?? 0)
        );
        sortedRows.forEach((row) => {
          const hasData = row.values.some((v) => v.value !== 0);
          accounts.push({
            id: row.id,
            name: row.name,
            categoryName: categoryDisplayName(category),
            subcategoryName: subcategory.name,
            type: row.type,
            hasData,
          });
        });
      });
    });

    return accounts;
  }, [data]);

  // Initialize form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (isEditing && scenario) {
        setForm({
          name: scenario.name,
          description: scenario.description,
          type: scenario.type,
          value: scenario.value,
          accountIds: scenario.accountIds,
          startDate: scenario.startDate,
          endDate: scenario.endDate,
        });
      } else {
        setForm(DEFAULT_FORM);
      }
      setOverlapCheck({
        hasOverlap: false,
        overlappingScenarios: [],
        overlappingAccountIds: [],
      });
    }
  }, [isOpen, isEditing, scenario]);

  // Check for overlaps when form changes
  React.useEffect(() => {
    if (form.accountIds.length > 0 && form.startDate && form.endDate) {
      const check = checkScenarioOverlap(
        form.accountIds,
        form.startDate,
        form.endDate,
        isEditing ? scenario?.id : undefined
      );
      setOverlapCheck(check);
    } else {
      setOverlapCheck({
        hasOverlap: false,
        overlappingScenarios: [],
        overlappingAccountIds: [],
      });
    }
  }, [
    form.accountIds,
    form.startDate,
    form.endDate,
    checkScenarioOverlap,
    isEditing,
    scenario?.id,
  ]);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Please enter a scenario name");
      return;
    }

    if (form.accountIds.length === 0) {
      toast.error("Please select at least one account");
      return;
    }

    if (overlapCheck.hasOverlap) {
      toast.error("Date overlap detected with existing scenarios");
      return;
    }

    const scenarioData = {
      name: form.name.trim(),
      description: form.description.trim(),
      type: form.type,
      value: form.value,
      accountIds: form.accountIds,
      startDate: form.startDate,
      endDate: form.endDate,
      status: "paused" as const,
    };

    if (isEditing && scenario) {
      updateScenario(scenario.id, scenarioData);
      toast.success("Scenario updated successfully");
    } else {
      addScenario(scenarioData);
      toast.success("Scenario created successfully");
    }

    onClose();
  };

  const handleToggleAccount = (accountId: string) => {
    const isSelected = form.accountIds.includes(accountId);
    if (isSelected) {
      setForm((prev) => ({
        ...prev,
        accountIds: prev.accountIds.filter((id) => id !== accountId),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        accountIds: [...prev.accountIds, accountId],
      }));
    }
  };

  const handleSelectAllAccounts = () => {
    if (form.accountIds.length === allAccounts.length) {
      setForm((prev) => ({ ...prev, accountIds: [] }));
    } else {
      setForm((prev) => ({
        ...prev,
        accountIds: allAccounts.map((acc) => acc.id),
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {isEditing ? "Edit Scenario" : "Create New Scenario"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your scenario settings"
              : "Create a new forecasting scenario with percentage growth or fixed amounts"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium">Basic Information</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Scenario Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Q1 2025 Revenue Growth"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about this scenario..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Scenario Type and Value */}
          <div className="space-y-4">
            <h4 className="font-medium">Scenario Configuration</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Scenario Type *</Label>
                <Select
                  value={form.type}
                  onValueChange={(value: ScenarioType) =>
                    setForm((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Percentage Growth
                      </div>
                    </SelectItem>
                    <SelectItem value="amount">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Fixed Amount
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value">
                  {form.type === "percentage"
                    ? "Growth Rate (%)"
                    : "Amount ($)"}{" "}
                  *
                </Label>
                <Input
                  id="value"
                  type="number"
                  step={form.type === "percentage" ? "0.1" : "1"}
                  placeholder={
                    form.type === "percentage" ? "e.g., 5" : "e.g., 1000"
                  }
                  value={form.value}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      value: Number(e.target.value) || 0,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {form.type === "percentage"
                    ? "Monthly compounding growth rate (e.g., 5 for 5% increase each month)"
                    : "Fixed amount applied to each month in the period"}
                </p>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <h4 className="font-medium">Date Range</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Month *</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={form.startDate.slice(0, 7)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      startDate: e.target.value + "-01",
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Month *</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={form.endDate.slice(0, 7)}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      endDate: e.target.value + "-01",
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Account Selection */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h4 className="font-medium">
                Select Accounts ({form.accountIds.length} selected)
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllAccounts}
              >
                {form.accountIds.length === allAccounts.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-2 border rounded-lg p-3">
              {allAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={form.accountIds.includes(account.id)}
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

          {/* Overlap Warning */}
          {overlapCheck.hasOverlap && (
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-400">
                <strong>Date Overlap Detected:</strong> The selected period
                overlaps with existing scenarios.
                {overlapCheck.overlappingScenarios.length > 0 && (
                  <div className="mt-2">
                    <p>Conflicting scenarios:</p>
                    <ul className="list-disc list-inside mt-1">
                      {overlapCheck.overlappingScenarios.map(
                        (overlappingScenario) => (
                          <li key={overlappingScenario.id} className="text-sm">
                            {overlappingScenario.name} (
                            {new Date(
                              overlappingScenario.startDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                            })}{" "}
                            to{" "}
                            {new Date(
                              overlappingScenario.endDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                            })}
                            )
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={overlapCheck.hasOverlap}>
            {isEditing ? "Update Scenario" : "Create Scenario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
