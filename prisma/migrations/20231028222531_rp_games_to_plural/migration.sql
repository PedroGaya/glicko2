/*
  Warnings:

  - You are about to drop the column `ratingPeriodGame` on the `Ladder` table. All the data in the column will be lost.
  - Added the required column `ratingPeriodGames` to the `Ladder` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ladder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "eloRating" REAL NOT NULL,
    "eloK" REAL NOT NULL,
    "glickoRating" REAL NOT NULL,
    "glickoDeviation" REAL NOT NULL,
    "glickoTau" REAL NOT NULL,
    "glickoVolatility" REAL NOT NULL,
    "ratingPeriodGames" INTEGER NOT NULL,
    "ratingPeriodHours" INTEGER NOT NULL,
    CONSTRAINT "Ladder_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ladder" ("eloK", "eloRating", "gameId", "glickoDeviation", "glickoRating", "glickoTau", "glickoVolatility", "id", "name", "ratingPeriodHours") SELECT "eloK", "eloRating", "gameId", "glickoDeviation", "glickoRating", "glickoTau", "glickoVolatility", "id", "name", "ratingPeriodHours" FROM "Ladder";
DROP TABLE "Ladder";
ALTER TABLE "new_Ladder" RENAME TO "Ladder";
CREATE UNIQUE INDEX "Ladder_name_key" ON "Ladder"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
