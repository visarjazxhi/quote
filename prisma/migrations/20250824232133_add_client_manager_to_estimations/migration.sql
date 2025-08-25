/*
  Warnings:

  - You are about to drop the column `status` on the `job_estimations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."job_estimations" DROP COLUMN "status",
ADD COLUMN     "clientManagerId" TEXT;

-- DropEnum
DROP TYPE "public"."EstimationStatus";

-- AddForeignKey
ALTER TABLE "public"."job_estimations" ADD CONSTRAINT "job_estimations_clientManagerId_fkey" FOREIGN KEY ("clientManagerId") REFERENCES "public"."team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
