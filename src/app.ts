import { Elysia } from "elysia";
import users from "./routes/user";

const app = new Elysia().get("/", () => "OK");

app.use(users);

export default app;
