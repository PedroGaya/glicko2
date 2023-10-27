import { User } from "@prisma/client";
import { Elo } from "./elo";
import { Glicko2 } from "./glicko2";
import { LadderParams, Match, Rating, RatingPeriod } from "./types";
import { prisma } from "./client";

export class Ladder {
    id: number;
    name: string;
    elo: Elo;
    glicko: Glicko2;
    ratingPeriod: RatingPeriod;

    matches: Match[];

    constructor(params: LadderParams) {
        this.elo = new Elo(params.elo);
        this.glicko = new Glicko2(params.glicko);

        this.ratingPeriod = params.ratingPeriod;
    }
}
