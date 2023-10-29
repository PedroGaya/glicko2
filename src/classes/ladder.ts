import { createLadder } from "../crud/ladder";
import { createMatch } from "../crud/match";
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
    matches: Match[];
    players: User[];
};

export class Ladder {
    id: string;
    name: string;
    elo: Elo;
    glicko: Glicko2;
    ratingPeriod: RatingPeriod;

    matches: Match[];
    matchesOngoing: Match[];

    players: User[];

    constructor(params: LadderParams) {
        this.id = params.id;

        this.name = params.name;
        this.elo = new Elo(params.elo);
        this.glicko = new Glicko2(params.glicko);
        this.ratingPeriod = params.ratingPeriod;

        this.matches = params.matches;
        this.matchesOngoing = [];

        this.players = [];
        for (const user of params.players) {
            this.registerPlayer(user);
        }
    }

    static async build(params: LadderParams) {
        const data = await createLadder(params);

        return new Ladder({
            id: params.id ?? data.id,
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
        return user.ratings.find((r) => r.ladderId == this.id);
    }

    private async updateElo(match: Match) {
        const player1 = match.players[0];
        const player2 = match.players[1];

        const newRatings = this.elo.updateRating(match);

        await player1.updateRatings(this.id, newRatings[0]);
        await player2.updateRatings(this.id, newRatings[1]);
    }

    public async updateGlicko(player: User, matches: Match[]) {
        const filtered = matches.filter((match) =>
            match.players.includes(player)
        );

        const newRating = this.glicko.updateRating(player, filtered, this.id);
        return await player.updateRatings(this.id, newRating);
    }

    public async startMatch(player1: User, player2: User) {
        if (!this.isRated(player1)) await this.registerPlayer(player1);
        if (!this.isRated(player2)) await this.registerPlayer(player2);

        const match: Match = {
            id: crypto.randomUUID(),
            ladderId: this.id,
            players: [player1, player2],
            start: new Date(),
            finished: false,
            score: null,
        };

        this.matchesOngoing.push(match);

        return match;
    }

    public async endMatch(matchId: string, score: number) {
        const match = this.matchesOngoing.find((match) => match.id == matchId);

        const finishedMatch = {
            ...match,
            end: new Date(),
            finished: true,
            score: score,
        };

        this.matches.push(finishedMatch);

        await this.updateElo(finishedMatch);

        this.matchesOngoing = this.matchesOngoing.filter(
            (match) => match.id != matchId
        );

        const createdMatch = await createMatch(finishedMatch);

        return finishedMatch;
    }
}
