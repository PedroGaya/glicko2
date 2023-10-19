import "reflect-metadata";
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
    .then(() => {
        console.log("We're so fucking back bros");
    })
    .catch((error) => console.log(error));
