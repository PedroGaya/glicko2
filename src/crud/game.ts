import { prisma } from "../client";

export const getGames = async () => {
    return await prisma.game.findMany();
};

export const createGame = async (name: string) => {
    return await prisma.game.create({
        data: {
            name: name,
        },
    });
};
