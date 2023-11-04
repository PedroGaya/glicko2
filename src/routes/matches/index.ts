import { Elysia } from "elysia";
import { matchModel } from "./matchModel";
import { matchService } from "./matchService";

const users = new Elysia({ prefix: "/matches" })
    .use(matchModel)
    .use(matchService)
    .post(
        "/startMatch",
        async ({ startMatch, body }) => {
            return await startMatch(
                body.ladderId,
                body.playerOneId,
                body.playerTwoId
            );
        },
        { body: "startMatchSchema" }
    )
    .post(
        "/endMatch",
        async ({ endMatch, body }) => {
            return await endMatch(body.ladderId, body.matchId, body.score);
        },
        { body: "endMatchSchema" }
    );

export default users;
