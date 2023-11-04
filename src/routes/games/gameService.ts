import Elysia from "elysia";
import { createGame } from "../../crud/game";
import { store } from "../../../libs/store";

export const gameService = new Elysia({ name: "gameService" })
    .use(store)
    .derive(({ store }) => ({
        create: async (params: { name: string }) => {
            const game = await createGame(params.name);
            return game;
        },
    }));
