import { Ratings } from "@prisma/client";

export type Match = { id: number; P1: Ratings; P2: Ratings; score?: number };
