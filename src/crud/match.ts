import { prisma } from "../../libs/prisma";
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
            ladderId: ladderId,
        },
    });

    return matches.filter((match) => match.ladderId == ladderId);
};
export const createMatch = async (match: Match) => {
    if (!match.finished || !match.end) throw "Match is not yet finished.";
    if (!match.score) throw "Invalid score.";

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
