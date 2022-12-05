/*
  Warnings:

  - Made the column `coverCID` on table `Album` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Album" ALTER COLUMN "coverCID" SET NOT NULL;
