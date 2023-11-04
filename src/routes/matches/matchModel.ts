import { Elysia, t } from "elysia";

export const matchModel = new Elysia().model({
    startMatchSchema: t.Object({
        ladderId: t.String(),
        playerOneId: t.String(),
        playerTwoId: t.String(),
    }),
    endMatchSchema: t.Object({
        ladderId: t.String(),
        matchId: t.String(),
        score: t.Number(),
    }),
});
