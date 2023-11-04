import { describe, expect, test } from "bun:test";
import app from "../src/app";
import { APP_URL } from "../libs/constants";

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
            const response = await app
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
});
