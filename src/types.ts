import { Ratings } from "@prisma/client";

// players[0] is always Player One. Score is always given in relation to Player One
export type Match = { id: number; players: [Ratings, Ratings]; score: number };
