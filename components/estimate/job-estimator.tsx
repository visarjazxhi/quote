// components/job-estimator-new.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle, Save, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Staff } from "./staff-management";
import { Textarea } from "@/components/ui/textarea";

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

interface JobEstimatorProps {
  staff: Staff[];
  editingEstimation?: {
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
  } | null;
  onEstimationSaved?: () => void;
}

interface SelectedStaff {
  id: string;
  hoursWorked: number;
  budgetedHours: number;
  customRate?: number;
}

export default function JobEstimator({
  staff,
  editingEstimation,
  onEstimationSaved,
}: Readonly<JobEstimatorProps>) {
  const [client, setClient] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<SelectedStaff[]>([]);
  const [clientCharge, setClientCharge] = useState("");
  const [clientManagerId, setClientManagerId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Dialog states
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

  // Helper functions for dialogs
  const showError = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setShowErrorDialog(true);
  };

  const showSuccess = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setShowSuccessDialog(true);
  };

  // Load editing estimation data when it changes
  useEffect(() => {
    if (editingEstimation) {
      setClient(editingEstimation.clientName || "");
      setJobDescription(editingEstimation.description || "");
      setClientCharge(""); // We don't store client charge, so leave empty
      setClientManagerId(editingEstimation.clientManager?.id || "none");

      // Map the team members from the estimation
      const mappedStaff = editingEstimation.teamMembers.map((tm) => ({
        id: tm.teamMember.id,
        hoursWorked: 0, // We can add this later if needed
        budgetedHours: tm.hoursAllocated,
        customRate: tm.customRate,
      }));
      setSelectedStaff(mappedStaff);
    } else {
      // Clear form for new estimation
      setClient("");
      setJobDescription("");
      setClientCharge("");
      setClientManagerId("none");
      setSelectedStaff([]);
    }
  }, [editingEstimation]);

  const handleStaffSelection = (staffId: string) => {
    const isSelected = selectedStaff.some((s) => s.id === staffId);

    if (isSelected) {
      setSelectedStaff(selectedStaff.filter((s) => s.id !== staffId));
    } else {
      setSelectedStaff([
        ...selectedStaff,
        { id: staffId, hoursWorked: 0, budgetedHours: 0 },
      ]);
    }
  };

  const updateStaffField = (
    staffId: string,
    field: keyof SelectedStaff,
    value: number | undefined
  ) => {
    setSelectedStaff(
      selectedStaff.map((s) =>
        s.id === staffId ? { ...s, [field]: value } : s
      )
    );
  };

  // Calculate totals and costs
  const getStaffMember = (id: string) => staff.find((s) => s.id === id);

  const totalBudgetedHours = selectedStaff.reduce(
    (sum, s) => sum + s.budgetedHours,
    0
  );
  const totalBudgetedCost = selectedStaff.reduce((sum, s) => {
    const staffMember = getStaffMember(s.id);
    const rate = s.customRate ?? staffMember?.hourlyRate ?? 0;
    return sum + rate * s.budgetedHours;
  }, 0);

  const profit = parseFloat(clientCharge || "0") - totalBudgetedCost;
  const costPercentage =
    parseFloat(clientCharge) > 0
      ? (totalBudgetedCost / parseFloat(clientCharge)) * 100
      : 0;
  const profitPercentage = 100 - costPercentage;

  const handleSaveEstimation = async () => {
    if (selectedStaff.length === 0) {
      showError(
        "Validation Error",
        "Please select at least one team member before saving the estimation."
      );
      return;
    }

    setSaving(true);
    try {
      const isEditing = editingEstimation !== null;
      const url = isEditing
        ? `/api/job-estimations/${editingEstimation!.id}`
        : "/api/job-estimations";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:
            jobDescription || `Estimation for ${client}` || "New Estimation",
          description: jobDescription,
          clientName: client,
          totalHours: totalBudgetedHours,
          totalCost: totalBudgetedCost,
          clientManagerId: clientManagerId === "none" ? null : clientManagerId || null,
          teamMembers: selectedStaff.map((s) => ({
            teamMemberId: s.id,
            hoursAllocated: s.budgetedHours,
            customRate: s.customRate,
          })),
        }),
      });

      if (response.ok) {
        showSuccess(
          isEditing ? "Estimation Updated" : "Estimation Saved",
          isEditing
            ? "Your estimation has been updated successfully!"
            : "Your estimation has been saved successfully!"
        );

        // Clear the form for new estimations
        if (!isEditing) {
          setClient("");
          setJobDescription("");
          setClientCharge("");
          setClientManagerId("none");
          setSelectedStaff([]);
        }
      } else {
        throw new Error(
          isEditing
            ? "Failed to update estimation"
            : "Failed to save estimation"
        );
      }
    } catch (error) {
      showError(
        editingEstimation ? "Update Failed" : "Save Failed",
        `Failed to ${editingEstimation ? "update" : "save"} estimation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Summary */}
      {selectedStaff.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted p-4 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">
              Total Cost
            </div>
            <div className="text-xl font-bold">
              {formatCurrency(totalBudgetedCost)}
            </div>
          </div>
          <div className="bg-muted p-4 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">
              Client Charge
            </div>
            <div className="text-xl font-bold">
              {clientCharge
                ? formatCurrency(parseFloat(clientCharge))
                : "$0.00"}
            </div>
          </div>
          <div className="bg-muted p-4 rounded-lg border">
            <div className="text-sm font-medium text-muted-foreground">
              Profit ({profitPercentage.toFixed(2)}%)
            </div>
            <div
              className={`text-xl font-bold ${
                profit >= 0 ? "text-green-600" : "text-destructive"
              }`}
            >
              {formatCurrency(profit)}
            </div>
          </div>
        </div>
      )}

      {/* Job Details */}
      <div className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client" className="text-sm font-medium">
              Client Name
            </Label>
            <Input
              id="client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Enter client name"
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientCharge" className="text-sm font-medium">
              Client Charge ($)
            </Label>
            <Input
              id="clientCharge"
              type="number"
              step="0.01"
              min="0"
              value={clientCharge}
              onChange={(e) => setClientCharge(e.target.value)}
              placeholder="0.00"
              className="h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientManager" className="text-sm font-medium">
              Client Manager
            </Label>
            <Select value={clientManagerId} onValueChange={setClientManagerId}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select client manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No manager assigned</SelectItem>
                {staff.filter(member => member.isActive).map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} - {formatCurrency(member.hourlyRate)}/h
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobDescription" className="text-sm font-medium">
            Job Description
          </Label>
          <Textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Enter detailed job description..."
            rows={3}
            className="resize-none"
          />
        </div>
      </div>

      {/* Staff Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Select Team Members</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {staff.map((staffMember) => (
            <Button
              key={staffMember.id}
              type="button"
              variant={
                selectedStaff.some((s) => s.id === staffMember.id)
                  ? "default"
                  : "outline"
              }
              onClick={() => handleStaffSelection(staffMember.id)}
              className="w-full text-xs justify-between px-2 py-2 h-auto"
            >
              <span className="truncate">{staffMember.name}</span>
              <span className="text-xs opacity-70 ml-1">
                {formatCurrency(staffMember.hourlyRate)}/h
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Hours Input Table */}
      {selectedStaff.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px] font-semibold text-xs">
                  Staff Member
                </TableHead>
                <TableHead className="w-[70px] text-right font-semibold text-xs">
                  Rate
                </TableHead>
                <TableHead className="w-[80px] text-center font-semibold text-xs">
                  Past Hrs
                </TableHead>
                <TableHead className="w-[80px] text-right font-semibold text-xs">
                  Past Cost
                </TableHead>
                <TableHead className="w-[80px] text-center font-semibold text-xs">
                  Budget Hrs
                </TableHead>
                <TableHead className="w-[80px] text-right font-semibold text-xs">
                  Budget Cost
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedStaff.map((selected) => {
                const staffMember = getStaffMember(selected.id);
                if (!staffMember) return null;

                const cost = staffMember.hourlyRate * selected.hoursWorked;
                const budgetedCost =
                  staffMember.hourlyRate * selected.budgetedHours;

                return (
                  <TableRow key={selected.id}>
                    <TableCell className="py-2 font-medium text-sm">
                      {staffMember.name}
                    </TableCell>
                    <TableCell className="text-right py-2 font-mono text-xs text-muted-foreground">
                      {formatCurrency(staffMember.hourlyRate)}
                    </TableCell>
                    <TableCell className="py-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={selected.hoursWorked || ""}
                        onChange={(e) =>
                          updateStaffField(
                            selected.id,
                            "hoursWorked",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0"
                        className="w-14 h-7 text-center mx-auto text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </TableCell>
                    <TableCell className="text-right py-2 font-mono text-xs">
                      {formatCurrency(cost)}
                    </TableCell>
                    <TableCell className="py-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={selected.budgetedHours || ""}
                        onChange={(e) =>
                          updateStaffField(
                            selected.id,
                            "budgetedHours",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        placeholder="0"
                        className="w-14 h-7 text-center mx-auto text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </TableCell>
                    <TableCell className="text-right py-2 font-mono text-xs">
                      {formatCurrency(budgetedCost)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow className="font-medium">
                <TableCell colSpan={2} className="text-right text-sm">
                  Totals:
                </TableCell>
                <TableCell className="text-center text-sm">
                  {selectedStaff
                    .reduce((sum, s) => sum + s.hoursWorked, 0)
                    .toFixed(2)}
                  h
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {formatCurrency(
                    selectedStaff.reduce((sum, s) => {
                      const staffMember = getStaffMember(s.id);
                      return (
                        sum +
                        (staffMember
                          ? staffMember.hourlyRate * s.hoursWorked
                          : 0)
                      );
                    }, 0)
                  )}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {totalBudgetedHours.toFixed(2)}h
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-bold">
                  {formatCurrency(totalBudgetedCost)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}

      {/* Save Button */}
      {selectedStaff.length > 0 && (
        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSaveEstimation}
            disabled={saving}
            className="min-w-32"
          >
            <Save className="h-4 w-4 mr-2" />
            {(() => {
              if (saving) {
                return editingEstimation ? "Updating..." : "Saving...";
              }
              return editingEstimation
                ? "Update Estimation"
                : "Save Estimation";
            })()}
          </Button>
        </div>
      )}

      {/* Error Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              {dialogTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowErrorDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              {dialogTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowSuccessDialog(false);
                // Auto-close and notify parent for success dialogs
                setTimeout(() => {
                  onEstimationSaved?.();
                }, 100);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
