import { EloParams, EloRating, Match } from "./types";

export class Elo {
    defaultRating: number;
    defaultK: number;

    constructor(params: EloParams) {
        this.defaultRating = params.defaultRating;
        this.defaultK = params.defaultK;
    }

    public getNewRatings(): EloRating {
        return {
            rating: this.defaultRating,
            k_value: this.defaultK,
        };
    }

    public updateRatings(m: Match): { p1: EloRating; p2: EloRating } {
        const { players, score } = m;

        const P1 = players[0];
        const P2 = players[1];

        const p1s = score; // Actual score for p1
        const p2s = 1 - score; // Actual score for p2

        const q1 = 10 ** (P1.elo.rating / 480);
        const q2 = 10 ** (P2.elo.rating / 480);

        const p1e = q1 / (q1 + q2); // Expected score for p1
        const p2e = q2 / (q2 + q1); // Expected score for p2

        const p1k = this.getK(P1.elo.rating, p1s);
        const p2k = this.getK(P2.elo.rating, p2s);

        const new_p1r = P1.elo.rating + p1k * (p1s - p1e);
        const new_p2r = P2.elo.rating + p2k * (p2s - p2e);

        return {
            p1: {
                rating: new_p1r,
                k_value: p1k,
            },
            p2: {
                rating: new_p2r,
                k_value: p2k,
            },
        };
    }

    private getK(rating: number, score: number): number {
        if (rating >= 1600) return 32;
        if (rating >= 1300 && rating <= 1599) return 40;
        if (rating >= 1100 && rating <= 1299) return 50;

        if (rating == 1000) {
            if (score === 1) return 80;
            else return 20;
        }

        if (score == 1) {
            return Math.round(rating * -0.30612244898 + 386.428571429);
        } else {
            return Math.round(rating * 0.30612244898 + 286.428571429);
        }
    }
}
