import { Elysia, t } from "elysia";

export const gameModel = new Elysia().model({
    createGameSchema: t.Object({ name: t.String() }),
});
