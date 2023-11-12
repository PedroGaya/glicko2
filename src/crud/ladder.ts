import { LadderParams } from "../classes/ladder";
import { prisma } from "../../libs/prisma";

export const getLadders = async () => {
    return await prisma.ladder.findMany();
};

export const createLadder = async (params: LadderParams) => {
    return await prisma.ladder.create({
        data: {
            id: params.id,
            name: params.name,
            game: {
                connectOrCreate: {
                    where: {
                        name: params.game,
                    },
                    create: {
                        name: params.game,
                    },
                },
            },
            eloRating: params.elo.defaultRating,
            eloK: params.elo.defaultK,
            glickoRating: params.glicko.defaultRating,
            glickoDeviation: params.glicko.defaultRatingDeviation,
            glickoVolatility: params.glicko.defaultVolatility,
            glickoTau: params.glicko.tau,
            ratingPeriodGames: params.ratingPeriod.games,
            ratingPeriodHours: params.ratingPeriod.hours ?? 24,
        },
    });
};
