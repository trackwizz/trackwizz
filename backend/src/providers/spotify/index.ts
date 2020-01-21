import { Router } from 'express';
import { login, callback, refreshToken } from './login';

const spotifyRouter = Router();
spotifyRouter.use('/login', login);
spotifyRouter.use('/callback', callback);
spotifyRouter.use('/refresh_token', refreshToken);

export { spotifyRouter };
