import { Request, Response } from 'express';
import request from 'request';

interface SpotifyPlaylists {
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
  playlists: SpotifyPlaylists;
}

interface NewPlaylists {
  description: string;
  id: string;
  name: string;
  image: string | null;
}

function requestPlaylists(token: string, userId: string | undefined): Promise<Array<NewPlaylists>> {
  const getOptions = {
    url: userId !== undefined ? `https://api.spotify.com/v1/users/${userId}/playlists` : 'https://api.spotify.com/v1/browse/featured-playlists?country=FR',
    headers: {
      Authorization: token,
    },
    json: true
  };

  return new Promise<Array<NewPlaylists>>((resolve, reject) => {
    request.get(getOptions, (error, response, body: SpotifyPlaylistsBody | SpotifyPlaylists) => {
      if (!error && response.statusCode === 200) {
        const playlists: Array<NewPlaylists> = [];
        let spotifyPlaylists: SpotifyPlaylists;
        if (userId === undefined) {
          spotifyPlaylists = (body as SpotifyPlaylistsBody).playlists;
        } else {
          spotifyPlaylists = body as SpotifyPlaylists;
        }
        for(const playlist of spotifyPlaylists.items) {
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

export async function getSpotifyPlaylists(req: Request, res: Response): Promise<void> {
  const token: string | undefined = req.header('Authorization');
  const userId: string | undefined = req.query.userId;
  if (token === undefined) {
    throw ('Bearer authorization missing !')
  }

  let playlists: Array<NewPlaylists>;

  try{
    playlists = await requestPlaylists(token, userId);
  } catch (e) {
    throw ('Error...')
  }

  res.sendJSON(playlists);
}
