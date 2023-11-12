import Elysia from "elysia";
import { Manager } from "../src/classes/manager";

const manager = new Manager({
    players: [],
    ladders: [],
});

await manager.synchronize();

export const store = new Elysia({ name: "store" })
    .state("manager", manager as Manager)
    .decorate("getUser", (userId: string) => {
        return manager.getPlayer(userId);
    })
    .decorate("getLadder", (ladderId: string) => {
        return manager.getLadder(ladderId);
    });
