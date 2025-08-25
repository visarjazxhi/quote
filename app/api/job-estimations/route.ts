import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/job-estimations - Get all job estimations
export async function GET() {
  try {
    const jobEstimations = await prisma.jobEstimation.findMany({
      include: {
        teamMembers: {
          include: {
            teamMember: true,
          },
        },
        clientManager: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(jobEstimations);
  } catch (error) {
    console.error("Error fetching job estimations:", error);
    return NextResponse.json(
      { error: "Failed to fetch job estimations" },
      { status: 500 }
    );
  }
}

// POST /api/job-estimations - Create a new job estimation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      clientName,
      clientEmail,
      teamMembers,
      clientManagerId,
      totalHours,
      totalCost,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Clean email if provided [[memory:3145348]]
    const cleanedClientEmail = clientEmail
      ? clientEmail.trim().toLowerCase()
      : undefined;

    const jobEstimation = await prisma.jobEstimation.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        clientName: clientName?.trim(),
        clientEmail: cleanedClientEmail,
        clientManagerId: clientManagerId || null,
        totalHours: totalHours || 0,
        totalCost: totalCost || 0,
      },
      include: {
        teamMembers: {
          include: {
            teamMember: true,
          },
        },
        clientManager: true,
      },
    });

    // If team members are provided, create the relationships
    if (teamMembers && Array.isArray(teamMembers)) {
      for (const member of teamMembers) {
        await prisma.jobEstimationMember.create({
          data: {
            estimationId: jobEstimation.id,
            teamMemberId: member.teamMemberId,
            hoursAllocated: member.hoursAllocated || 0,
            customRate: member.customRate,
          },
        });
      }

      // Fetch the updated estimation with team members
      const updatedEstimation = await prisma.jobEstimation.findUnique({
        where: { id: jobEstimation.id },
        include: {
          teamMembers: {
            include: {
              teamMember: true,
            },
          },
          clientManager: true,
        },
      });

      return NextResponse.json(updatedEstimation, { status: 201 });
    }

    return NextResponse.json(jobEstimation, { status: 201 });
  } catch (error) {
    console.error("Error creating job estimation:", error);
    return NextResponse.json(
      { error: "Failed to create job estimation" },
      { status: 500 }
    );
  }
}
