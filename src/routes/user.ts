import { Elysia } from "elysia";

const users = new Elysia({ prefix: "/user" });

users.get("/", () => "From users!");
users.get("/ping", (ctx) => "pong");

export default users;
