import { test, expect, describe, afterAll } from "bun:test";

import { prismaCleanup } from "../libs/prisma";
import { APP_URL } from "../libs/constants";

import app from "../src/app";
import logger from "../libs/logger";

describe("Elysia error handling", async () => {
    test("Invalid body", async () => {
        const url = APP_URL + "/games";
        const response: Response = await app.handle(
            new Request(url + "/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ naem: "game" }),
            })
        );
        const json = await response.json();

        expect(response.status).toBe(500);
        expect(json).toBeDefined();
    });
});

afterAll(async () => {
    await prismaCleanup();
});
