// Example
import { Connection, getConnection } from "typeorm";
import { logger } from "../src/utils/logger";
import { connectToDatabase } from "../src/utils/database";

beforeAll(async () => {
  try {
    const connection: Connection | null = await connectToDatabase();
    if (connection === null) {
      throw new Error("Could not connect to database...");
    }
    logger.info(`Database connection established: ${connection.isConnected}`);
    await connection.connect();
  } catch (e) {
    // do nothing as an error is expected here because tests try to get
    // the same DB connection
  }
});

afterAll(async () => {
  await getConnection().close();
});
