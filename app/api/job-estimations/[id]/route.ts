import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/job-estimations/[id] - Get a specific job estimation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const jobEstimation = await prisma.jobEstimation.findUnique({
      where: { id },
      include: {
        teamMembers: {
          include: {
            teamMember: true,
          },
        },
        clientManager: true,
      },
    });

    if (!jobEstimation) {
      return NextResponse.json(
        { error: "Job estimation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(jobEstimation);
  } catch (error) {
    console.error("Error fetching job estimation:", error);
    return NextResponse.json(
      { error: "Failed to fetch job estimation" },
      { status: 500 }
    );
  }
}

// Helper function to build update data
function buildUpdateData(body: Record<string, unknown>) {
  const updateData: Record<string, unknown> = {};
  const {
    name,
    description,
    clientName,
    clientEmail,
    clientManagerId,
    totalHours,
    totalCost,
  } = body;

  if (name !== undefined && name !== null)
    updateData.name = (name as string).trim();
  if (description !== undefined)
    updateData.description = (description as string | undefined)?.trim();
  if (clientName !== undefined && clientName !== null)
    updateData.clientName = (clientName as string).trim();
  if (clientEmail !== undefined) {
    // Clean email if provided [[memory:3145348]]
    updateData.clientEmail = clientEmail
      ? (clientEmail as string).trim().toLowerCase()
      : undefined;
  }
  if (clientManagerId !== undefined) updateData.clientManagerId = clientManagerId;
  if (totalHours !== undefined) updateData.totalHours = totalHours;
  if (totalCost !== undefined) updateData.totalCost = totalCost;

  return updateData;
}

// Helper function to update team members
async function updateTeamMembers(
  estimationId: string,
  teamMembers: Array<{
    teamMemberId: string;
    hoursAllocated: number;
    customRate?: number;
  }>
) {
  await prisma.jobEstimationMember.deleteMany({
    where: { estimationId },
  });

  for (const member of teamMembers) {
    await prisma.jobEstimationMember.create({
      data: {
        estimationId,
        teamMemberId: member.teamMemberId,
        hoursAllocated: member.hoursAllocated || 0,
        customRate: member.customRate,
      },
    });
  }
}

// PUT /api/job-estimations/[id] - Update a job estimation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { teamMembers } = body;

    const updateData = buildUpdateData(body);

    // Update the job estimation
    await prisma.jobEstimation.update({
      where: { id },
      data: updateData,
    });

    // Update team members if provided
    if (teamMembers && Array.isArray(teamMembers)) {
      await updateTeamMembers(id, teamMembers);
    }

    // Fetch the updated estimation with team members
    const updatedEstimation = await prisma.jobEstimation.findUnique({
      where: { id },
      include: {
        teamMembers: {
          include: {
            teamMember: true,
          },
        },
        clientManager: true,
      },
    });

    return NextResponse.json(updatedEstimation);
  } catch (error) {
    console.error("Error updating job estimation:", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to update not found")
    ) {
      return NextResponse.json(
        { error: "Job estimation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update job estimation" },
      { status: 500 }
    );
  }
}

// DELETE /api/job-estimations/[id] - Delete a job estimation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete the job estimation (cascade will handle team member relationships)
    await prisma.jobEstimation.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Job estimation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting job estimation:", error);
    if (
      error instanceof Error &&
      error.message.includes("Record to delete does not exist")
    ) {
      return NextResponse.json(
        { error: "Job estimation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete job estimation" },
      { status: 500 }
    );
  }
}
