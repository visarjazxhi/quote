"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  FileText,
  Calendar,
  Building2,
  Users,
  TrendingUp,
  Trash2,
  Edit,
} from "lucide-react";
import {
  useForecastDatabase,
  type ForecastInstance,
  type CreateForecastData,
} from "@/lib/forecast/hooks/use-forecast-database";
import { toast } from "sonner";

const INDUSTRY_OPTIONS = [
  { value: "technology", label: "Technology" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "professional_services", label: "Professional Services" },
  { value: "healthcare", label: "Healthcare" },
  { value: "construction", label: "Construction" },
  { value: "hospitality", label: "Hospitality" },
  { value: "education", label: "Education" },
  { value: "finance", label: "Finance" },
  { value: "other", label: "Other" },
];

const BUSINESS_TYPE_OPTIONS = [
  { value: "sole_trader", label: "Sole Trader" },
  { value: "partnership", label: "Partnership" },
  { value: "company", label: "Company" },
  { value: "trust", label: "Trust" },
  { value: "other", label: "Other" },
];

interface ForecastManagerProps {
  readonly onForecastSelect?: (
    forecastId: string,
    forecast?: { id: string; name: string; companyName?: string }
  ) => void;
}

export function ForecastManager({ onForecastSelect }: ForecastManagerProps) {
  const [forecasts, setForecasts] = useState<ForecastInstance[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState<CreateForecastData>({
    name: "",
    description: "",
    companyName: "",
    industry: "",
    businessType: "",
    establishedYear: undefined,
    employeeCount: undefined,
    taxRate: 25,
    targetIncome: 0,
  });

  const { loading, error, createForecast, getForecasts, deleteForecast } =
    useForecastDatabase();

  const loadForecasts = useCallback(async () => {
    try {
      const data = await getForecasts();
      setForecasts(data);
    } catch {
      toast.error("Failed to load forecasts");
    }
  }, [getForecasts]);

  // Load forecasts on component mount
  useEffect(() => {
    loadForecasts();
  }, [loadForecasts]);

  const handleCreateForecast = async () => {
    try {
      const newForecast = await createForecast(createFormData);
      toast.success("Forecast created successfully!");
      setIsCreateDialogOpen(false);
      setCreateFormData({
        name: "",
        description: "",
        companyName: "",
        industry: "",
        businessType: "",
        establishedYear: undefined,
        employeeCount: undefined,
        taxRate: 25,
        targetIncome: 0,
      });
      await loadForecasts();

      // Automatically select the new forecast
      if (onForecastSelect) {
        onForecastSelect(newForecast.id, newForecast);
      }
    } catch {
      toast.error("Failed to create forecast");
    }
  };

  const handleDeleteForecast = async (forecastId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this forecast? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteForecast(forecastId);
      toast.success("Forecast deleted successfully!");
      await loadForecasts();
    } catch {
      toast.error("Failed to delete forecast");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      case "template":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Forecast Manager
          </h2>
          <p className="text-muted-foreground">
            Create, manage, and switch between different forecast instances
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Forecast
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Forecast</DialogTitle>
              <DialogDescription>
                Set up a new financial forecast instance with company details
                and settings.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Forecast Name *</Label>
                  <Input
                    id="name"
                    value={createFormData.name}
                    onChange={(e) =>
                      setCreateFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g., 2024 Business Plan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={createFormData.companyName}
                    onChange={(e) =>
                      setCreateFormData((prev) => ({
                        ...prev,
                        companyName: e.target.value,
                      }))
                    }
                    placeholder="Your Company Ltd"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={createFormData.description}
                  onChange={(e) =>
                    setCreateFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of this forecast..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={createFormData.industry}
                    onValueChange={(value) =>
                      setCreateFormData((prev) => ({
                        ...prev,
                        industry: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select
                    value={createFormData.businessType}
                    onValueChange={(value) =>
                      setCreateFormData((prev) => ({
                        ...prev,
                        businessType: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    value={createFormData.establishedYear ?? ""}
                    onChange={(e) =>
                      setCreateFormData((prev) => ({
                        ...prev,
                        establishedYear: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                    placeholder="2020"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeCount">Employee Count</Label>
                  <Input
                    id="employeeCount"
                    type="number"
                    value={createFormData.employeeCount ?? ""}
                    onChange={(e) =>
                      setCreateFormData((prev) => ({
                        ...prev,
                        employeeCount: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      }))
                    }
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={createFormData.taxRate}
                    onChange={(e) =>
                      setCreateFormData((prev) => ({
                        ...prev,
                        taxRate: parseFloat(e.target.value) || 25,
                      }))
                    }
                    placeholder="25"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateForecast}
                disabled={loading || !createFormData.name}
              >
                {loading ? "Creating..." : "Create Forecast"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Forecasts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && forecasts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">Loading forecasts...</p>
          </div>
        ) : forecasts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No forecasts yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first forecast to get started with financial planning.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Forecast
            </Button>
          </div>
        ) : (
          forecasts.map((forecast) => (
            <Card key={forecast.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{forecast.name}</CardTitle>
                    {forecast.companyName && (
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Building2 className="mr-1 h-3 w-3" />
                        {forecast.companyName}
                      </p>
                    )}
                  </div>
                  <Badge variant={getStatusBadgeVariant(forecast.status)}>
                    {forecast.status}
                  </Badge>
                </div>
                {forecast.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {forecast.description}
                  </p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {forecast.industry && (
                    <div className="flex items-center">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {INDUSTRY_OPTIONS.find(
                        (opt) => opt.value === forecast.industry
                      )?.label || forecast.industry}
                    </div>
                  )}
                  {forecast.employeeCount && (
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {forecast.employeeCount} employees
                    </div>
                  )}
                  <div className="flex items-center col-span-2">
                    <Calendar className="mr-1 h-3 w-3" />
                    Updated {formatDate(forecast.updatedAt)}
                  </div>
                </div>

                {/* Stats */}
                {forecast._count && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{forecast._count.categories} categories</span>
                    <span>{forecast._count.forecastRecords} records</span>
                    <span>{forecast._count.scenarios} scenarios</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (onForecastSelect) {
                        onForecastSelect(forecast.id, forecast);
                      }
                    }}
                    disabled={loading}
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteForecast(forecast.id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
