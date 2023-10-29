import { prisma } from "../client";
import { Match } from "../types";

export const getUserMatches = async (userId: string, ladderId: string) => {
    const matches = await prisma.match.findMany({
        where: {
            OR: [
                {
                    playerOneId: {
                        equals: userId,
                    },
                },
                {
                    playerTwoId: {
                        equals: userId,
                    },
                },
            ],
        },
    });

    return matches.filter((match) => match.ladderId == ladderId);
};

export const getLadderMatches = async (ladderId: string) => {
    const matches = await prisma.match.findMany({
        where: {
            id: ladderId,
        },
    });

    return matches.filter((match) => match.ladderId == ladderId);
};
export const createMatch = async (match: Match) => {
    if (!match.finished) throw "Match is not yet finished.";

    return await prisma.match.create({
        data: {
            id: match.id,
            ladder: {
                connect: {
                    id: match.ladderId,
                },
            },
            playerOne: {
                connect: {
                    id: match.players[0].id,
                },
            },
            playerTwo: {
                connect: {
                    id: match.players[1].id,
                },
            },
            start: match.start,
            end: match.end,
            score: match.score,
        },
    });
};