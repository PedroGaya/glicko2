import { Rating, Match, GlickoParams } from "./types";
import { Glicko2 } from "./glicko2";
import { Elo } from "./elo";

const player: Rating = {
    ladderId: 0,
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

const opponents: Rating[] = [
    {
        ladderId: 0,
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
        ladderId: 0,
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
        ladderId: 0,
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

const matches: Match[] = [
    {
        id: 0,
        ladderId: 0,
        players: [player, opponents[0]],
        score: 1,
    },
    {
        id: 1,
        ladderId: 0,
        players: [player, opponents[1]],
        score: 0,
    },
    {
        id: 2,
        ladderId: 0,
        players: [player, opponents[2]],
        score: 0,
    },
];

const params: GlickoParams = {
    defaultRating: 1500,
    defaultRatingDeviation: 350,
    defaultVolatility: 0.06,
    tau: 0.5,
};

const glicko = new Glicko2(params);
const newGlicko = glicko.updateRating(player, matches);

const elo = new Elo({ defaultRating: 1000, defaultK: 50 });

const newElo = elo.updateRating(matches[0]);

console.log(newElo.p1, newGlicko);
