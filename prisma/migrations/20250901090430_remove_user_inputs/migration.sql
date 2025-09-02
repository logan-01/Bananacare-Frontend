/*
  Warnings:

  - You are about to drop the column `address` on the `ScanResult` table. All the data in the column will be lost.
  - You are about to drop the column `age` on the `ScanResult` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `ScanResult` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ScanResult` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `ScanResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ScanResult" DROP COLUMN "address",
DROP COLUMN "age",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "phoneNumber";
