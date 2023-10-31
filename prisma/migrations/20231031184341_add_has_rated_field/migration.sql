/*
  Warnings:

  - Added the required column `hasEloRatedPlayerOne` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasEloRatedPlayerTwo` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasGlickoRatedPlayerOne` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hasGlickoRatedPlayerTwo` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "hasEloRatedPlayerOne" BOOLEAN NOT NULL,
ADD COLUMN     "hasEloRatedPlayerTwo" BOOLEAN NOT NULL,
ADD COLUMN     "hasGlickoRatedPlayerOne" BOOLEAN NOT NULL,
ADD COLUMN     "hasGlickoRatedPlayerTwo" BOOLEAN NOT NULL;
