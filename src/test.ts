import { Ladder } from "./classes/ladder";
import { User } from "./classes/user";

const gaya = new User({ name: "gaya", ratings: [] });
const carlos = new User({ name: "carlos", ratings: [] });
const zoro = new User({ name: "carlos", ratings: [] });
const natan = new User({ name: "carlos", ratings: [] });

const ladder = new Ladder({
    game: "OPTCG",
    name: "OPTCG-Fortaleza",
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

const matches = [];
let match;

match = ladder.startMatch(gaya, zoro);
matches.push(ladder.endMatch(match.id, 0));

match = ladder.startMatch(natan, carlos);
matches.push(ladder.endMatch(match.id, 0));

match = ladder.startMatch(carlos, zoro);
matches.push(ladder.endMatch(match.id, 0));

console.log(ladder.matches);

ladder.updateGlicko(gaya, matches);
ladder.updateGlicko(carlos, matches);
ladder.updateGlicko(zoro, matches);
ladder.updateGlicko(natan, matches);

console.log(gaya.getRating(ladder.id));
console.log(carlos.getRating(ladder.id));
console.log(zoro.getRating(ladder.id));
console.log(natan.getRating(ladder.id));
