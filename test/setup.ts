import { afterAll, afterEach, beforeAll } from "bun:test";
import { prisma, prismaCleanup } from "../libs/prisma";

import { User } from "../src/classes/user";
import { Ladder } from "../src/classes/ladder";
import { Match } from "../src/types";
import { createGame } from "../src/crud/game";
import { NODE_ENV } from "../libs/constants";

let player: User | undefined,
    op1400: User | undefined,
    op1550: User | undefined,
    op1700: User | undefined;

let ladder: Ladder | undefined;
let matches: Match[] = [];

export const ladderTestParams = {
    game: "Glickman",
    name: "Glicko2 Testing Ladder",
    elo: {
        defaultRating: 1000,
        defaultK: 50,
    },
    glicko: {
        defaultRating: 1500,
        defaultRatingDeviation: 200,
        defaultVolatility: 0.06,
        tau: 0.5,
    },
    ratingPeriod: {
        games: 3,
        hours: 24,
    },
    matches: [],
    players: [],
};

beforeAll(async () => {
    if (NODE_ENV != "development")
        throw "Running integration tests in production! Aborting.";

    console.log("Reseting development database before tests...");
    await prismaCleanup();

    const newGame = await createGame("Glickman");

    console.log("Building test ladder...");
    ladder = await Ladder.build({ ...ladderTestParams, game: newGame.name });

    console.log("Building test players...");
    player = await User.build({
        name: "player",
        ratings: [],
    });
    op1400 = await User.build({
        name: "1400",
        ratings: [
            {
                ladderId: ladder.id,
                rating: {
                    elo: {
                        rating: 1000,
                        k_value: 50,
                    },
                    glicko: {
                        rating: 1400,
                        deviation: 30,
                        volatility: 0.06,
                    },
                },
            },
        ],
    });
    op1550 = await User.build({
        name: "1550",
        ratings: [
            {
                ladderId: ladder.id,
                rating: {
                    elo: {
                        rating: 1000,
                        k_value: 50,
                    },
                    glicko: {
                        rating: 1550,
                        deviation: 100,
                        volatility: 0.06,
                    },
                },
            },
        ],
    });
    op1700 = await User.build({
        name: "1700",
        ratings: [
            {
                ladderId: ladder.id,
                rating: {
                    elo: {
                        rating: 1000,
                        k_value: 50,
                    },
                    glicko: {
                        rating: 1700,
                        deviation: 300,
                        volatility: 0.06,
                    },
                },
            },
        ],
    });
});

afterAll(async () => {
    console.log("Cleaning up development database...");
    await prismaCleanup();
});

export const getTestLadder = () => {
    if (!ladder) throw "Failed to initialize ladder.";
    return ladder;
};
export const getTestPlayers = () => {
    if (!player || !op1400 || !op1550 || !op1700)
        throw "Failed to initialize players.";
    return { player, op1400, op1550, op1700 };
};

export const setTestMatches = (newMatches: Match[]) => {
    matches = newMatches;
    return matches;
};
export const getTestMatches = () => {
    if (matches.length == 0) throw "Matches haven't been set.";
    return matches;
};
