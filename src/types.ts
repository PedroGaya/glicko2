import { EloRating } from "./classes/elo";
import { GlickoRating } from "./classes/glicko2";

export type RatingPeriod = {
    games?: number;
    hours?: number;
};

export type Rating = {
    elo: EloRating;
    glicko: GlickoRating;
};

// players[0] is always Player One. Score is always given in relation to Player One
export type Match = {
    players: [Rating, Rating];
    score?: number;
};
