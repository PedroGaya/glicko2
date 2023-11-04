import Elysia from "elysia";
import { store } from "../../../libs/store";
import { Ladder, LadderParams } from "../../classes/ladder";

export const ladderService = new Elysia({ name: "ladderService" })
    .use(store)
    .derive(({ store }) => ({
        create: async (params: LadderParams) => {
            const ladder = await Ladder.build(params);
            store.ladders.push(ladder);
            return ladder;
        },
        registerPlayer: async (ladderId: string, userId: string) => {
            const ladder = store.ladders.find(
                (ladder) => ladder.id == ladderId
            );
            if (!ladder) throw "Ladder not found.";

            const user = store.users.find((user) => user.id == userId);
            if (!user) throw "User not found.";

            return await ladder.registerPlayer(user);
        },
    }));
