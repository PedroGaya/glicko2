import { afterAll, describe, expect, test } from "bun:test";
import { APP_URL } from "../libs/constants";

import app from "../src/app";

import { User } from "../src/classes/user";
import { Ladder } from "../src/classes/ladder";
import { Match } from "../src/types";
import { prismaCleanup } from "../libs/prisma";

describe("Elysia", () => {
    let testUserId: string, testLadderId: string;

    test("Health check", async () => {
        const response = await app
            .handle(new Request(APP_URL))
            .then((res) => res.text());

        expect(response).toBe("OK");
    });

    describe("/games", async () => {
        const url = APP_URL + "/games";
        test("/create", async () => {
            const response: any = await app
                .handle(
                    new Request(url + "/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ name: "game" }),
                    })
                )
                .then(async (res) => res.json());

            expect(response.id).toBeTypeOf("string");
            expect(response.name).toEqual("game");
        });
    });

    describe("/users", async () => {
        const url = APP_URL + "/users";
        test("/create", async () => {
            const response: any = await app
                .handle(
                    new Request(url + "/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ name: "user", ratings: [] }),
                    })
                )
                .then(async (res) => res.json());

            expect(response.id).toBeTypeOf("string");
            expect(response.name).toEqual("user");

            testUserId = response.id;

            const resultingUser = app.store.manager.getPlayer(response.id);

            expect(resultingUser).toBeInstanceOf(User);
            expect(resultingUser?.ratings).toBeArrayOfSize(0);
            expect(resultingUser?.name).toEqual("user");
        });
    });

    describe("/ladders", async () => {
        const url = APP_URL + "/ladders";
        test("/create", async () => {
            const params = {
                game: "game",
                name: "ladder",
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
            };

            const response: any = await app
                .handle(
                    new Request(url + "/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(params),
                    })
                )
                .then(async (res) => res.json());

            expect(response).toBeDefined();
            expect(response.id).toBeTypeOf("string");

            testLadderId = response.id;

            const resultingLadder = app.store.manager.getLadder(response.id);
            expect(resultingLadder).toBeInstanceOf(Ladder);
            expect(resultingLadder?.name).toEqual("ladder");
            expect(resultingLadder?.game).toEqual("game");
        });

        test("/register", async () => {
            const user = app.store.manager.getPlayer(testUserId);
            const ladder = app.store.manager.getLadder(testLadderId);

            const response: any = await app
                .handle(
                    new Request(url + "/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: user?.id,
                            ladderId: ladder?.id,
                        }),
                    })
                )
                .then(async (res) => res.json());

            expect(response).toBeDefined();
            expect(response.ladderId).toBeTypeOf("string");
            expect(response.rating).toBeDefined();

            expect(ladder?.players).toBeArrayOfSize(1);
            expect(user?.ratings).toBeArrayOfSize(1);
            expect(user?.ratings[0].ladderId).toEqual(ladder?.id);
        });
    });

    describe("/matches", async () => {
        const url = APP_URL + "/matches";
        test("/startMatch", async () => {
            const player = app.store.manager.getPlayer(testUserId);
            const ladder = app.store.manager.getLadder(testLadderId);
            const opponent = (await app
                .handle(
                    new Request(APP_URL + "/users/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: "opponent",
                            ratings: [],
                        }),
                    })
                )
                .then(async (res) => res.json())) as User;

            const registration: any = await app
                .handle(
                    new Request(APP_URL + "/ladders/register", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ladderId: ladder?.id,
                            userId: opponent.id,
                        }),
                    })
                )
                .then(async (res) => res.json());

            const match: any = (await app
                .handle(
                    new Request(url + "/startMatch", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ladderId: ladder?.id,
                            playerOneId: player?.id,
                            playerTwoId: opponent.id,
                        }),
                    })
                )
                .then(async (res) => res.json())) as Match;

            expect(match).toBeDefined();
            expect(match.id).toBeTypeOf("string");
            expect(match.finished).toBeFalse();
        });

        test("/endMatch", async () => {
            const ladder = app.store.manager.getLadder(testLadderId);
            const match = app.store.manager.matchesOngoing[0];

            const response = (await app
                .handle(
                    new Request(url + "/endMatch", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ladderId: ladder?.id,
                            matchId: match?.id,
                            score: 1,
                        }),
                    })
                )
                .then(async (res) => res.json())) as Match;

            const playerRating =
                response.players[0].ratings[0].rating.elo.rating;
            const opponentRating =
                response.players[1].ratings[0].rating.elo.rating;
            expect(playerRating).toBeGreaterThan(opponentRating);
        });
    });

    describe("Update Glicko2 ratings", async () => {
        test("/ladders/updateGlicko", async () => {
            const ladder = app.store.manager.getLadder(testLadderId);
            const user = app.store.manager.getPlayer(testUserId);

            const response: any = await app
                .handle(
                    new Request(APP_URL + "/ladders/updateGlicko", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            ladderId: ladder?.id,
                            userId: user?.id,
                        }),
                    })
                )
                .then(async (res) => res.json());

            expect(user?.ratings[0]).toEqual(response);
            expect(response).toBeDefined();
            expect(response.ladderId).toBe(ladder?.id);
        });
    });
});

afterAll(async () => {
    await prismaCleanup();
});
