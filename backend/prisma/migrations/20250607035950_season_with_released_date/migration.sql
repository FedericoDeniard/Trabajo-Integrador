/*
  Warnings:

  - Added the required column `released_date` to the `Season` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Season" ADD COLUMN     "released_date" DATE NOT NULL;
