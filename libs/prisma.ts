import { PrismaClient } from "@prisma/client";
import logger from "./logger";

export const prisma = new PrismaClient();

export const prismaCleanup = async () => {
    try {
        await prisma.rating.deleteMany();
        await prisma.match.deleteMany();
        await prisma.user.deleteMany();
        await prisma.ladder.deleteMany();
        await prisma.game.deleteMany();
    } catch (e: unknown) {
        logger.error(e);
        process.exit(1);
    }
};
