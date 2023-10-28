import { prisma } from "../client";
import { Rating } from "../types";

const getLadderRatings = async (ladderId: string) => {
    return await prisma.rating.findMany({
        where: {
            ladderId: ladderId,
        },
    });
};

const getUserRatings = async (userId: string) => {
    return await prisma.rating.findMany({
        where: {
            userId: userId,
        },
    });
};

const updateRating = async (
    userId: string,
    ladderId: string,
    { elo, glicko }: Rating
) => {
    const user = await prisma.user.findFirstOrThrow({
        where: {
            id: userId,
        },
    });

    const ladder = await prisma.ladder.findFirstOrThrow({
        where: {
            id: ladderId,
        },
    });

    return await prisma.rating.upsert({
        where: {
            userId_ladderId: {
                userId: userId,
                ladderId: ladderId,
            },
        },
        create: {
            user: {
                connect: user,
            },
            ladder: {
                connect: ladder,
            },
            eloRating: elo.rating,
            eloK: elo.k_value,
            glickoRating: glicko.rating,
            glickoDeviation: glicko.deviation,
            glickoVolatility: glicko.volatility,
        },
        update: {
            eloRating: elo.rating,
            eloK: elo.k_value,
            glickoRating: glicko.rating,
            glickoDeviation: glicko.deviation,
            glickoVolatility: glicko.volatility,
        },
    });
};
