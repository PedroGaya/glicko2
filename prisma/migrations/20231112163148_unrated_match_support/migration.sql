/*
  Warnings:

  - Added the required column `rated` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_ladderId_fkey";

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "rated" BOOLEAN NOT NULL,
ALTER COLUMN "ladderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_ladderId_fkey" FOREIGN KEY ("ladderId") REFERENCES "Ladder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
