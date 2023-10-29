import { Match, Rating } from "../types";

export type UserParams = {
    name: string;
    ratings: { ladderId: string; rating: Rating }[];
};

export class User {
    id: string;
    name: string;
    ratings: { ladderId: string; rating: Rating }[];

    constructor(params: UserParams) {
        this.name = params.name;
        this.ratings = params.ratings;

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
}
