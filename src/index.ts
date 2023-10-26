import { Ratings } from "@prisma/client";
import { Match } from "./types";
import { Glicko2, updatePlayer } from "./glicko2";

const player: Ratings = {
    id: 0,
    leagueId: 0,
    userId: 0,
    eloRating: 1000,
    glickoRating: 1500,
    glickoDeviation: 200,
    glickoVolatility: 0.06,
};

const opponents: Ratings[] = [
    {
        id: 1,
        leagueId: 0,
        userId: 1,
        eloRating: 1000,
        glickoRating: 1400,
        glickoDeviation: 30,
        glickoVolatility: 0.06,
    },
    {
        id: 2,
        leagueId: 0,
        userId: 2,
        eloRating: 1000,
        glickoRating: 1550,
        glickoDeviation: 100,
        glickoVolatility: 0.06,
    },
    {
        id: 3,
        leagueId: 0,
        userId: 3,
        eloRating: 1000,
        glickoRating: 1700,
        glickoDeviation: 300,
        glickoVolatility: 0.06,
    },
];

const glicko: Glicko2 = {
    defaultRating: 1500,
    defaultRatingDeviation: 350,
    defaultVolatility: 0.06,
    ratingPeriod: 15,
    tau: 0.5,
};

const matches: Match[] = [
    {
        id: 0,
        players: [player, opponents[0]],
        score: 1,
    },
    {
        id: 1,
        players: [player, opponents[1]],
        score: 0,
    },
    {
        id: 2,
        players: [player, opponents[2]],
        score: 0,
    },
];

const updated = updatePlayer(player, matches, glicko);
console.log(updated);
