import { Player, Glicko2, newProcedure } from "glicko2.ts";

export const glicko = new Glicko2({
    tau: 0.5,
    rating: 1500,
    rd: 350,
    vol: 0.06,
    volatilityAlgorithm: newProcedure,
});

export const getGXE = (player: Player) => {
    const rating = player.getRating();
    const rd = player.getRd();

    if (rd > 100) {
        return 0;
    } else {
        const gxe =
            // Glicko X-Act Estimate for Pokemon Showdown! ladder.
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
            ) / 100;

        return gxe;
    }
};

// round(10000 / (1 + 10^(((1500 - R) * pi / sqrt(3 * ln(10)^2 * RD^2 + 2500 * (64 * pi^2 + 147 * ln(10)^2)))))) / 100
