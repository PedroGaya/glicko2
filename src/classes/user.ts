import { Match, Rating } from "../types";

export type UserParams = {
    name: string;
    ratings: { ladderId: string; rating: Rating }[];
};

export class User {
    id: string;
    name: string;
    ratings: { ladderId: string; rating: Rating }[];

    matches: Match[];
    matchesRatingPeriod: Match[];

    constructor(params: UserParams) {
        this.name = params.name;
        this.ratings = params.ratings;

        this.matches = [];
        this.matchesRatingPeriod = [];

        this.id = crypto.randomUUID();
    }

    public getRating(ladderId: string) {
        return this.ratings.find((r) => r.ladderId == ladderId).rating;
    }

    public updateRatings(ladderId: string, newRating: Rating) {
        const idx = this.ratings.findIndex(
            (rating) => rating.ladderId == ladderId
        );

        if (idx == -1) {
            this.ratings.push({ ladderId, rating: newRating });
        } else {
            this.ratings[idx].rating = newRating;
        }
    }

    public addMatch(match: Match) {
        this.matches.push(match);
        this.matchesRatingPeriod.push(match);
    }

    public findMatches(ladderId: string, ratingPeriod: boolean) {
        if (ratingPeriod) {
            return this.matchesRatingPeriod.filter(
                (m) => m.ladderId == ladderId
            );
        } else {
            return this.matches.filter((m) => m.ladderId == ladderId);
        }
    }

    public deleteMatches(ladderId: string, ratingPeriod: boolean) {
        if (ratingPeriod) {
            this.matchesRatingPeriod = this.matchesRatingPeriod.filter(
                (m) => m.ladderId != ladderId
            );
        } else {
            this.matches = this.matches.filter((m) => m.ladderId != ladderId);
        }
    }
}
