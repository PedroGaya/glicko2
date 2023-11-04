import { describe, expect, test } from "bun:test";
import { APP_URL } from "../libs/constants";

import app from "../src/app";

import { User } from "../src/classes/user";
import { Ladder } from "../src/classes/ladder";

describe("Elysia", () => {
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

            const resultingUser = app.store.users.find(
                (user) => user.name == "user"
            );

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
            const resultingLadder = app.store.ladders.find(
                (ladder) => ladder.id == response.id
            );
            expect(resultingLadder).toBeInstanceOf(Ladder);
            expect(resultingLadder?.name).toEqual("ladder");
            expect(resultingLadder?.game).toEqual("game");
        });

        test("/register", async () => {
            const user = app.store.users.find((user) => user.name == "user");
            const ladder = app.store.ladders.find(
                (ladder) => ladder.name == "ladder"
            );

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
});
