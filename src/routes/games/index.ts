import { Elysia, t } from "elysia";
import { gameService } from "./gameService";
import { gameModel } from "./gameModel";

export const gamesController = new Elysia({ prefix: "/games" })
    .use(gameModel)
    .use(gameService)
    .post(
        "/create",
        async ({ create, body }) => {
            const game = await create(body);
            return game;
        },
        { body: "createGameSchema" }
    );
export default gamesController;
