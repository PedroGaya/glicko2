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
});
