import { Ladder } from "./classes/ladder";
import { User } from "./classes/user";

const gaya = new User({ id: crypto.randomUUID(), name: "gaya", ratings: [] });
const carlos = new User({
    id: crypto.randomUUID(),
    name: "carlos",
    ratings: [],
});
const zoro = new User({ id: crypto.randomUUID(), name: "zoro", ratings: [] });
const natan = new User({ id: crypto.randomUUID(), name: "natan", ratings: [] });

const ladder = new Ladder({
    id: crypto.randomUUID(),
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
    matches: [],
    players: [gaya, carlos],
});

const matches = [];
let match;

match = ladder.startMatch(gaya, zoro);
matches.push(ladder.endMatch(match.id, 0));

match = ladder.startMatch(natan, carlos);
matches.push(ladder.endMatch(match.id, 0));

match = ladder.startMatch(carlos, zoro);
matches.push(ladder.endMatch(match.id, 0));

ladder.updateGlicko(gaya, matches);
ladder.updateGlicko(zoro, matches);
ladder.updateGlicko(natan, matches);
ladder.updateGlicko(carlos, matches);

console.log(ladder.players);

console.log(gaya.ratings);
console.log(carlos.ratings);
console.log(zoro.ratings);
console.log(natan.ratings);
