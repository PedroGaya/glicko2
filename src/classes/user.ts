import { Rating } from "../types";

export type UserParams = {
    name: string;
};

export class User {
    id: string;
    name: string;
    ratings: { ladderId: string; rating: Rating }[];

    constructor(params: UserParams) {
        this.name = params.name;
        this.ratings = [];

        this.id = crypto.randomUUID();
    }

    public updateRatings(ladderId: string, rating: Rating) {
        const idx = this.ratings.findIndex(
            (rating) => rating.ladderId == ladderId
        );

        if (idx == -1) {
            this.ratings.push({ ladderId, rating });
        } else {
            this.ratings[idx].rating = rating;
        }
    }
}
