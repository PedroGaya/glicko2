import { Elysia } from "elysia";
import user from "./routes/user";
import { loadData } from "./crud/load";
import { User } from "./classes/user";
import { Ladder } from "./classes/ladder";

const userPool: User[] = [];
const ladderPool: Ladder[] = [];

await loadData(userPool, ladderPool);

const app = new Elysia()
    .state("users", userPool as User[])
    .state("ladders", ladderPool as Ladder[])
    .get("/", () => "OK");

app.use(user);

export default app;
