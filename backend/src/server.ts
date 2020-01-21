import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { setAppCache } from './middlewares/app_cache';
import { removeTrailingSlash } from './middlewares/trailing_slash';
import { spotifyRouter } from './providers/spotify';
import { routes } from './routes';


const server = express();
server.enable('strict routing');

/* --- Middlewares --- */
server.use(helmet());
server.use(cors());
server.use(removeTrailingSlash);
server.use(morgan('dev'));
server.use(bodyParser.json());
server.use(setAppCache);

server.get('/', (_, res: Response) => {
    res.status(200).send('TrackWizz server is running!');
});

/* --- Controllers --- */
server.use(routes);
server.use(spotifyRouter);

/* --- 404 Errors --- */
server.use((_, res: Response) => {
    res.status(404).send('Error 404 - Not found.');
});

export default server;
