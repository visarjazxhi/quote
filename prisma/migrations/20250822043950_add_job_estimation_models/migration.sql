-- CreateEnum
CREATE TYPE "public"."EstimationStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'SENT_TO_CLIENT', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."team_members" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "hourlyRate" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job_estimations" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "clientName" TEXT,
    "clientEmail" TEXT,
    "totalHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "public"."EstimationStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "job_estimations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job_estimation_members" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hoursAllocated" DOUBLE PRECISION NOT NULL,
    "customRate" DOUBLE PRECISION,
    "estimationId" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,

    CONSTRAINT "job_estimation_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_estimation_members_estimationId_teamMemberId_key" ON "public"."job_estimation_members"("estimationId", "teamMemberId");

-- AddForeignKey
ALTER TABLE "public"."job_estimation_members" ADD CONSTRAINT "job_estimation_members_estimationId_fkey" FOREIGN KEY ("estimationId") REFERENCES "public"."job_estimations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_estimation_members" ADD CONSTRAINT "job_estimation_members_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "public"."team_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
