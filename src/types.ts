// players[0] is always Player One. Score is always given in relation to Player One
export type Match = { players: [Player, Player]; score: number };

export type Player = {
    elo: {
        rating: number;
        k_value: number;
    };
    glicko: {
        rating: number;
        deviation: number;
        volatility: number;
    };
};
