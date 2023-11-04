import { Elysia, t } from "elysia";
import { store } from "../../../libs/store";

import { userService } from "./userService";
import { userModel } from "./userModel";

const users = new Elysia({ prefix: "/users" })
    .use(userService)
    .use(userModel)
    .post(
        "/create",
        async ({ create, body }) => {
            return await create(body);
        },
        { body: "createSchema" }
    );

export default users;
