import { prisma } from "../client";

const getUsers = async () => {
    return await prisma.user.findMany();
};

const createUser = async (name: string) => {
    return await prisma.user.create({
        data: {
            name: name,
        },
    });
};
