/*
  Warnings:

  - You are about to drop the `Episode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Series` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `Media` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `total_episodes` to the `Season` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('movie', 'serie');

-- DropForeignKey
ALTER TABLE "Episode" DROP CONSTRAINT "Episode_season_id_fkey";

-- DropForeignKey
ALTER TABLE "Season" DROP CONSTRAINT "Season_serie_id_fkey";

-- DropForeignKey
ALTER TABLE "Series" DROP CONSTRAINT "Series_media_id_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "type",
ADD COLUMN     "type" "MediaType" NOT NULL;

-- AlterTable
ALTER TABLE "Season" ADD COLUMN     "total_episodes" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Episode";

-- DropTable
DROP TABLE "Series";

-- CreateTable
CREATE TABLE "Serie" (
    "media_id" INTEGER NOT NULL,

    CONSTRAINT "Serie_pkey" PRIMARY KEY ("media_id")
);

-- AddForeignKey
ALTER TABLE "Serie" ADD CONSTRAINT "Serie_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_serie_id_fkey" FOREIGN KEY ("serie_id") REFERENCES "Serie"("media_id") ON DELETE RESTRICT ON UPDATE CASCADE;
