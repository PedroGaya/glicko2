// players[0] is always Player One. Score is always given in relation to Player One
export type Match = { players: [Player, Player]; score: number };

export type GlickoRating = {
    rating: number;
    deviation: number;
    volatility: number;
};

export type GlickoParams = {
    defaultRating: number;
    defaultRatingDeviation: number;
    defaultVolatility: number;
    ratingPeriod: {
        games?: number;
        hours?: number;
    };
    tau: number;
};

export type EloRating = {
    rating: number;
    k_value: number;
};

export type Player = {
    elo: EloRating;
    glicko: GlickoRating;
};
