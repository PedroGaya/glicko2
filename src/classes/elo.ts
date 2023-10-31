import { Match, Rating } from "../types";

export type EloParams = {
    defaultRating: number;
    defaultK: number;
};

export type EloRating = {
    rating: number;
    k_value: number;
};

export class Elo {
    defaultRating: number;
    defaultK: number;

    constructor(params: EloParams) {
        this.defaultRating = params.defaultRating;
        this.defaultK = params.defaultK;
    }

    public getNewRating(): EloRating {
        return {
            rating: this.defaultRating,
            k_value: this.defaultK,
        };
    }

    public updateRating(m: Match): Rating[] {
        const { ladderId, players, score } = m;

        const p1r = players[0].getRating(ladderId);
        const p2r = players[1].getRating(ladderId);

        if (score === null || score === undefined)
            throw "Can't update null score. Aborting.";

        const p1s = score; // Actual score for p1
        const p2s = 1 - score; // Actual score for p2

        const q1 = 10 ** (p1r.elo.rating / 480);
        const q2 = 10 ** (p2r.elo.rating / 480);

        const p1e = q1 / (q1 + q2); // Expected score for p1
        const p2e = q2 / (q2 + q1); // Expected score for p2

        const p1k = this.getK(p1r.elo.rating, p1s);
        const p2k = this.getK(p2r.elo.rating, p2s);

        const new_p1r = p1r.elo.rating + p1k * (p1s - p1e);
        const new_p2r = p2r.elo.rating + p2k * (p2s - p2e);

        return [
            {
                glicko: { ...p1r.glicko },
                elo: {
                    rating:
                        new_p1r < this.defaultRating
                            ? this.defaultRating
                            : new_p1r,
                    k_value: p1k,
                },
            },
            {
                glicko: { ...p2r.glicko },
                elo: {
                    rating:
                        new_p2r < this.defaultRating
                            ? this.defaultRating
                            : new_p2r,
                    k_value: p2k,
                },
            },
        ];
    }

    private getK(rating: number, score: number): number {
        if (rating >= 1100 && rating <= 1299) return 50;
        if (rating >= 1300 && rating <= 1599) return 40;
        if (rating >= 1600) return 32;

        if (rating == 1000) {
            if (score === 1) return 80;
            else return 20;
        } else if (rating > 1000 && rating < 1100) {
            if (score == 1) {
                return Math.round(rating * -0.30612244898 + 386.428571429);
            } else {
                return Math.round(rating * 0.30612244898 - 286.428571429);
            }
        } else {
            return this.defaultK;
        }
    }
}
