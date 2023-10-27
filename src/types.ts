export type GlickoParams = {
    defaultRating: number;
    defaultRatingDeviation: number;
    defaultVolatility: number;
    tau: number;
};

export type GlickoRating = {
    rating: number;
    deviation: number;
    volatility: number;
};

export type EloParams = {
    defaultRating: number;
    defaultK: number;
};

export type EloRating = {
    rating: number;
    k_value: number;
};

export type RatingPeriod = {
    games?: number;
    hours?: number;
};

export type LadderParams = {
    elo: EloParams;
    glicko: GlickoParams;
    ratingPeriod: RatingPeriod;
};

export type Ratings = {
    elo?: EloRating;
    glicko?: GlickoRating;
};

// players[0] is always Player One. Score is always given in relation to Player One
export type Match = { players: [Ratings, Ratings]; score: number };
