import { Elysia } from "elysia";

const users = new Elysia({ prefix: "/match" });

users.get("/", () => "From matches.");
users.get("/start", (ctx) => "pong");

export default users;
