import { Ladder } from "./classes/ladder";
import { User } from "./classes/user";

const newUser = new User({ name: "gaya" });
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
});

const userRating = ladder.registerPlayer(newUser);

console.log(userRating);
console.log(newUser.ratings[0]);
