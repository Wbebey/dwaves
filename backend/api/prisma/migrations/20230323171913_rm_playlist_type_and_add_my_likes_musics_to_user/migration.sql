/*
  Warnings:

  - You are about to drop the column `playlistType` on the `Playlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "playlistType";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "myLikedMusics" TEXT[];

-- DropEnum
DROP TYPE "PlaylistType";
