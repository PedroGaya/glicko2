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
            store.manager.addLadder(ladder);
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

            const matches = await getUserMatches(userId, ladderId);

            const mappedMatches: Match[] = matches.map((data) => {
                const p1 = store.manager.getPlayer(data.playerOneId);
                const p2 = store.manager.getPlayer(data.playerTwoId);

                return {
                    id: data.id,
                    ladderId: data.ladderId,
                    players: [p1, p2],
                    start: data.start,
                    finished: true,
                    score: data.score,
                    rated: data.rated,
                    hasRatedPlayerOne: {
                        elo: data.hasEloRatedPlayerOne,
                        glicko: data.hasGlickoRatedPlayerOne,
                    },
                    hasRatedPlayerTwo: {
                        elo: data.hasEloRatedPlayerTwo,
                        glicko: data.hasGlickoRatedPlayerTwo,
                    },
                    end: data.end,
                };
            });

            return await ladder.updateGlicko(user, mappedMatches);
        },
    }));
