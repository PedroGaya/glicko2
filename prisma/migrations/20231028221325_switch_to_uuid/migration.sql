/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Ladder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "eloRating" REAL NOT NULL,
    "eloK" REAL NOT NULL,
    "glickoRating" REAL NOT NULL,
    "glickoDeviation" REAL NOT NULL,
    "glickoTau" REAL NOT NULL,
    "glickoVolatility" REAL NOT NULL,
    "ratingPeriodGame" INTEGER NOT NULL,
    "ratingPeriodHours" INTEGER NOT NULL,
    CONSTRAINT "Ladder_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "ladderId" TEXT NOT NULL,
    "eloRating" REAL NOT NULL,
    "eloK" INTEGER NOT NULL,
    "glickoRating" REAL NOT NULL,
    "glickoDeviation" REAL NOT NULL,
    "glickoVolatility" REAL NOT NULL,
    CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rating_ladderId_fkey" FOREIGN KEY ("ladderId") REFERENCES "Ladder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ladderId" TEXT NOT NULL,
    "playerOneId" TEXT NOT NULL,
    "playerTwoId" TEXT NOT NULL,
    "finished" BOOLEAN NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME,
    "score" INTEGER,
    CONSTRAINT "Match_ladderId_fkey" FOREIGN KEY ("ladderId") REFERENCES "Ladder" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_playerOneId_fkey" FOREIGN KEY ("playerOneId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_playerTwoId_fkey" FOREIGN KEY ("playerTwoId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);
INSERT INTO "new_User" ("id", "name") SELECT "id", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Ladder_name_key" ON "Ladder"("name");
