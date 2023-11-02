import { format, createLogger, transports } from "winston";

const transportList = [];

const logger = createLogger({
    level: "debug",
    transports: [
        new transports.Console({
            level: Bun.env.LOG_LEVEL,
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
