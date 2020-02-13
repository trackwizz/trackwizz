/**
 * Exports the spotify router with all routes to use spotify as provider.
 * This spotify folder is an example for one provider, and others providers
 * could be added alongside spotify using the same schema
 */
import { Router } from "express";
import { login, callback, refreshToken } from "./login";
import { getSpotifyPlaylists } from "./playlists";
import { handleErrors } from "../../middlewares/handle_errors";
import { getSpotifyTracks } from "./tracks";

const spotifyRouter = Router();
spotifyRouter.get("/login", login);
spotifyRouter.get("/callback", callback);
spotifyRouter.get("/refresh_token", refreshToken);
spotifyRouter.get("/spotify/playlists", handleErrors(getSpotifyPlaylists));
spotifyRouter.get("/spotify/tracks", handleErrors(getSpotifyTracks));

export { spotifyRouter };
