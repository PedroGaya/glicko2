import { Elysia, t } from "elysia";

export const ladderModel = new Elysia().model({
    createLadderSchema: t.Object({
        name: t.String(),
        game: t.String(),
        ratingPeriod: t.Object({
            games: t.Number(),
            hours: t.Number(),
        }),
        elo: t.Object({
            defaultRating: t.Number(),
            defaultK: t.Number(),
        }),
        glicko: t.Object({
            defaultRating: t.Number(),
            defaultRatingDeviation: t.Number(),
            defaultVolatility: t.Number(),
            tau: t.Number(),
        }),
    }),
    registerPlayerSchema: t.Object({
        ladderId: t.String(),
        userId: t.String(),
    }),
});
