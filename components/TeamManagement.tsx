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
} from "@/components/ui/alert-dialog";
import {
  Calculator,
  Edit,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface TeamMember {
  id?: string;
  name: string;
  hourlyRate: number;
}

interface JobTeam {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  averageCost: number;
  createdAt: string;
  updatedAt: string;
}

interface TeamManagementProps {
  trigger?: React.ReactNode;
  onTeamChange?: () => void;
}

export function TeamManagement({ trigger, onTeamChange }: TeamManagementProps) {
  const [teams, setTeams] = useState<JobTeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<JobTeam | null>(null);
  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);

  // Form state
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "", hourlyRate: 0 },
  ]);
  const [saving, setSaving] = useState(false);

  // Load teams
  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/job-teams");
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      } else {
        throw new Error("Failed to fetch teams");
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dialogOpen) {
      fetchTeams();
    }
  }, [dialogOpen]);

  const resetForm = () => {
    setTeamName("");
    setTeamDescription("");
    setTeamMembers([{ name: "", hourlyRate: 0 }]);
    setEditingTeam(null);
  };

  const openEditDialog = (team: JobTeam) => {
    setEditingTeam(team);
    setTeamName(team.name);
    setTeamDescription(team.description || "");
    setTeamMembers(
      team.members.length > 0
        ? [...team.members]
        : [{ name: "", hourlyRate: 0 }]
    );
    setDialogOpen(true);
  };

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", hourlyRate: 0 }]);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (
    index: number,
    field: keyof TeamMember,
    value: string | number
  ) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const calculateAverageCost = () => {
    const validMembers = teamMembers.filter((m) => m.name && m.hourlyRate > 0);
    if (validMembers.length === 0) return 0;
    return (
      validMembers.reduce((sum, member) => sum + member.hourlyRate, 0) /
      validMembers.length
    );
  };

  const handleSave = async () => {
    if (!teamName.trim()) {
      toast.error("Team name is required");
      return;
    }

    const validMembers = teamMembers.filter(
      (m) => m.name.trim() && m.hourlyRate > 0
    );
    if (validMembers.length === 0) {
      toast.error("At least one team member is required");
      return;
    }

    setSaving(true);
    try {
      const url = editingTeam
        ? `/api/job-teams/${editingTeam.id}`
        : "/api/job-teams";
      const method = editingTeam ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName.trim(),
          description: teamDescription.trim() || null,
          members: validMembers,
        }),
      });

      if (response.ok) {
        toast.success(
          editingTeam
            ? "Team updated successfully"
            : "Team created successfully"
        );
        await fetchTeams();
        onTeamChange?.();
        setDialogOpen(false);
        resetForm();
      } else {
        throw new Error(`Failed to ${editingTeam ? "update" : "create"} team`);
      }
    } catch (error) {
      console.error("Error saving team:", error);
      toast.error(`Failed to ${editingTeam ? "update" : "create"} team`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (teamId: string) => {
    try {
      const response = await fetch(`/api/job-teams/${teamId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Team deleted successfully");
        await fetchTeams();
        onTeamChange?.();
      } else {
        throw new Error("Failed to delete team");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team");
    } finally {
      setDeleteTeamId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          {trigger || (
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Manage Teams
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Management
            </DialogTitle>
            <DialogDescription>
              Create and manage job teams with their members and hourly rates
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Create/Edit Team Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingTeam ? "Edit Team" : "Create New Team"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="team-name">Team Name *</Label>
                    <Input
                      id="team-name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter team name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Average Cost</Label>
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                      <Calculator className="h-4 w-4" />
                      {formatCurrency(calculateAverageCost())}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team-description">Description</Label>
                  <Textarea
                    id="team-description"
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="Enter team description (optional)"
                    rows={2}
                  />
                </div>

                {/* Team Members */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Team Members *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTeamMember}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Member
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Input
                            placeholder="Member name"
                            value={member.name}
                            onChange={(e) =>
                              updateTeamMember(index, "name", e.target.value)
                            }
                          />
                        </div>
                        <div className="w-32">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Rate/hour"
                            value={member.hourlyRate || ""}
                            onChange={(e) =>
                              updateTeamMember(
                                index,
                                "hourlyRate",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTeamMember(index)}
                          disabled={teamMembers.length === 1}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving
                      ? "Saving..."
                      : editingTeam
                      ? "Update Team"
                      : "Create Team"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Existing Teams */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Existing Teams</h3>
              {loading ? (
                <div className="text-center py-8">Loading teams...</div>
              ) : teams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No teams created yet
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.map((team) => (
                    <Card key={team.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">
                              {team.name}
                            </CardTitle>
                            {team.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {team.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(team)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteTeamId(team.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Average Cost:
                            </span>
                            <Badge variant="secondary" className="font-mono">
                              {formatCurrency(team.averageCost)}/hr
                            </Badge>
                          </div>
                          <div>
                            <span className="text-sm font-medium">
                              Members ({team.members.length}):
                            </span>
                            <div className="mt-1 space-y-1">
                              {team.members.map((member, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-xs"
                                >
                                  <span>{member.name}</span>
                                  <span className="font-mono">
                                    {formatCurrency(member.hourlyRate)}/hr
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTeamId}
        onOpenChange={() => setDeleteTeamId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this team? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTeamId && handleDelete(deleteTeamId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
