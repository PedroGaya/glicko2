import { Elysia } from "elysia";
import logger from "../libs/logger";

import games from "./routes/games";
import users from "./routes/users";
import ladders from "./routes/ladders";
import matches from "./routes/matches";

const app = new Elysia()
    .onRequest(({ request }) => {
        logger.debug({
            method: request.method,
            url: request.url,
            body: request.body,
        });
    })
    .onError(({ set, code, error }) => {
        let statusCode: number = 500;

        // switch (code) {
        //     case "UNKNOWN":
        //         statusCode = 500;
        //         break;
        //     case "VALIDATION":
        //         statusCode = 400;
        //         break;
        //     case "NOT_FOUND":
        //         statusCode = 404;
        //         break;
        //     case "PARSE":
        //         statusCode = 400;
        //         break;
        //     case "INTERNAL_SERVER_ERROR":
        //         statusCode = 500;
        //         break;
        //     case "INVALID_COOKIE_SIGNATURE":
        //         statusCode = 401;
        //         break;
        // }

        set.status = statusCode;
        return {
            message: error.toString(),
        };
    })
    .get("/", () => "OK")
    .use(games)
    .use(users)
    .use(ladders)
    .use(matches);

export default app;
