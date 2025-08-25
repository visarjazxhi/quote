"use client";

import { AlertTriangle, Clock, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JobTeam, ManualHourDistribution } from "@/lib/store";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ManualHourDistributionProps {
  isOpen: boolean;
  onClose: () => void;
  jobTeam: JobTeam;
  totalHours: number;
  currentDistribution?: ManualHourDistribution[];
  onSave: (distribution: ManualHourDistribution[]) => void;
}

export default function ManualHourDistributionDialog({
  isOpen,
  onClose,
  jobTeam,
  totalHours,
  currentDistribution,
  onSave,
}: ManualHourDistributionProps) {
  const [distribution, setDistribution] = useState<ManualHourDistribution[]>(
    []
  );

  // Initialize distribution when dialog opens
  useEffect(() => {
    if (isOpen && jobTeam) {
      if (currentDistribution && currentDistribution.length > 0) {
        // Use existing distribution
        setDistribution(currentDistribution);
      } else {
        // Initialize with equal distribution
        const hoursPerMember = totalHours / jobTeam.members.length;
        const initialDistribution = jobTeam.members.map((member) => ({
          memberId: member.id,
          memberName: member.name,
          hourlyRate: member.hourlyRate,
          allocatedHours: Math.round(hoursPerMember * 10) / 10, // Round to 1 decimal
        }));
        setDistribution(initialDistribution);
      }
    }
  }, [isOpen, jobTeam, totalHours, currentDistribution]);

  const updateMemberHours = (memberId: string, hours: number) => {
    setDistribution((prev) =>
      prev.map((item) =>
        item.memberId === memberId
          ? { ...item, allocatedHours: Math.max(0, hours) }
          : item
      )
    );
  };

  const getTotalAllocatedHours = () => {
    return distribution.reduce((sum, item) => sum + item.allocatedHours, 0);
  };

  const getTotalCost = () => {
    return distribution.reduce(
      (sum, item) => sum + item.allocatedHours * item.hourlyRate,
      0
    );
  };

  const getRemainingHours = () => {
    return totalHours - getTotalAllocatedHours();
  };

  const isValidDistribution = () => {
    const totalAllocated = getTotalAllocatedHours();
    return Math.abs(totalAllocated - totalHours) < 0.1; // Allow small rounding differences
  };

  const handleAutoDistribute = () => {
    const hoursPerMember = totalHours / jobTeam.members.length;
    const newDistribution = distribution.map((item) => ({
      ...item,
      allocatedHours: Math.round(hoursPerMember * 10) / 10,
    }));
    setDistribution(newDistribution);
  };

  const handleSave = () => {
    if (!isValidDistribution()) {
      toast.error(
        `Please allocate all ${totalHours} hours. Currently allocated: ${getTotalAllocatedHours().toFixed(
          1
        )} hours`
      );
      return;
    }

    onSave(distribution);
    toast.success("Manual hour distribution saved successfully!");
    onClose();
  };

  const handleReset = () => {
    setDistribution((prev) =>
      prev.map((item) => ({ ...item, allocatedHours: 0 }))
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Manual Hour Distribution - {jobTeam.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Total Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalHours}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Allocated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getTotalAllocatedHours().toFixed(1)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${
                    Math.abs(getRemainingHours()) < 0.1
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {getRemainingHours().toFixed(1)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Total Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${getTotalCost().toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribution Actions */}
          <div className="flex gap-2">
            <Button onClick={handleAutoDistribute} variant="outline" size="sm">
              Auto Distribute Equally
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              Reset All
            </Button>
          </div>

          {/* Team Members Hour Distribution */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              Distribute Hours by Team Member
            </h3>

            {distribution.map((member) => (
              <Card key={member.memberId}>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Member Info */}
                    <div>
                      <Label className="font-medium">{member.memberName}</Label>
                      <p className="text-sm text-gray-500">
                        ${member.hourlyRate.toFixed(2)}/hr
                      </p>
                    </div>

                    {/* Hours Input */}
                    <div>
                      <Label className="text-xs text-gray-500">Hours</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max={totalHours}
                        value={member.allocatedHours}
                        onChange={(e) =>
                          updateMemberHours(
                            member.memberId,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Cost Calculation */}
                    <div>
                      <Label className="text-xs text-gray-500">
                        Member Cost
                      </Label>
                      <div className="text-lg font-semibold">
                        $
                        {(member.allocatedHours * member.hourlyRate).toFixed(2)}
                      </div>
                    </div>

                    {/* Percentage */}
                    <div>
                      <Label className="text-xs text-gray-500">
                        % of Total
                      </Label>
                      <div className="text-sm">
                        {totalHours > 0
                          ? (
                              (member.allocatedHours / totalHours) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Validation Message */}
          {!isValidDistribution() && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Please allocate all {totalHours} hours. Currently allocated:{" "}
                {getTotalAllocatedHours().toFixed(1)} hours
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isValidDistribution()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Distribution
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

