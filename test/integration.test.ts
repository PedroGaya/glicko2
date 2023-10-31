import { expect, test } from "bun:test";

import { Ladder } from "../src/classes/ladder";
import { User } from "../src/classes/user";

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

const op1400 = await User.build({ name: "1400", ratings: [] });
const op1550 = await User.build({ name: "1550", ratings: [] });
const op1700 = await User.build({ name: "1700", ratings: [] });
