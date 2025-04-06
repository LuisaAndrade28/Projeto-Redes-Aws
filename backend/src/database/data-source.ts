import "reflect-metadata"
import { DataSource } from "typeorm"
import User from "../models/User"
import { CreateUsers1743688042218 } from "./migrations/1743688042218-CreateUsers"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "",
    port: 3306,
    username: "",
    password: "",
    database: "",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [CreateUsers1743688042218],
    subscribers: [],
})
