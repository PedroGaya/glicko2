import { test, expect, describe, afterAll } from "bun:test";

import { Ladder } from "../src/classes/ladder";
import { User } from "../src/classes/user";

import { ladderTestParams, manager } from "./setup";
import { loadData } from "../src/crud/load";
import { getLadderRatings } from "../src/crud/rating";
import { getUserMatches } from "../src/crud/match";
import { prismaCleanup } from "../libs/prisma";

describe("Create the basic data entities.", async () => {
    test("Create a ladder", async () => {
        const ladder = manager.getLadder(ladderTestParams.id);
        const params = ladderTestParams;

        expect(ladder).toBeInstanceOf(Ladder);
        expect(ladder.id).toBeString();

        expect(ladder.elo.defaultRating).toBe(params.elo.defaultRating);
        expect(ladder.glicko.defaultRating).toBe(params.glicko.defaultRating);
        expect(ladder.glicko.defaultRatingDeviation).toBe(
            params.glicko.defaultRatingDeviation
        );
        expect(ladder.glicko.defaultVolatility).toBe(
            params.glicko.defaultVolatility
        );
        expect(ladder.glicko.tau).toBe(params.glicko.tau);

        expect(ladder.players).toBeArrayOfSize(0);
    });

    test("Create players", async () => {
        const ladder = manager.getLadder(ladderTestParams.id);
        const player = manager.players[0];
        const op1400 = manager.players[1];
        const op1550 = manager.players[2];
        const op1700 = manager.players[3];

        expect(player).toBeInstanceOf(User);
        expect(player.id).toBeString();

        await ladder?.registerPlayer(player);
        await ladder?.registerPlayer(op1400);
        await ladder?.registerPlayer(op1550);
        await ladder?.registerPlayer(op1700);

        expect(player.getRating(ladder.id)).toEqual({
            elo: ladder?.elo.getNewRating(),
            glicko: ladder?.glicko.getNewRating(),
        });
        expect(op1700.getRating(ladder.id)).toEqual({
            elo: {
                rating: 1000,
                k_value: 50,
            },
            glicko: {
                rating: 1700,
                deviation: 300,
                volatility: 0.06,
            },
        });

        expect(ladder?.players).toBeArrayOfSize(4);
    });
});

describe("Play some matches and calculate rating updates", async () => {
    test("Start matches", async () => {
        const ladder = manager.getLadder(ladderTestParams.id);
        const player = manager.players[0];
        const op1400 = manager.players[1];
        const op1550 = manager.players[2];
        const op1700 = manager.players[3];

        await manager.startMatch(ladder.id, player, op1400, true);
        await manager.startMatch(ladder.id, player, op1550, true);
        await manager.startMatch(ladder.id, op1700, player, true);

        const matches = manager.matchesOngoing;

        expect(matches[0].score).toBeNull();
        expect(matches[0].hasRatedPlayerOne).toEqual({
            elo: false,
            glicko: false,
        });

        expect(manager.matchesOngoing).toBeArrayOfSize(3);
    });

    test("Finish matches and calculate ratings", async () => {
        const ladder = manager.getLadder(ladderTestParams.id);
        const player = manager.players[0];
        const op1400 = manager.players[1];
        const op1700 = manager.players[3];
        const matches = [...manager.matchesOngoing];

        const m1 = await manager.endMatch(matches[0].id, 1);
        const m2 = await manager.endMatch(matches[1].id, 0);

        expect(manager.matchesOngoing).toBeArrayOfSize(1);

        const m3 = await manager.endMatch(matches[2].id, 1);

        expect(m1.score).toBe(1);
        expect(m1.hasRatedPlayerOne).toEqual({
            elo: true,
            glicko: false,
        });

        expect(manager.matchesOngoing).toBeArrayOfSize(0);

        const playerRating = {
            glicko: {
                deviation: 151.5165,
                rating: 1464.0507,
                volatility: 0.059996,
            },
            elo: {
                rating: 1008.2427,
                k_value: 27,
            },
        };

        const op1700rating = {
            glicko: {
                rating: 1700,
                deviation: 300,
                volatility: 0.06,
            },
            elo: {
                rating: 1042.1537,
                k_value: 80,
            },
        };

        await ladder.updateGlicko(player, [m1, m2, m3]);
        expect(player.getRating(ladder.id)).toEqual(playerRating);
        expect(ladder.glicko.getGXE(op1400.getRating(ladder.id))).toEqual(
            40.51
        );
        expect(op1700.getRating(ladder.id)).toEqual(op1700rating);
    });
});

describe("Load data and recreate state", () => {
    test("Recreate state", async () => {
        const expectedPlayer = manager.players[0];
        const expectedLadder = manager.ladders[0];

        await manager.synchronize();

        expect(manager.players).toBeArrayOfSize(4);
        expect(manager.ladders).toBeArrayOfSize(1);

        const testLadder = manager.getLadder(expectedLadder.id);
        const testPlayer = manager.getPlayer(expectedPlayer.id);

        expect(testLadder).toEqual(expectedLadder);
        expect(testPlayer).toEqual(expectedPlayer);
    });

    test("Check ladder ratings", async () => {
        const ladder = manager.ladders[0];
        const ratings = await getLadderRatings(ladder.id);

        expect(ratings).toBeArrayOfSize(4);
        expect(ratings.map((r) => r.userId)).toContain(ladder.players[0].id);
    });

    test("Check user matches", async () => {
        const player = manager.players[0];
        const ladder = manager.ladders[0];

        if (!ladder) throw "Failed to load ladder.";
        if (!player) throw "Failed to load player.";

        const matches = await getUserMatches(player.id, ladder.id);

        expect(matches).toBeArrayOfSize(3);
    });
});

afterAll(async () => {
    await prismaCleanup();
});
