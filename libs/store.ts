import Elysia from "elysia";
import { Ladder } from "../src/classes/ladder";
import { User } from "../src/classes/user";
import { loadData } from "../src/crud/load";

export const userPool: User[] = [];
export const ladderPool: Ladder[] = [];

await loadData(userPool, ladderPool);

export const store = new Elysia({ name: "store" })
    .state("users", userPool as User[])
    .state("ladders", ladderPool as Ladder[]);
