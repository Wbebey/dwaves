-- CreateEnum
CREATE TYPE "PlaylistType" AS ENUM ('PUBLIC', 'PRIVATE', 'LIKE');

-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "playlistType" "PlaylistType" NOT NULL DEFAULT 'PUBLIC';
