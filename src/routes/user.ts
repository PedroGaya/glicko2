import { Elysia } from "elysia";
import logger from "../../libs/logger";

const users = new Elysia({ prefix: "/user" });

users.get("/", () => "From users!");
users.get("/ping", (ctx) => {
    logger.info("Got pinged bruh");
    return "pong";
});

export default users;
