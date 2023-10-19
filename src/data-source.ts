import { DataSource } from "typeorm";
import { Player } from "./entity/player";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./db/fortaleza-rankings",
    synchronize: true,
    logging: false,
    entities: [Player],
    subscribers: [],
    migrations: [],
});
