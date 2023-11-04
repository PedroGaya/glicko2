import Elysia from "elysia";
import { store } from "../../../libs/store";
import { Ladder, LadderParams } from "../../classes/ladder";

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
            if (!ladder) throw "Ladder not found.";

            const user = getUser(userId);

            return await ladder.registerPlayer(user);
        },
    }));
