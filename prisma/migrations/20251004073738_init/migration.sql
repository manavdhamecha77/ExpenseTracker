/*
  Warnings:

  - The `metadata` column on the `ApprovalHistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `approverRole` column on the `ApprovalWorkflowStep` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Expense` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `items` column on the `Expense` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `ExpenseApprover` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `parsedJson` column on the `ReceiptOCR` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `decision` on the `ApprovalDecision` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `action` on the `ApprovalHistory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `ruleType` on the `ApprovalRule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'EMPLOYEE', 'FINANCE', 'DIRECTOR');

-- CreateEnum
CREATE TYPE "ApproverStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SKIPPED', 'BYPASSED');

-- CreateEnum
CREATE TYPE "Decision" AS ENUM ('APPROVE', 'REJECT');

-- CreateEnum
CREATE TYPE "ApprovalRuleType" AS ENUM ('PERCENTAGE', 'SPECIFIC_USER', 'HYBRID', 'SEQUENTIAL', 'CONDITIONAL');

-- CreateEnum
CREATE TYPE "ApprovalAction" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'ESCALATED', 'BYPASSED', 'AUTO_APPROVED', 'WITHDRAWN', 'MODIFIED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ExpenseStatus" ADD VALUE 'IN_PROGRESS';
ALTER TYPE "ExpenseStatus" ADD VALUE 'PARTIALLY_APPROVED';
ALTER TYPE "ExpenseStatus" ADD VALUE 'ESCALATED';
ALTER TYPE "ExpenseStatus" ADD VALUE 'AUTO_APPROVED';

-- AlterTable
ALTER TABLE "ApprovalDecision" DROP COLUMN "decision",
ADD COLUMN     "decision" "Decision" NOT NULL;

-- AlterTable
ALTER TABLE "ApprovalHistory" DROP COLUMN "action",
ADD COLUMN     "action" "ApprovalAction" NOT NULL,
DROP COLUMN "metadata",
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "ApprovalRule" DROP COLUMN "ruleType",
ADD COLUMN     "ruleType" "ApprovalRuleType" NOT NULL;

-- AlterTable
ALTER TABLE "ApprovalWorkflowStep" DROP COLUMN "approverRole",
ADD COLUMN     "approverRole" "Role";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "status",
ADD COLUMN     "status" "ExpenseStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "items",
ADD COLUMN     "items" JSONB;

-- AlterTable
ALTER TABLE "ExpenseApprover" DROP COLUMN "status",
ADD COLUMN     "status" "ApproverStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "ReceiptOCR" DROP COLUMN "parsedJson",
ADD COLUMN     "parsedJson" JSONB;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'EMPLOYEE';
