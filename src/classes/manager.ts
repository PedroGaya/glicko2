import { loadData } from "../crud/load";
import { createMatch } from "../crud/match";
import { Match } from "../types";

import { Ladder } from "./ladder";
import { User } from "./user";

export type ManagerParams = {
    players: User[];
    ladders: Ladder[];
};

export class Manager {
    matchesOngoing: Match[];
    players: User[];
    ladders: Ladder[];

    constructor(params: ManagerParams) {
        this.matchesOngoing = [];
        this.players = params.players ?? [];
        this.ladders = params.ladders ?? [];
    }

    public async synchronize() {
        this.players = [];
        this.ladders = [];
        await loadData(this.players, this.ladders);
    }

    public addLadder(ladder: Ladder) {
        this.ladders.push(ladder);
    }

    public getLadder(ladderId: string) {
        const l = this.ladders.find((l) => l.id == ladderId);
        if (!l) throw "Couldn't find ladder.";
        return l;
    }

    public addPlayer(player: User) {
        this.players.push(player);
    }

    public getPlayer(userId: string) {
        const p = this.players.find((p) => p.id == userId);
        if (!p) throw "Couldn't find player.";
        return p;
    }

    public async startMatch(
        ladderId: string | null,
        player1: User,
        player2: User,
        rated: boolean
    ) {
        if (player1.id == player2.id)
            throw "Cannot start match with two identical users.";

        const match: Match = {
            id: crypto.randomUUID(),
            ladderId: ladderId,
            players: [player1, player2],
            start: new Date(),
            finished: false,
            rated: rated,
            score: null,
            hasRatedPlayerOne: {
                elo: false,
                glicko: false,
            },
            hasRatedPlayerTwo: {
                elo: false,
                glicko: false,
            },
        };

        this.matchesOngoing.push(match);

        return match;
    }

    public async endMatch(matchId: string, score: number) {
        const match = this.matchesOngoing.find((match) => match.id == matchId);

        if (!match) throw "Couldn't find ongoing match with this id.";

        const finishedMatch: Match = {
            ...match,
            end: new Date(),
            finished: true,
            score: score,
        };

        if (match.rated && match.ladderId) {
            const ladder = this.ladders.find((l) => l.id == match.ladderId);
            if (!ladder) throw `Couldn't find ladder ${match.ladderId}.`;
            const updatedMatch = await ladder.updateElo(finishedMatch);
            await createMatch(updatedMatch);
            this.matchesOngoing = this.matchesOngoing.filter(
                (match) => match.id != matchId
            );
            return updatedMatch;
        } else {
            await createMatch(finishedMatch);
            this.matchesOngoing = this.matchesOngoing.filter(
                (match) => match.id != matchId
            );
            return finishedMatch;
        }
    }
}
