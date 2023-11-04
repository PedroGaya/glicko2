import { Elysia } from "elysia";
import logger from "../libs/logger";

import games from "./routes/games";
import users from "./routes/users";
import ladders from "./routes/ladders";
import matches from "./routes/matches";

const app = new Elysia()
    .onRequest(({ request }) => {
        const message = {
            method: request.method,
            url: request.url,
            body: request.body,
        };

        logger.debug(message);
    })
    .onError(({ error }) => {
        const message = {
            name: error.name,
            message: error.message,
            cause: error.cause,
            stack: error.stack,
        };
        logger.error(message);
        return new Response(error.message);
    })
    .get("/", () => "OK")
    .use(games)
    .use(users)
    .use(ladders)
    .use(matches);

export default app;
