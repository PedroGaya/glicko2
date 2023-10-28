import { Match } from "../types";
import { Elo, EloParams } from "./elo";
import { Glicko2, GlickoParams } from "./glicko2";
import { User } from "./user";

export type LadderParams = {
    name: string;
    elo: EloParams;
    glicko: GlickoParams;
};

export class Ladder {
    id: string;
    name: string;
    elo: Elo;
    glicko: Glicko2;

    matches: Match[];
    matchesRatingPeriod: Match[];

    players: User[];

    constructor(params: LadderParams) {
        this.elo = new Elo(params.elo);
        this.glicko = new Glicko2(params.glicko);
        this.name = params.name;
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
}
