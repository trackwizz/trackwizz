import { Router } from 'express';
import { login, callback, refreshToken } from './login';
import { getSpotifyPlaylists } from './playlists';
import { handleErrors } from '../../middlewares/handle_errors';

const spotifyRouter = Router();
spotifyRouter.use('/login', login);
spotifyRouter.use('/callback', callback);
spotifyRouter.use('/refresh_token', refreshToken);
spotifyRouter.use('/spotify/playlists', handleErrors(getSpotifyPlaylists));

export { spotifyRouter };
