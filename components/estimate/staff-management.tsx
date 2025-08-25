// components/staff-management.tsx
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
import { Edit2, Plus, Save, Trash2, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Staff {
  id: string;
  name: string;
  hourlyRate: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface StaffManagementProps {
  onStaffChange?: (staff: Staff[]) => void;
  estimations?: {
    id: string;
    name: string;
    teamMembers: {
      teamMember: {
        id: string;
      };
    }[];
  }[];
}

export default function StaffManagement({
  onStaffChange,
  estimations = [],
}: Readonly<StaffManagementProps>) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRate, setNewRate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch staff from database
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/team-members");
      if (!response.ok) {
        throw new Error("Failed to fetch team members");
      }
      const data = await response.json();
      setStaff(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch team members"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Notify parent when staff changes
  useEffect(() => {
    if (staff.length > 0) {
      onStaffChange?.(staff);
    }
  }, [staff, onStaffChange]);

  const handleAddStaff = async () => {
    if (!newName || !newRate) return;

    try {
      const response = await fetch("/api/team-members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          hourlyRate: parseFloat(newRate),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create team member");
      }

      setNewName("");
      setNewRate("");
      setIsAddingNew(false);
      await fetchStaff(); // Refresh the list
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create team member"
      );
    }
  };

  const handleUpdateStaff = async (id: string, name: string, rate: string) => {
    if (!name || !rate) return;

    try {
      const response = await fetch(`/api/team-members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          hourlyRate: parseFloat(rate),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update team member");
      }

      setEditingId(null);
      await fetchStaff(); // Refresh the list
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update team member"
      );
    }
  };

  // Check if team member is used in any estimations
  const getTeamMemberUsage = (teamMemberId: string) => {
    const usedInEstimations = estimations.filter((estimation) =>
      estimation.teamMembers.some((tm) => tm.teamMember.id === teamMemberId)
    );
    return usedInEstimations;
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/team-members/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete team member");
      }

      await fetchStaff(); // Refresh the list
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete team member"
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50 animate-pulse" />
          <p className="text-sm">Loading team members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8 text-destructive">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchStaff}
            className="mt-2"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add New Staff Form */}
      {isAddingNew ? (
        <div className="p-4 bg-muted rounded-lg border">
          <div className="space-y-3">
            <div>
              <Label htmlFor="newName" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter staff name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newRate" className="text-sm font-medium">
                Hourly Rate ($)
              </Label>
              <Input
                id="newRate"
                type="number"
                step="0.01"
                min="0"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddStaff}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAddingNew(false);
                  setNewName("");
                  setNewRate("");
                }}
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsAddingNew(true)}
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      )}

      {/* Staff List */}
      <div className="space-y-2">
        {staff.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No team members yet</p>
          </div>
        ) : (
          staff.map((member) => {
            const usedInEstimations = getTeamMemberUsage(member.id);
            return (
              <StaffMemberRow
                key={member.id}
                member={member}
                isEditing={editingId === member.id}
                onEdit={() => setEditingId(member.id)}
                onSave={(name, rate) =>
                  handleUpdateStaff(member.id, name, rate)
                }
                onCancel={() => setEditingId(null)}
                onDelete={() => handleDelete(member.id)}
                formatCurrency={formatCurrency}
                usedInEstimations={usedInEstimations}
              />
            );
          })
        )}
      </div>

      {staff.length > 0 && (
        <div className="pt-3 border-t">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{staff.length}</span> team member
            {staff.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
}

interface StaffMemberRowProps {
  member: Staff;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (name: string, rate: string) => void;
  onCancel: () => void;
  onDelete: () => void;
  formatCurrency: (amount: number) => string;
  usedInEstimations: {
    id: string;
    name: string;
  }[];
}

function StaffMemberRow({
  member,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  formatCurrency,
  usedInEstimations,
}: Readonly<StaffMemberRowProps>) {
  const [editName, setEditName] = useState(member.name);
  const [editRate, setEditRate] = useState(member.hourlyRate.toString());

  const handleSave = () => {
    if (editName && editRate) {
      onSave(editName, editRate);
    }
  };

  const handleCancel = () => {
    setEditName(member.name);
    setEditRate(member.hourlyRate.toString());
    onCancel();
  };

  if (isEditing) {
    return (
      <div className="p-3 bg-muted rounded-lg border">
        <div className="space-y-3">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Name"
            className="h-8"
          />
          <Input
            type="number"
            step="0.01"
            min="0"
            value={editRate}
            onChange={(e) => setEditRate(e.target.value)}
            placeholder="Hourly rate"
            className="h-8"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              <Save className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isUsedInEstimations = usedInEstimations.length > 0;

  return (
    <div className="flex items-center justify-between p-3 bg-card rounded-lg border hover:bg-accent transition-colors">
      <div className="flex-1">
        <div className="font-medium">{member.name}</div>
        <div className="text-sm text-muted-foreground">
          {formatCurrency(member.hourlyRate)}/hour
        </div>
        {isUsedInEstimations && (
          <div className="text-xs text-orange-600 mt-1">
            Used in {usedInEstimations.length} estimation
            {usedInEstimations.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={onEdit}
          className="h-8 w-8 p-0"
        >
          <Edit2 className="h-3 w-3" />
        </Button>
        {isUsedInEstimations ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-muted-foreground/50"
                title={`Cannot delete: used in ${usedInEstimations.length} estimation(s)`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cannot Delete Team Member</AlertDialogTitle>
                <AlertDialogDescription>
                  {member.name} is currently used in the following estimation
                  {usedInEstimations.length !== 1 ? "s" : ""}:
                  <br />
                  <strong>
                    {usedInEstimations.map((est) => est.name).join(", ")}
                  </strong>
                  <br />
                  <br />
                  Please remove them from these estimations before deleting.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                title="Delete team member"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <strong>{member.name}</strong>
                  ? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
