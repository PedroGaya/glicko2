import { createLadder } from "../crud/ladder";
import { createMatch, updateRatedMatch } from "../crud/match";
import { Match, RatingPeriod } from "../types";
import { Elo, EloParams } from "./elo";
import { Glicko2, GlickoParams } from "./glicko2";
import { User } from "./user";

export type LadderParams = {
    id?: string;
    name: string;
    game: string;
    ratingPeriod: RatingPeriod;
    elo: EloParams;
    glicko: GlickoParams;
    players: User[];
};

export class Ladder {
    id: string;
    name: string;
    game: string;
    elo: Elo;
    glicko: Glicko2;
    ratingPeriod: RatingPeriod;

    players: User[];

    constructor(params: LadderParams) {
        this.id = params.id ?? crypto.randomUUID();

        this.game = params.game;
        this.name = params.name;
        this.elo = new Elo(params.elo);
        this.glicko = new Glicko2(params.glicko);
        this.ratingPeriod = params.ratingPeriod;

        this.players = [];
        for (const user of params.players) {
            this.registerPlayer(user);
        }
    }

    static async build(params: LadderParams) {
        const data = await createLadder(params);

        return new Ladder({
            id: data.id,
            ...params,
        });
    }

    public isRated(user: User): boolean {
        return user.ratings
            .map((rating) => {
                return rating.ladderId;
            })
            .includes(this.id);
    }

    public async registerPlayer(user: User) {
        if (!this.isRated(user)) {
            await user.updateRatings(this.id, {
                elo: this.elo.getNewRating(),
                glicko: this.glicko.getNewRating(),
            });
        }
        this.players.push(user);
        const rating = user.ratings.find((r) => r.ladderId == this.id);
        if (!rating)
            throw `Failed to register user (${user.id}) to ladder (${this.id})`;
        return rating;
    }

    public async updateElo(match: Match): Promise<Match> {
        const player1 = match.players[0];
        const player2 = match.players[1];

        const newRatings = this.elo.updateRating(match);

        await player1.updateRatings(this.id, newRatings[0]);
        await player2.updateRatings(this.id, newRatings[1]);

        return {
            ...match,
            hasRatedPlayerOne: {
                elo: true,
                glicko: false,
            },
            hasRatedPlayerTwo: {
                elo: true,
                glicko: false,
            },
        };
    }

    public async updateGlicko(player: User, matches: Match[]) {
        const filtered = matches.filter((match) =>
            match.players.includes(player)
        );
        const newRating = this.glicko.updateRating(player, filtered, this.id);
        const updated = await player.updateRatings(this.id, newRating);

        for (const match of matches) {
            switch (match.players.indexOf(player) + 1) {
                case 1:
                    await updateRatedMatch(
                        match,
                        {
                            ...match.hasRatedPlayerOne,
                            glicko: true,
                        },
                        match.hasRatedPlayerTwo
                    );
                    break;
                case 2:
                    await updateRatedMatch(match, match.hasRatedPlayerOne, {
                        ...match.hasRatedPlayerTwo,
                        glicko: true,
                    });
                    break;
            }
        }

        return updated;
    }
}
