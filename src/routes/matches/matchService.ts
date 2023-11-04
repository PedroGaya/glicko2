import Elysia from "elysia";
import { store } from "../../../libs/store";

export const matchService = new Elysia({ name: "matchService" })
    .use(store)
    .derive(({ store, getUser, getLadder }) => ({
        startMatch: async (
            ladderId: string,
            playerOneId: string,
            playerTwoId: string
        ) => {
            const p1 = getUser(playerOneId);
            const p2 = getUser(playerTwoId);
            const ladder = getLadder(ladderId);

            return await ladder.startMatch(p1, p2);
        },
        endMatch: async (ladderId: string, matchId: string, score: number) => {
            const ladder = getLadder(ladderId);
            return await ladder.endMatch(matchId, score);
        },
    }));
