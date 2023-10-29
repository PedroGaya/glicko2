import { Ladder, LadderParams } from "./classes/ladder";
import { User, UserParams } from "./classes/user";

import { getGames } from "./crud/game";
import { getLadders } from "./crud/ladder";
import { getLadderMatches } from "./crud/match";
import { getUserRatings } from "./crud/rating";
import { getUsers } from "./crud/user";

import { Match, Rating } from "./types";

const gameData = await getGames();
const userData = await getUsers();
const ladderData = await getLadders();

const userPool: User[] = [];
const ladderPool: Ladder[] = [];

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

        matches.push({
            id: data.id,
            ladderId: data.ladderId,
            players: [p1, p2],
            start: data.start,
            end: data.end,
            finished: true,
            score: data.score,
        });
    }

    const params: LadderParams = {
        id: data.id,
        name: data.name,
        game: "whatever",
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
