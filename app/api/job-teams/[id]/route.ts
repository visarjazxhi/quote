import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

// GET /api/job-teams/[id] - Get a specific team
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const team = await prisma.jobTeam.findUnique({
      where: { id },
      include: {
        members: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Calculate average cost
    const teamWithAvgCost = {
      ...team,
      averageCost:
        team.members.length > 0
          ? team.members.reduce((sum, member) => sum + member.hourlyRate, 0) /
            team.members.length
          : 0,
    };

    return NextResponse.json(teamWithAvgCost);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team" },
      { status: 500 }
    );
  }
}

// PUT /api/job-teams/[id] - Update a team
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, members } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    // Update team and replace all members
    const team = await prisma.$transaction(async (tx) => {
      // Soft delete existing members
      await tx.jobTeamMember.updateMany({
        where: { teamId: id },
        data: { isActive: false },
      });

      // Create new members
      if (members && members.length > 0) {
        await tx.jobTeamMember.createMany({
          data: members.map((member: { name: string; hourlyRate: number }) => ({
            teamId: id,
            name: member.name,
            hourlyRate: member.hourlyRate,
          })),
        });
      }

      // Update team
      return await tx.jobTeam.update({
        where: { id },
        data: { name, description },
        include: {
          members: {
            where: { isActive: true },
            orderBy: { name: "asc" },
          },
        },
      });
    });

    // Calculate average cost
    const teamWithAvgCost = {
      ...team,
      averageCost:
        team.members.length > 0
          ? team.members.reduce((sum, member) => sum + member.hourlyRate, 0) /
            team.members.length
          : 0,
    };

    return NextResponse.json(teamWithAvgCost);
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      { error: "Failed to update team" },
      { status: 500 }
    );
  }
}

// DELETE /api/job-teams/[id] - Delete a team (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.$transaction(async (tx) => {
      // Soft delete team members
      await tx.jobTeamMember.updateMany({
        where: { teamId: id },
        data: { isActive: false },
      });

      // Soft delete team
      await tx.jobTeam.update({
        where: { id },
        data: { isActive: false },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      { error: "Failed to delete team" },
      { status: 500 }
    );
  }
}
