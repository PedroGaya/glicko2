import Elysia from "elysia";
import { store } from "../../../libs/store";
import { User, UserParams } from "../../classes/user";

export const userService = new Elysia({ name: "userService" })
    .use(store)
    .derive(({ store }) => ({
        create: async (params: UserParams) => {
            const user = await User.build(params);
            store.users.push(user);
            return user;
        },
    }));
