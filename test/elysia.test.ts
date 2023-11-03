import { describe, expect, test } from "bun:test";
import app from "../src/app";

describe("Elysia", () => {
    test("Health check", async () => {
        const response = await app
            .handle(
                new Request(`http://${Bun.env.APP_HOST}:${Bun.env.APP_PORT}`)
            )
            .then((res) => res.text());

        expect(response).toBe("OK");
    });
});
