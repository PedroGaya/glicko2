import { Ladder, LadderParams } from "../classes/ladder";
import { User, UserParams } from "../classes/user";

import { getGames } from "./game";
import { getLadders } from "./ladder";
import { getLadderMatches } from "./match";
import { getUserRatings } from "./rating";
import { getUsers } from "./user";

import { Match, Rating } from "../types";

export const loadData = async (userPool: User[], ladderPool: Ladder[]) => {
    const gameData = await getGames();
    const userData = await getUsers();
    const ladderData = await getLadders();

    for (const data of userData) {
        const ratingData = await getUserRatings(data.id);
        const ratings: { ladderId: string; rating: Rating }[] = ratingData.map(
            (data) => {
                return {
                    ladderId: data.ladderId,
                    rating: {
                        elo: {
                            rating: data.eloRating,
                            k_value: data.eloK,
                        },
                        glicko: {
                            rating: data.glickoRating,
                            deviation: data.glickoDeviation,
                            volatility: data.glickoVolatility,
                        },
                    },
                };
            }
        );

        const params: UserParams = {
            id: data.id,
            name: data.name,
            ratings: ratings,
        };
        const user = new User(params);
        userPool.push(user);
    }

    for (const data of ladderData) {
        const players = userPool.filter((user) =>
            user.ratings.map((r) => r.ladderId).includes(data.id)
        );

        const matchData = await getLadderMatches(data.id);
        const matches: Match[] = [];

        for (const data of matchData) {
            const p1 = userPool.find((user) => user.id == data.playerOneId);
            const p2 = userPool.find((user) => user.id == data.playerTwoId);

            if (!p1 || !p2) throw "Users not found in user pool.";

            matches.push({
                id: data.id,
                ladderId: data.ladderId,
                players: [p1, p2],
                start: data.start,
                finished: true,
                score: data.score,
                hasRatedPlayerOne: {
                    elo: data.hasEloRatedPlayerOne,
                    glicko: data.hasGlickoRatedPlayerOne,
                },
                hasRatedPlayerTwo: {
                    elo: data.hasEloRatedPlayerTwo,
                    glicko: data.hasGlickoRatedPlayerTwo,
                },
                end: data.end,
            });
        }

        const params: LadderParams = {
            id: data.id,
            name: data.name,
            game: "Glickman",
            ratingPeriod: {
                games: data.ratingPeriodGames,
                hours: data.ratingPeriodHours,
            },
            elo: {
                defaultRating: data.eloRating,
                defaultK: data.eloK,
            },
            glicko: {
                defaultRating: data.glickoRating,
                defaultRatingDeviation: data.glickoDeviation,
                defaultVolatility: data.glickoVolatility,
                tau: data.glickoTau,
            },
            players: players,
            matches: matches,
        };
        const ladder = new Ladder(params);
        ladderPool.push(ladder);
    }
};
