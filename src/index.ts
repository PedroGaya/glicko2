import { prisma } from "./client";
import { Ladder } from "./ladder";
import { LadderParams } from "./types";

const data = await prisma.ladder.findMany();

const ladders: Ladder[] = data.map((ladderData) => {
    const params: LadderParams = {
        id: ladderData.id,
        name: ladderData.name,
        elo: {
            defaultRating: ladderData.eloRating,
            defaultK: 50,
        },
        glicko: {
            defaultRating: ladderData.glickoRating,
            defaultRatingDeviation: ladderData.glickoDeviation,
            defaultVolatility: ladderData.glickoVolatility,
            tau: ladderData.glickoTau,
        },
        ratingPeriod: {
            games: 15,
            hours: 24,
        },
    };

    return new Ladder(params);
});
