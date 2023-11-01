import { test, expect, describe } from "bun:test";

import { Ladder } from "../src/classes/ladder";
import { User } from "../src/classes/user";

import {
    ladderTestParams,
    getTestLadder,
    getTestPlayers,
    setTestMatches,
    getTestMatches,
} from "./setup";
import { loadData } from "../src/crud/load";

describe("Create the basic data entities.", async () => {
    test("Create a ladder", async () => {
        const ladder = getTestLadder();
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

        expect(ladder.matches).toBeArrayOfSize(0);
        expect(ladder.players).toBeArrayOfSize(0);
    });

    test("Create players", async () => {
        const ladder = getTestLadder();
        const { player, op1400, op1550, op1700 } = getTestPlayers();

        expect(player).toBeInstanceOf(User);
        expect(player.id).toBeString();

        await ladder.registerPlayer(player);
        await ladder.registerPlayer(op1400);
        await ladder.registerPlayer(op1550);
        await ladder.registerPlayer(op1700);

        expect(player.getRating(ladder.id)).toEqual({
            elo: ladder.elo.getNewRating(),
            glicko: ladder.glicko.getNewRating(),
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

        expect(ladder.players).toBeArrayOfSize(4);
    });
});

describe("Play some matches and calculate rating updates", async () => {
    test("Start matches", async () => {
        const ladder = getTestLadder();
        const { player, op1400, op1550, op1700 } = getTestPlayers();
        const matches = setTestMatches([
            await ladder.startMatch(player, op1400),
            await ladder.startMatch(player, op1550),
            await ladder.startMatch(op1700, player),
        ]);

        expect(matches[0].score).toBeNull();
        expect(matches[0].hasRatedPlayerOne).toEqual({
            elo: false,
            glicko: false,
        });

        expect(ladder.matchesOngoing).toBeArrayOfSize(3);
    });

    test("Finish matches", async () => {
        const ladder = getTestLadder();
        const matches = getTestMatches();

        const m1 = await ladder.endMatch(matches[0].id, 1);
        const m2 = await ladder.endMatch(matches[1].id, 0);

        expect(ladder.matchesOngoing).toBeArrayOfSize(1);
        expect(ladder.matches).toBeArrayOfSize(2);

        const m3 = await ladder.endMatch(matches[2].id, 1);

        setTestMatches([m1, m2, m3]);

        expect(m1.score).toBe(1);
        expect(m1.hasRatedPlayerOne).toEqual({
            elo: true,
            glicko: false,
        });

        expect(ladder.matchesOngoing).toBeArrayOfSize(0);
        expect(ladder.matches).toBeArrayOfSize(3);
    });

    test("Calculate ratings", async () => {
        const ladder = getTestLadder();
        const { player, op1400, op1550, op1700 } = getTestPlayers();
        const matches = getTestMatches();

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

        await ladder.updateGlicko(player, matches);
        expect(player.getRating(ladder.id)).toEqual(playerRating);
        expect(ladder.glicko.getGXE(op1400.getRating(ladder.id))).toEqual(
            40.51
        );
        expect(op1700.getRating(ladder.id)).toEqual(op1700rating);
    });
});

describe("Load data and recreate state", () => {
    const userPool: User[] = [];
    const ladderPool: Ladder[] = [];
    test("Recreate state", async () => {
        await loadData(userPool, ladderPool);

        expect(userPool).toBeArrayOfSize(4);
        expect(ladderPool).toBeArrayOfSize(1);

        const expectedPlayer = getTestPlayers()["player"];
        const testPlayer = userPool.find((user) => user.name == "player");

        const expectedLadder = getTestLadder();
        const testLadder = ladderPool.find(
            (ladder) => ladder.id == expectedLadder.id
        );

        expect(testLadder).toEqual(expectedLadder);
        expect(testPlayer).toEqual(expectedPlayer);
    });
});
