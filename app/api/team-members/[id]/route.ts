import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/team-members/[id] - Get a specific team member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { error: "Failed to fetch team member" },
      { status: 500 }
    );
  }
}

// PUT /api/team-members/[id] - Update a team member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, hourlyRate, isActive } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
    if (isActive !== undefined) updateData.isActive = isActive;

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error updating team member:", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

// DELETE /api/team-members/[id] - Delete (soft delete) a team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Soft delete by setting isActive to false
    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      message: "Team member deactivated successfully",
      teamMember,
    });
  } catch (error) {
    console.error("Error deleting team member:", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
