/*
  Warnings:

  - Added the required column `address` to the `ScanResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ScanResult" ADD COLUMN     "address" TEXT NOT NULL;
