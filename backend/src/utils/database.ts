import path from "path";
import { Connection, createConnection } from "typeorm";
import { logger } from "./logger";
import { sleep } from "./index";

const DBConfig = {
  charset: "utf8mb4_unicode_ci",
  database: process.env.DB_LIBRARY || "main",
  entities: [path.join(__dirname, "../entities/*.js"), path.join(__dirname, "../entities/*.ts")],
  extra:
    process.env.NODE_ENV && process.env.NODE_ENV === "production"
      ? {
          ssl: true,
        }
      : {},
  host: process.env.DB_HOST,
  logging: false,
  migrations: [path.join(__dirname, "../migration/**/*.js")],
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  subscribers: [path.join(__dirname, "../subscriber/**/*.js")],
  synchronize: true,
  timezone: "utc",
  type: "postgres" as "postgres",
  username: process.env.DB_USER,
};

export async function connectToDatabase(tries: number = 10): Promise<Connection | null> {
  if (tries === 0) {
    return null;
  }
  let connection: Connection | null = null;
  try {
    connection = await createConnection(DBConfig);
  } catch (e) {
    logger.error(e);
    logger.error("Could not connect to database. Retry in 10 seconds...");
    await sleep(10000);
    connection = await connectToDatabase(tries - 1);
  }
  return connection;
}
