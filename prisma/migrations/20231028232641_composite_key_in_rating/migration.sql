/*
  Warnings:

  - The primary key for the `Rating` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Rating` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rating" (
    "userId" TEXT NOT NULL,
    "ladderId" TEXT NOT NULL,
    "eloRating" REAL NOT NULL,
    "eloK" INTEGER NOT NULL,
    "glickoRating" REAL NOT NULL,
    "glickoDeviation" REAL NOT NULL,
    "glickoVolatility" REAL NOT NULL,

    PRIMARY KEY ("userId", "ladderId"),
    CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rating_ladderId_fkey" FOREIGN KEY ("ladderId") REFERENCES "Ladder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Rating" ("eloK", "eloRating", "glickoDeviation", "glickoRating", "glickoVolatility", "ladderId", "userId") SELECT "eloK", "eloRating", "glickoDeviation", "glickoRating", "glickoVolatility", "ladderId", "userId" FROM "Rating";
DROP TABLE "Rating";
ALTER TABLE "new_Rating" RENAME TO "Rating";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
