import { EloRating } from "./classes/elo";
import { GlickoRating } from "./classes/glicko2";
import { User } from "./classes/user";

export type RatingPeriod = {
    games: number;
    hours?: number;
};

export type Rating = {
    elo: EloRating;
    glicko: GlickoRating;
};

// players[0] is always Player One. Score is always given in relation to Player One
export type Match = {
    id: string;
    ladderId: string | null;
    players: [User, User];
    start: Date;
    end?: Date;
    finished: boolean;
    rated: boolean;
    score: number | null;
    hasRatedPlayerOne: {
        elo: boolean;
        glicko: boolean;
    };
    hasRatedPlayerTwo: {
        elo: boolean;
        glicko: boolean;
    };
};
