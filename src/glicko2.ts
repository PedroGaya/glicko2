export type Glicko2Params = {
    r: number; // Default glicko2 rating
    RD: number; // Default deviation
    vol: number; // Default volatility
    rp: number; // Rating Period, in number of games.
    tau: number; // System constant tau
};

// Glicko X-Act Estimate, or the odds of any given player beating a 1500~350 rated player.
function getGXE(rating: number, rd: number) {
    if (rd > 100) {
        return 0;
    } else {
        return (
            Math.round(
                10000 /
                    (1 +
                        10 **
                            (((1500 - rating) * Math.PI) /
                                Math.sqrt(
                                    3 * Math.log(10) ** 2 * rd ** 2 +
                                        2500 *
                                            (64 * Math.PI ** 2 +
                                                147 * Math.log(10) ** 2)
                                )))
            ) / 100
        );
    }
}
