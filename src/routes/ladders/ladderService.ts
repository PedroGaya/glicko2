import Elysia from "elysia";
import { store } from "../../../libs/store";
import { Ladder, LadderParams } from "../../classes/ladder";
import { getUserMatches } from "../../crud/match";
import { Match } from "../../types";

export const ladderService = new Elysia({ name: "ladderService" })
    .use(store)
    .derive(({ store, getUser, getLadder }) => ({
        create: async (params: LadderParams) => {
            const ladder = await Ladder.build(params);
            store.ladders.push(ladder);
            return ladder;
        },
        registerPlayer: async (ladderId: string, userId: string) => {
            const ladder = getLadder(ladderId);
            const user = getUser(userId);

            return await ladder.registerPlayer(user);
        },
        updateGlicko: async (ladderId: string, userId: string) => {
            const ladder = getLadder(ladderId);
            const user = getUser(userId);

            return await ladder.updateGlicko(user, ladder.matches);
        },
    }));
