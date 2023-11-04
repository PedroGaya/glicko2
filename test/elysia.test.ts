import { describe, expect, test } from "bun:test";
import { APP_URL } from "../libs/constants";

import app from "../src/app";

import { User } from "../src/classes/user";

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
});
