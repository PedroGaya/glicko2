import { Ladder } from "../src/classes/ladder";
import { User } from "../src/classes/user";

import { prisma } from "../libs/prisma";

await prisma.rating.deleteMany();
await prisma.match.deleteMany();
await prisma.user.deleteMany();
await prisma.ladder.deleteMany();
await prisma.game.deleteMany();

const ladder = await Ladder.build({
    game: "Glickman",
    name: "Glicko2 Testing Ladder",
    elo: {
        defaultRating: 1000,
        defaultK: 50,
    },
    glicko: {
        defaultRating: 1500,
        defaultRatingDeviation: 200,
        defaultVolatility: 0.06,
        tau: 0.5,
    },
    ratingPeriod: {
        games: 3,
        hours: 24,
    },
    matches: [],
    players: [],
});

const player = await User.build({
    name: "player",
    ratings: [],
});
const op1400 = await User.build({
    name: "1400",
    ratings: [
        {
            ladderId: ladder.id,
            rating: {
                elo: {
                    rating: 1000,
                    k_value: 50,
                },
                glicko: {
                    rating: 1400,
                    deviation: 30,
                    volatility: 0.06,
                },
            },
        },
    ],
});
const op1550 = await User.build({
    name: "1550",
    ratings: [
        {
            ladderId: ladder.id,
            rating: {
                elo: {
                    rating: 1000,
                    k_value: 50,
                },
                glicko: {
                    rating: 1550,
                    deviation: 100,
                    volatility: 0.06,
                },
            },
        },
    ],
});
const op1700 = await User.build({
    name: "1700",
    ratings: [
        {
            ladderId: ladder.id,
            rating: {
                elo: {
                    rating: 1000,
                    k_value: 50,
                },
                glicko: {
                    rating: 1700,
                    deviation: 300,
                    volatility: 0.06,
                },
            },
        },
    ],
});

await ladder.registerPlayer(player);
await ladder.registerPlayer(op1400);
await ladder.registerPlayer(op1550);
await ladder.registerPlayer(op1700);

let m1 = await ladder.startMatch(player, op1400);
let m2 = await ladder.startMatch(player, op1550);
let m3 = await ladder.startMatch(op1700, player);

m1 = await ladder.endMatch(m1.id, 1);
m2 = await ladder.endMatch(m2.id, 0);
m3 = await ladder.endMatch(m3.id, 1);

const matches = [m1, m2, m3];
const updatedRating = await ladder.updateGlicko(player, matches);

console.log(updatedRating);
