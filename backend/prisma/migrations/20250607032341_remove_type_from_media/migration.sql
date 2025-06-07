/*
  Warnings:

  - You are about to drop the column `type` on the `Media` table. All the data in the column will be lost.
  - The primary key for the `Movie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `media_id` on the `Movie` table. All the data in the column will be lost.
  - The primary key for the `Serie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `media_id` on the `Serie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mediaId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mediaId]` on the table `Serie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mediaId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaId` to the `Serie` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_media_id_fkey";

-- DropForeignKey
ALTER TABLE "Season" DROP CONSTRAINT "Season_serie_id_fkey";

-- DropForeignKey
ALTER TABLE "Serie" DROP CONSTRAINT "Serie_media_id_fkey";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_pkey",
DROP COLUMN "media_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "mediaId" INTEGER NOT NULL,
ADD CONSTRAINT "Movie_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Serie" DROP CONSTRAINT "Serie_pkey",
DROP COLUMN "media_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "mediaId" INTEGER NOT NULL,
ADD CONSTRAINT "Serie_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "MediaType";

-- CreateIndex
CREATE UNIQUE INDEX "Movie_mediaId_key" ON "Movie"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "Serie_mediaId_key" ON "Serie"("mediaId");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Serie" ADD CONSTRAINT "Serie_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_serie_id_fkey" FOREIGN KEY ("serie_id") REFERENCES "Serie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
