import { Elysia } from "elysia";

import { userService } from "./userService";
import { userModel } from "./userModel";

const users = new Elysia({ prefix: "/users" })
    .use(userModel)
    .use(userService)
    .post(
        "/create",
        async ({ create, body }) => {
            return await create(body);
        },
        { body: "createUserSchema" }
    );

export default users;
