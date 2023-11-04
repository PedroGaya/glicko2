import { Elysia } from "elysia";

import games from "./routes/games";
import { store } from "../libs/store";

const app = new Elysia()
    .use(store)
    .get("/", () => "OK")
    .use(games);

export default app;
