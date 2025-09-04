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
import { Calculator, Edit, Trash2, UserMinus, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useCallback, useEffect, useState } from "react";
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

interface AvailableMember {
  id: string;
  name: string;
  hourlyRate: number;
  isActive: boolean;
}

interface TeamManagementProps {
  trigger?: React.ReactNode;
  onTeamChange?: () => void;
}

export function TeamManagement({ trigger, onTeamChange }: TeamManagementProps) {
  const [teams, setTeams] = useState<JobTeam[]>([]);
  const [availableMembers, setAvailableMembers] = useState<AvailableMember[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<JobTeam | null>(null);
  const [deleteTeamId, setDeleteTeamId] = useState<string | null>(null);

  // Form state for teams
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Form state for members
  const [memberName, setMemberName] = useState("");
  const [memberRate, setMemberRate] = useState<number>(0);
  const [editingMember, setEditingMember] = useState<AvailableMember | null>(
    null
  );
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  const [savingMember, setSavingMember] = useState(false);

  // Load teams and available members
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
    }
  };

  const fetchAvailableMembers = async () => {
    try {
      const response = await fetch("/api/team-members");
      if (response.ok) {
        const data = await response.json();
        setAvailableMembers(data);
      } else {
        throw new Error("Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load members");
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchTeams(), fetchAvailableMembers()]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (dialogOpen) {
      fetchData();
    }
  }, [dialogOpen, fetchData]);

  const resetForm = () => {
    setTeamName("");
    setTeamDescription("");
    setSelectedMembers([]);
    setEditingTeam(null);
  };

  const resetMemberForm = () => {
    setMemberName("");
    setMemberRate(0);
    setEditingMember(null);
  };

  const openEditDialog = (team: JobTeam) => {
    setEditingTeam(team);
    setTeamName(team.name);
    setTeamDescription(team.description || "");
    // Extract member IDs from the team's members
    const memberIds = team.members
      .map((member) => member.id)
      .filter((id): id is string => id !== undefined);
    setSelectedMembers(memberIds);
    setDialogOpen(true);
  };

  const addMemberToTeam = (memberId: string) => {
    if (!selectedMembers.includes(memberId)) {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const removeMemberFromTeam = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
  };

  const getSelectedMemberDetails = () => {
    return selectedMembers
      .map((memberId) => {
        const member = availableMembers.find((m) => m.id === memberId);
        return member
          ? {
              id: member.id,
              name: member.name,
              hourlyRate: member.hourlyRate,
            }
          : null;
      })
      .filter(Boolean) as TeamMember[];
  };

  const calculateAverageCost = () => {
    const memberDetails = getSelectedMemberDetails();
    if (memberDetails.length === 0) return 0;
    return (
      memberDetails.reduce((sum, member) => sum + member.hourlyRate, 0) /
      memberDetails.length
    );
  };

  const handleSave = async () => {
    if (!teamName.trim()) {
      toast.error("Team name is required");
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error("At least one team member is required");
      return;
    }

    setSaving(true);
    try {
      const url = editingTeam
        ? `/api/job-teams/${editingTeam.id}`
        : "/api/job-teams";
      const method = editingTeam ? "PUT" : "POST";

      const memberDetails = getSelectedMemberDetails();

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName.trim(),
          description: teamDescription.trim() || null,
          members: memberDetails,
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

  const getUnselectedMembers = () => {
    return availableMembers.filter(
      (member) => !selectedMembers.includes(member.id)
    );
  };

  // Member management functions
  const openEditMemberDialog = (member: AvailableMember) => {
    setEditingMember(member);
    setMemberName(member.name);
    setMemberRate(member.hourlyRate);
  };

  const handleSaveMember = async () => {
    if (!memberName.trim()) {
      toast.error("Member name is required");
      return;
    }

    if (memberRate <= 0) {
      toast.error("Hourly rate must be greater than 0");
      return;
    }

    setSavingMember(true);
    try {
      const url = editingMember
        ? `/api/team-members/${editingMember.id}`
        : "/api/team-members";
      const method = editingMember ? "PUT" : "POST";

      console.log("Saving member:", {
        name: memberName.trim(),
        hourlyRate: memberRate,
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: memberName.trim(),
          hourlyRate: memberRate,
        }),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        // Parse JSON response properly
        let responseData;
        try {
          responseData = await response.json();
          console.log("Response data:", responseData);
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", parseError);
          // Still continue if the operation was successful
        }

        toast.success(
          editingMember
            ? "Member updated successfully"
            : "Member created successfully"
        );
        await fetchAvailableMembers();
        await fetchTeams(); // Refresh teams in case member rates changed
        onTeamChange?.();
        resetMemberForm();
      } else {
        let errorMessage = `HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(
          `Failed to ${
            editingMember ? "update" : "create"
          } member: ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("Error saving member:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(`Failed to ${editingMember ? "update" : "create"} member`);
      }
    } finally {
      setSavingMember(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/team-members/${memberId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Member deleted successfully");
        await fetchAvailableMembers();
        await fetchTeams(); // Refresh teams in case deleted member was in teams
        onTeamChange?.();
      } else {
        throw new Error("Failed to delete member");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete member");
    } finally {
      setDeleteMemberId(null);
    }
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team & Member Management
            </DialogTitle>
            <DialogDescription>
              Manage team members and create job teams
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="teams" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>

            {/* Teams Tab */}
            <TabsContent value="teams" className="space-y-6">
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

                  {/* Team Member Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Team Members *</Label>
                      {availableMembers.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          No members available. Create members in the Members
                          tab first.
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Select onValueChange={addMemberToTeam} value="">
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Add member" />
                            </SelectTrigger>
                            <SelectContent>
                              {getUnselectedMembers().map((member) => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name} -{" "}
                                  {formatCurrency(member.hourlyRate)}/hr
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {/* Selected Members Display */}
                    <div className="space-y-2">
                      {selectedMembers.length === 0 ? (
                        <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-md">
                          No members selected
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {getSelectedMemberDetails().map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 border rounded-md"
                            >
                              <div className="flex items-center gap-3">
                                <div className="font-medium">{member.name}</div>
                                <Badge
                                  variant="secondary"
                                  className="font-mono"
                                >
                                  {formatCurrency(member.hourlyRate)}/hr
                                </Badge>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeMemberFromTeam(member.id!)}
                              >
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
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
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              {/* Create/Edit Member Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingMember ? "Edit Member" : "Create New Member"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="member-name">Member Name *</Label>
                      <Input
                        id="member-name"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        placeholder="Enter member name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="member-rate">Hourly Rate (AUD) *</Label>
                      <Input
                        id="member-rate"
                        type="number"
                        step="0.01"
                        min="0"
                        value={memberRate || ""}
                        onChange={(e) =>
                          setMemberRate(parseFloat(e.target.value) || 0)
                        }
                        placeholder="Enter hourly rate"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSaveMember} disabled={savingMember}>
                      {savingMember
                        ? "Saving..."
                        : editingMember
                        ? "Update Member"
                        : "Create Member"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetMemberForm();
                      }}
                    >
                      {editingMember ? "Cancel" : "Clear"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Existing Members */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Existing Members</h3>
                {loading ? (
                  <div className="text-center py-8">Loading members...</div>
                ) : availableMembers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No members created yet
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableMembers.map((member) => (
                      <Card key={member.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base">
                                {member.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Calculator className="h-4 w-4 text-muted-foreground" />
                                <Badge
                                  variant="secondary"
                                  className="font-mono"
                                >
                                  {formatCurrency(member.hourlyRate)}/hr
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditMemberDialog(member)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteMemberId(member.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Delete Team Confirmation Dialog */}
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

      {/* Delete Member Confirmation Dialog */}
      <AlertDialog
        open={!!deleteMemberId}
        onOpenChange={() => setDeleteMemberId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this member? This action cannot be
              undone. The member will be removed from all teams they belong to.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteMemberId && handleDeleteMember(deleteMemberId)
              }
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
