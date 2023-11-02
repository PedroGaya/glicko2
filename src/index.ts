import logger from "../libs/logger";
import app from "./app";

app.onRequest((ctx) => {
    const message = {
        method: ctx.request.method,
        url: ctx.request.url,
        body: ctx.request.body,
    };

    logger.debug(message);
});

app.onError((ctx) => {
    const message = {
        name: ctx.error.name,
        message: ctx.error.message,
        cause: ctx.error.cause,
        stack: ctx.error.stack,
    };
    logger.error(message);
});

app.listen(
    {
        hostname: Bun.env.APP_HOST,
        port: Bun.env.APP_PORT,
    },
    ({ hostname, port }) => {
        logger.info(`Running at http://${hostname}:${port}`);
    }
);
