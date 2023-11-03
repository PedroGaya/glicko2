import { format, createLogger, transports } from "winston";
import { LOG_LEVEL } from "./constants";

const transportList = [];

const logger = createLogger({
    level: "debug",
    transports: [
        new transports.Console({
            level: LOG_LEVEL,
            format: format.combine(
                format.timestamp({
                    format: "MMM-DD-YYYY HH:mm:ss",
                }),
                format.prettyPrint()
            ),
        }),
    ],
});

export default logger;
