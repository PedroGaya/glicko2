import { sleep } from "bun";
import { Ladder } from "./classes/ladder";
import { User } from "./classes/user";

try {
    const gaya = await User.build({ name: "gaya", ratings: [] });
    const carlos = await User.build({ name: "carlos", ratings: [] });
    const natan = await User.build({ name: "natan", ratings: [] });
    const zoro = await User.build({ name: "zoro", ratings: [] });

    const ladder = await Ladder.build({
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

    match = await ladder.startMatch(gaya, zoro);
    match = await ladder.endMatch(match.id, 0);
    matches.push(match);

    match = await ladder.startMatch(natan, carlos);
    match = await ladder.endMatch(match.id, 0);
    matches.push(match);

    match = await ladder.startMatch(carlos, zoro);
    match = await ladder.endMatch(match.id, 0);
    matches.push(match);

    await ladder.updateGlicko(gaya, matches);
    await ladder.updateGlicko(zoro, matches);
    await ladder.updateGlicko(natan, matches);
    await ladder.updateGlicko(carlos, matches);

    sleep(1000 * 10);
    console.log(JSON.stringify(ladder.players));
} catch (e) {
    console.log(e);
}
