import { Player, Match } from "./types";
import { Glicko2, updatePlayer } from "./glicko2";

const player: Player = {
    elo: {
        rating: 1000,
        k_value: 32,
    },
    glicko: {
        rating: 1500,
        deviation: 200,
        volatility: 0.06,
    },
};

const opponents: Player[] = [
    {
        elo: {
            rating: 1000,
            k_value: 32,
        },
        glicko: {
            rating: 1400,
            deviation: 30,
            volatility: 0.06,
        },
    },
    {
        elo: {
            rating: 1000,
            k_value: 32,
        },
        glicko: {
            rating: 1550,
            deviation: 100,
            volatility: 0.06,
        },
    },
    {
        elo: {
            rating: 1000,
            k_value: 32,
        },
        glicko: {
            rating: 1700,
            deviation: 300,
            volatility: 0.06,
        },
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
        players: [player, opponents[0]],
        score: 1,
    },
    {
        players: [player, opponents[1]],
        score: 0,
    },
    {
        players: [player, opponents[2]],
        score: 0,
    },
];

const updated = updatePlayer(player, matches, glicko);
console.log(updated);
