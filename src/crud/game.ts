import { prisma } from "../client";

const getGames = async () => {
    return await prisma.game.findMany();
};

const createGame = async (name: string) => {
    return await prisma.game.create({
        data: {
            name: name,
        },
    });
};
