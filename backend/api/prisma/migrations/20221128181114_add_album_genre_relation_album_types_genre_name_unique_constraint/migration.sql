/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `genreId` to the `Album` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AlbumType" AS ENUM ('SINGLE', 'EP', 'ALBUM');

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "genreId" INTEGER NOT NULL,
ADD COLUMN     "type" "AlbumType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
