import { APP_HOST, APP_PORT } from "../libs/constants";
import logger from "../libs/logger";
import app from "./app";

app.listen(
    {
        hostname: APP_HOST,
        port: APP_PORT,
    },
    ({ hostname, port }) => {
        logger.info(`Running at http://${hostname}:${port}`);
    }
);
