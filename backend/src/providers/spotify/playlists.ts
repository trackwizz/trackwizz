import { Request, Response } from "express";
import request from "request";
import { Playlist } from "../playlist";

interface SpotifyPlaylistsResponse {
  href: string;
  items: Array<{
    description: string;
    id: string;
    images: Array<{
      url: string;
    }>;
    name: string;
  }>;
}
interface SpotifyPlaylistsBody {
  message: string;
  playlists: SpotifyPlaylistsResponse;
}

/**
 * Returns spotify playlists using user token access.
 * If a userID is given, will fetch user playlists. Spotify featured playlists Otherwise.
 *
 * @param token : string, user access token that should be: 'Bearer xxxxxxxx'.
 * @param userId : string | undefined, user id.
 */
export function requestSpotifyPlaylists(token: string, userId: string | undefined): Promise<Array<Playlist>> {
  const getOptions = {
    url: userId !== undefined ? `https://api.spotify.com/v1/users/${userId}/playlists` : "https://api.spotify.com/v1/browse/featured-playlists?country=FR",
    headers: {
      Authorization: token,
    },
    json: true,
  };

  return new Promise<Array<Playlist>>((resolve, reject) => {
    request.get(getOptions, (error, response, body: SpotifyPlaylistsBody | SpotifyPlaylistsResponse) => {
      if (!error && response.statusCode === 200) {
        const playlists: Array<Playlist> = [];
        let spotifyPlaylists: SpotifyPlaylistsResponse;
        if (userId === undefined) {
          spotifyPlaylists = (body as SpotifyPlaylistsBody).playlists;
        } else {
          spotifyPlaylists = body as SpotifyPlaylistsResponse;
        }
        for (const playlist of spotifyPlaylists.items) {
          playlists.push({
            description: playlist.description,
            id: playlist.id,
            name: playlist.name,
            image: playlist.images.length > 0 ? playlist.images[0].url : null,
          });
        }
        resolve(playlists);
      } else {
        reject();
      }
    });
  });
}

/**
 * Spotify playlists handler to get playlist at /spotify/playlists
 *
 * @param req
 * @param res
 */
export async function getSpotifyPlaylists(req: Request, res: Response): Promise<void> {
  const token: string | undefined = req.header("Authorization");
  const userId: string | undefined = req.query.userId;
  if (token === undefined) {
    throw "Bearer authorization missing !";
  }

  let playlists: Array<Playlist>;

  try {
    playlists = await requestSpotifyPlaylists(token, userId);
  } catch (e) {
    throw "Error...";
  }

  res.sendJSON(playlists);
}
