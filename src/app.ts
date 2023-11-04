import { Elysia } from "elysia";

import games from "./routes/games";
import users from "./routes/users";
import logger from "../libs/logger";

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
        return new Response(error.toString());
    })
    .get("/", () => "OK")
    .use(games)
    .use(users);

export default app;
