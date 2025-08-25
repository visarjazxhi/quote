import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db";

// GET /api/job-teams - Get all teams
export async function GET() {
  try {
    const teams = await prisma.jobTeam.findMany({
      include: {
        members: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
      },
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    // Calculate average cost for each team
    const teamsWithAvgCost = teams.map((team) => ({
      ...team,
      averageCost:
        team.members.length > 0
          ? team.members.reduce((sum, member) => sum + member.hourlyRate, 0) /
            team.members.length
          : 0,
    }));

    return NextResponse.json(teamsWithAvgCost);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

// POST /api/job-teams - Create a new team
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, members } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    const team = await prisma.jobTeam.create({
      data: {
        name,
        description,
        members: {
          create:
            members?.map((member: { name: string; hourlyRate: number }) => ({
              name: member.name,
              hourlyRate: member.hourlyRate,
            })) || [],
        },
      },
      include: {
        members: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
      },
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

    return NextResponse.json(teamWithAvgCost, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
