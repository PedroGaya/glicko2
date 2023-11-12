import { Elysia } from "elysia";
import { ladderModel } from "./ladderModel";
import { ladderService } from "./ladderService";

const users = new Elysia({ prefix: "/ladders" })
    .use(ladderModel)
    .use(ladderService)
    .post(
        "/create",
        async ({ create, body }) => {
            return await create({ ...body, players: [] });
        },
        { body: "createLadderSchema" }
    )
    .post(
        "/register",
        async ({ registerPlayer, body }) => {
            return await registerPlayer(body.ladderId, body.userId);
        },
        { body: "registerPlayerSchema" }
    )
    .post(
        "/updateGlicko",
        async ({ updateGlicko, body }) => {
            return await updateGlicko(body.ladderId, body.userId);
        },
        { body: "updateGlickoSchema" }
    );

export default users;
