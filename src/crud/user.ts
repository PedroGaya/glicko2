import { prisma } from "../../libs/prisma";

export const getUsers = async () => {
    return await prisma.user.findMany();
};

export const createUser = async (name: string) => {
    return await prisma.user.create({
        data: {
            name: name,
        },
    });
};
