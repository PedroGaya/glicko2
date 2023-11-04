import { Elysia, t } from "elysia";

export const userModel = new Elysia().model({
    createUserSchema: t.Object({
        name: t.String(),
        ratings: t.Array(
            t.Object({
                ladderId: t.String(),
                rating: t.Object({
                    elo: t.Object({
                        rating: t.Number(),
                        k_value: t.Number(),
                    }),
                    glicko: t.Object({
                        rating: t.Number(),
                        deviation: t.Number(),
                        volatility: t.Number(),
                    }),
                }),
            })
        ),
    }),
});
