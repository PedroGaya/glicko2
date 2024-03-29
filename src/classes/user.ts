import { getUserRatings, updateRating } from "../crud/rating";
import { createUser } from "../crud/user";
import { Match, Rating } from "../types";

export type UserParams = {
    id?: string;
    name: string;
    ratings: { ladderId: string; rating: Rating }[];
};

export class User {
    id: string;
    name: string;
    ratings: { ladderId: string; rating: Rating }[];

    constructor(params: UserParams) {
        this.id = params.id ?? crypto.randomUUID();

        this.name = params.name;
        this.ratings = params.ratings;
    }

    static async build(params: UserParams) {
        const user = await createUser(params.name);

        return new User({
            id: params.id ?? user.id,
            name: user.name,
            ratings: params.ratings,
        });
    }

    public getRating(ladderId: string) {
        const ratings = this.ratings.find((r) => r.ladderId == ladderId);
        if (!ratings) throw "User is not rated in this ladder.";
        return ratings.rating;
    }

    public async updateRatings(ladderId: string, newRating: Rating) {
        const idx = this.ratings.findIndex(
            (rating) => rating.ladderId == ladderId
        );

        if (idx == -1) {
            this.ratings.push({ ladderId, rating: newRating });
        } else {
            this.ratings[idx].rating = newRating;
        }

        const updatedRating = await updateRating(this.id, ladderId, newRating);

        return { ladderId, rating: newRating };
    }
}
