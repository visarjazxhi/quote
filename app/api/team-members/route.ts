import { NextRequest, NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/team-members - Get all team members
export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// POST /api/team-members - Create a new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, hourlyRate } = body;

    console.log("POST /api/team-members - Creating member:", {
      name,
      hourlyRate,
    });

    if (!name || typeof hourlyRate !== "number") {
      return NextResponse.json(
        { error: "Name and hourly rate are required" },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name: name.trim(),
        hourlyRate,
      },
    });

    console.log("POST /api/team-members - Created member:", teamMember);

    return NextResponse.json(teamMember, {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
