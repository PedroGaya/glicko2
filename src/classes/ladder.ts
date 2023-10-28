import { Match, RatingPeriod } from "../types";
import { Elo, EloParams } from "./elo";
import { Glicko2, GlickoParams } from "./glicko2";
import { User } from "./user";

export type LadderParams = {
    name: string;
    game: string;
    ratingPeriod: RatingPeriod;
    elo: EloParams;
    glicko: GlickoParams;
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
        this.name = params.name;
        this.elo = new Elo(params.elo);
        this.glicko = new Glicko2(params.glicko);
        this.ratingPeriod = params.ratingPeriod;

        this.matches = [];
        this.matchesOngoing = [];

        this.players = [];

        this.id = crypto.randomUUID();
    }

    public isRegistered(user: User): boolean {
        return this.players.includes(user);
    }

    public registerPlayer(user: User) {
        if (!this.isRegistered(user)) {
            user.updateRatings(this.id, {
                elo: this.elo.getNewRating(),
                glicko: this.glicko.getNewRating(),
            });
            this.players.push(user);
        }

        return user.ratings.find((r) => r.ladderId == this.id);
    }

    private updateElo(match: Match) {
        const player1 = match.players[0];
        const player2 = match.players[1];

        const newRatings = this.elo.updateRating(match);

        player1.updateRatings(this.id, newRatings[0]);
        player2.updateRatings(this.id, newRatings[1]);
    }

    private updateGlicko(player: User) {
        const newRating = this.glicko.updateRating(
            player,
            player.findMatches(this.id, true),
            this.id
        );

        player.updateRatings(this.id, newRating);
        player.deleteMatches(this.id, true);
    }

    public startMatch(player1: User, player2: User) {
        if (!this.isRegistered(player1)) this.registerPlayer(player1);
        if (!this.isRegistered(player2)) this.registerPlayer(player2);

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

    public endMatch(matchId: string, score: number) {
        const match = this.matchesOngoing.find((match) => match.id == matchId);

        const finishedMatch = {
            ...match,
            end: new Date(),
            finished: true,
            score: score,
        };

        this.matches.push(finishedMatch);

        const p1 = match.players[0];
        const p2 = match.players[1];

        p1.addMatch(finishedMatch);
        p2.addMatch(finishedMatch);

        this.updateElo(finishedMatch);

        if (
            p1.findMatches(match.ladderId, true).length >=
            this.ratingPeriod.games
        ) {
            this.updateGlicko(p1);
        }

        if (
            p2.findMatches(match.ladderId, true).length >=
            this.ratingPeriod.games
        ) {
            this.updateGlicko(p2);
        }

        this.matchesOngoing = this.matchesOngoing.filter(
            (match) => match.id != matchId
        );

        return finishedMatch;
    }

    public endRatingPeriod() {
        for (const player of this.players) {
            this.updateGlicko(player);
        }
    }
}
