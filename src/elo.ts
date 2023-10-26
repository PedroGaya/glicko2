import { Match } from "./types";

class Elo {
    private updateElo(m: Match) {
        const { players, score } = m;

        const P1 = players[0];
        const P2 = players[1];

        const p1s = score; // Actual score for p1
        const p2s = 1 - score; // Actual score for p2

        const q1 = 10 ** (P1.eloRating / 480);
        const q2 = 10 ** (P2.eloRating / 480);

        const p1e = q1 / (q1 + q2); // Expected score for p1
        const p2e = q2 / (q2 + q1); // Expected score for p2

        const new_p1r =
            P1.eloRating + this.getK(P1.eloRating, p1s) * (p1s - p1e);
        const new_p2r =
            P2.eloRating + this.getK(P2.eloRating, p2s) * (p2s - p2e);

        return { new_p1r, new_p2r };
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
