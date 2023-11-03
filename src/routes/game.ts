import { Elysia, t } from "elysia";
import logger from "../../libs/logger";
import { createGame } from "../crud/game";

const games = new Elysia({ prefix: "/games" });

games.post(
    "/create",
    async (ctx) => {
        const game = await createGame(ctx.body.name);
        return game;
    },
    {
        body: t.Object({
            name: t.String(),
        }),
    }
);

export default games;
