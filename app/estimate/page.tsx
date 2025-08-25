"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Building2,
  Calculator,
  Download,
  Edit,
  FileText,
  Trash2,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Removed unused table imports
import StaffManagement, { Staff } from "@/components/estimate/staff-management";
import {
  exportEstimationToExcel,
  exportEstimationToPDF,
} from "@/lib/estimation-exports";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import JobEstimator from "@/components/estimate/job-estimator";

interface JobEstimation {
  id: string;
  name: string;
  description?: string;
  clientName?: string;
  clientEmail?: string;
  totalHours: number;
  totalCost: number;
  clientManager?: {
    id: string;
    name: string;
    hourlyRate: number;
  };
  createdAt: string;
  teamMembers: {
    id: string;
    hoursAllocated: number;
    customRate?: number;
    teamMember: {
      id: string;
      name: string;
      hourlyRate: number;
    };
  }[];
}

// Removed statusColors since we're not showing status badges

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function EstimatePage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [estimations, setEstimations] = useState<JobEstimation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEstimation, setEditingEstimation] =
    useState<JobEstimation | null>(null);

  const handleStaffChange = (newStaff: Staff[]) => {
    setStaff(newStaff);
  };

  const fetchEstimations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/job-estimations");
      if (!response.ok) {
        throw new Error("Failed to fetch job estimations");
      }
      const data = await response.json();
      setEstimations(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch job estimations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimations();
  }, []);

  const handleDeleteEstimation = async (id: string) => {
    try {
      const response = await fetch(`/api/job-estimations/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job estimation");
      }

      await fetchEstimations(); // Refresh the list
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete job estimation"
      );
    }
  };

  const handleEstimationSaved = () => {
    fetchEstimations(); // Refresh the list when a new estimation is saved
    setEditingEstimation(null); // Clear editing state
  };

  const handleEditEstimation = (estimation: JobEstimation) => {
    setEditingEstimation(estimation);
  };

  const handleCancelEdit = () => {
    setEditingEstimation(null);
  };

  const handleExportPDF = (estimation: JobEstimation) => {
    try {
      exportEstimationToPDF(estimation);
    } catch {
      setError("Failed to export PDF");
    }
  };

  const handleExportExcel = (estimation: JobEstimation) => {
    try {
      exportEstimationToExcel(estimation);
    } catch (error) {
      console.error("Excel export error:", error);
      setError(
        `Failed to export Excel: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Left Column - Team Management & Estimations List */}
          <div className="lg:col-span-5 space-y-6">
            {/* Staff Management */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StaffManagement
                  onStaffChange={handleStaffChange}
                  estimations={estimations}
                />
              </CardContent>
            </Card>

            {/* Estimations List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Saved Estimations ({estimations.length})
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setEditingEstimation(null)}
                    className="h-8"
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    New
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive text-sm">{error}</p>
                  </div>
                )}

                {loading ? (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50 animate-pulse" />
                    <p className="text-muted-foreground text-sm">
                      Loading estimations...
                    </p>
                  </div>
                ) : estimations.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-muted-foreground text-sm">
                      No estimations yet
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Create your first estimation below
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {estimations.map((estimation) => (
                      <div
                        key={estimation.id}
                        className={`p-3 border rounded-lg transition-colors ${
                          editingEstimation?.id === estimation.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {estimation.clientName && (
                              <div className="text-xs text-muted-foreground">
                                Client: {estimation.clientName}
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {formatCurrency(estimation.totalCost)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {estimation.totalHours}h
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="text-xs text-muted-foreground">
                                {formatDate(estimation.createdAt)} •{" "}
                                {estimation.teamMembers.length} member
                                {estimation.teamMembers.length !== 1 ? "s" : ""}
                              </div>
                              {estimation.clientManager && (
                                <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                                  Manager: {estimation.clientManager.name}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditEstimation(estimation)}
                              className="h-8 w-8 p-0"
                              title="Edit estimation"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title="Export estimation"
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleExportPDF(estimation)}
                                >
                                  Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleExportExcel(estimation)}
                                >
                                  Export as Excel
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  title="Delete estimation"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Estimation
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete{" "}
                                    <strong>
                                      &quot;{estimation.name}&quot;
                                    </strong>
                                    ? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleDeleteEstimation(estimation.id)
                                    }
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Job Estimator */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    {editingEstimation
                      ? "Edit Estimation"
                      : "New Job Estimation"}
                  </div>
                  {editingEstimation && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <JobEstimator
                  staff={staff}
                  editingEstimation={editingEstimation}
                  onEstimationSaved={handleEstimationSaved}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
