import { Elysia, t } from "elysia";

export const gameModel = new Elysia().model({
    createSchema: t.Object({ name: t.String() }),
});
