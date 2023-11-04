import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const prismaCleanup = async () => {
    await prisma.rating.deleteMany();
    await prisma.match.deleteMany();
    await prisma.user.deleteMany();
    await prisma.ladder.deleteMany();
    await prisma.game.deleteMany();
};
