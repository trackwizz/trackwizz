import path from "path";
import { Connection, createConnection, ConnectionOptions } from "typeorm";
import { logger } from "./logger";
import { sleep } from "./index";

let DBConfig: ConnectionOptions | null = null;
// production
if (process.env.DATABASE_URL) {
  DBConfig = {
    type: "postgres" as const,
    url: process.env.DATABASE_URL,
    entities: [path.join(__dirname, "../entities/*.js"), path.join(__dirname, "../entities/*.ts")],
    logging: false,
    migrations: [path.join(__dirname, "../migration/**/*.js")],
    subscribers: [path.join(__dirname, "../subscriber/**/*.js")],
    synchronize: true,
  };
} else {
  DBConfig = {
    database: process.env.DB_LIBRARY || "main",
    entities: [path.join(__dirname, "../entities/*.js"), path.join(__dirname, "../entities/*.ts")],
    host: process.env.DB_HOST,
    logging: false,
    migrations: [path.join(__dirname, "../migration/**/*.js")],
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    subscribers: [path.join(__dirname, "../subscriber/**/*.js")],
    synchronize: true,
    type: "postgres" as const,
    username: process.env.DB_USER,
  };
}

/**
 * Connects the app to the database using 'typeORM' library.
 * It will try n times before returning an error that will stop the server.
 * @param tries: number of tries before stopping the server.
 */
export async function connectToDatabase(tries: number = 10): Promise<Connection | null> {
  if (tries === 0 || DBConfig === null) {
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
