import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// create a new user
await prisma.user.create({
    data: {
        name: "John Dough",
    },
});

// count the number of users
const count = await prisma.user.count();
console.log(`There are ${count} users in the database.`);
