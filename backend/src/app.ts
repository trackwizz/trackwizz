import { config } from 'dotenv';
import { Connection } from 'typeorm';
import { logger } from './utils/logger';
import { normalizePort, onError } from './utils/server';
config(); // Get environment variables
import server from './server';
import { connectToDatabase } from './utils/database';

async function main(): Promise<void> {
  const connection: Connection | null = await connectToDatabase();
  if (connection === null) {
    throw new Error("Could not connect to database...");
  }
  logger.info(`Database connection established: ${connection.isConnected}`);

  /* --- Start server --- */
  const port = normalizePort(process.env.PORT || '5000');
  const app = server.listen(port);
  app.on('error', onError);
  app.on('listening', () => {
    logger.info(`App listening on port ${port}!`);
  });
}

main().catch((err: Error) => {
  logger.error(err.message);
});
