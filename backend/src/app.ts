import { config } from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { Connection } from 'typeorm';
import { setAppCache } from './middlewares/app_cache';
import { removeTrailingSlash } from './middlewares/trailing_slash';
import { spotifyRouter } from './providers/spotify';
import { routes } from './routes';
import { logger } from './utils/logger';
import { normalizePort, onError } from './utils/server';

config(); // Get environment variables
import { connectToDatabase } from './utils/database';

async function main(): Promise<void> {
  const connection: Connection | null = await connectToDatabase();
  if (connection === null) {
    throw new Error('Could not connect to database...');
  }
  logger.info(`Database connection established: ${connection.isConnected}`);

  const app = express();
  app.enable('strict routing');

  /* --- Middlewares --- */
  app.use(helmet());
  app.use(cors());
  app.use(removeTrailingSlash);
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(setAppCache);

  app.get('/', (_, res: Response) => {
    res.status(200).send('TrackWizz server is running!');
  });

  /* --- Controllers --- */
  app.use(routes);
  app.use(spotifyRouter);

  /* --- 404 Errors --- */
  app.use((_, res: Response) => {
    res.status(404).send('Error 404 - Not found.');
  });

  /* --- Start server --- */
  const port = normalizePort(process.env.PORT || '5000');
  const server = app.listen(port);
  server.on('error', onError);
  server.on('listening', () => {
    logger.info(`App listening on port ${port}!`);
  });
}

main().catch((err: Error) => {
  logger.error(err.message);
});
