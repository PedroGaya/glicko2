import { Rating, Match } from "../types";
import { User } from "./user";

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

export class Glicko2 {
    defaultRating: number;
    defaultRatingDeviation: number;
    defaultVolatility: number;
    tau: number;

    constructor(params: GlickoParams) {
        this.defaultRating = params.defaultRating;
        this.defaultRatingDeviation = params.defaultRatingDeviation;
        this.defaultVolatility = params.defaultVolatility;
        this.tau = params.tau;
    }

    public getNewRating(): GlickoRating {
        return {
            rating: this.defaultRating,
            deviation: this.defaultRatingDeviation,
            volatility: this.defaultVolatility,
        };
    }

    public updateRating(
        user: User,
        matches: Match[],
        ladderId: string
    ): Rating {
        const userRating = user.getRating(ladderId);

        const r = userRating.glicko.rating;
        const RD = userRating.glicko.deviation;

        const mu = (r - 1500) / 173.7178;
        const phi = RD / 173.7178;
        const vol = userRating.glicko.volatility;

        if (matches.length == 0) {
            const newGlickoRating: GlickoRating = {
                rating: r,
                deviation: RD,
                volatility: Math.sqrt(phi * phi + vol * vol),
            };

            return {
                ...user.getRating(ladderId),
                glicko: newGlickoRating,
            };
        }

        const tau = this.tau;

        let v_acc: number = 0;
        let delta_acc: number = 0;

        matches.forEach((match, idx) => {
            const opponent = match.players[1 - match.players.indexOf(user)];
            const opponentRating = opponent.getRating(ladderId);

            if (match.score === null || match.score === undefined)
                throw "Can't update null score. Aborting.";

            const score =
                match.score == 0.5
                    ? 0.5
                    : match.players.indexOf(user) == 0
                    ? match.score
                    : 1 - match.score;

            let phi_j = opponentRating.glicko.deviation / 173.7178;
            let mu_j = (opponentRating.glicko.rating - 1500) / 173.7178;

            let g =
                1 / Math.sqrt(1 + (3 * phi_j * phi_j) / (Math.PI * Math.PI));
            let E = 1 / (1 + Math.exp(-g * (mu - mu_j)));

            let v_partial = g * g * E * (1 - E);
            v_acc += v_partial;

            let delta_partial = g * (score - E);
            delta_acc += delta_partial;
        });

        const v = 1 / v_acc;
        const delta = v * delta_acc;

        let epsilon = 0.000001;
        let a = Math.log(vol * vol);

        let phi2 = phi * phi;
        let delta2 = delta * delta;

        const f = (x: number) => {
            let ePowX = Math.exp(x);

            return (
                (ePowX * (delta2 - phi2 - v - ePowX)) /
                    (2 * (phi2 + v + ePowX) * (phi2 + v + ePowX)) -
                (x - a) / (tau * tau)
            );
        };

        let A = a;
        let B: number;

        if (delta2 > phi2 + v) {
            B = Math.log(delta2 - phi2 - v);
        } else {
            let k = 1;
            while (f(a - k * tau) < 0) {
                k += 1;
            }
            B = a - k * tau;
        }

        let fa = f(A);
        let fb = f(B);
        while (Math.abs(B - A) > epsilon) {
            let C = A + ((A - B) * fa) / (fb - fa);
            let fc = f(C);

            if (fc * fb <= 0) {
                A = B;
                fa = fb;
            } else {
                fa = fa / 2;
            }

            B = C;
            fb = fc;

            if (Math.abs(B - A) <= epsilon) break;
        }

        const new_vol = Math.exp(A / 2);
        let D = Math.sqrt(phi2 + new_vol * new_vol);

        const new_phi = 1 / Math.sqrt(1 / (D * D) + 1 / v);
        const new_mu = mu + new_phi * new_phi * delta_acc;

        const new_rating = 173.7178 * new_mu + 1500;
        const new_RD = 173.7178 * new_phi;

        const newGlickoRating = {
            rating: new_rating,
            deviation: new_RD,
            volatility: new_vol,
        };

        return {
            ...user.getRating(ladderId),
            glicko: newGlickoRating,
        };
    }

    public getGXE(rating: Rating): number {
        const r = rating.glicko.rating;
        const rd = rating.glicko.deviation;

        if (rd > 100) {
            throw "This player's rating is provisional (RD > 100).";
        } else {
            return (
                Math.round(
                    10000 /
                        (1 +
                            10 **
                                (((1500 - r) * Math.PI) /
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
}
