import { Elo } from "./elo";
import { Glicko2 } from "./glicko2";
import { LadderParams, Match, RatingPeriod } from "./types";

export class Ladder {
    id: number;
    name: string;
    elo: Elo;
    glicko: Glicko2;
    ratingPeriod: RatingPeriod;

    matches: Match[];
    rpMatches: Match[];
    ongoingMatches: Match[];

    constructor(params: LadderParams) {
        this.elo = new Elo(params.elo);
        this.glicko = new Glicko2(params.glicko);

        this.ratingPeriod = params.ratingPeriod;
    }

    public startMatch() {}
}
