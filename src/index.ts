import { Ladder } from "./classes/ladder";
import { User } from "./classes/user";

const gaya = new User({ name: "gaya", ratings: [] });
const carlos = new User({ name: "carlos", ratings: [] });

const ladder = new Ladder({
    name: "OPTCG",
    elo: {
        defaultRating: 1000,
        defaultK: 50,
    },
    glicko: {
        defaultRating: 1500,
        defaultRatingDeviation: 300,
        defaultVolatility: 0.06,
        tau: 0.5,
    },
    ratingPeriod: {
        games: 3,
        hours: 24,
    },
});

let match = ladder.startMatch(gaya, carlos);
ladder.endMatch(match.id, 1);

match = ladder.startMatch(gaya, carlos);
ladder.endMatch(match.id, 0);

match = ladder.startMatch(gaya, carlos);
ladder.endMatch(match.id, 0);

match = ladder.startMatch(gaya, carlos);
ladder.endMatch(match.id, 1);

match = ladder.startMatch(gaya, carlos);
ladder.endMatch(match.id, 0);

console.log("Gaya: ", gaya.getRating(ladder.id));
console.log("Carlos: ", carlos.getRating(ladder.id));
