import { Request, Response } from "express";
import request from "request";
import * as querystring from "querystring";
import { Track } from "../track";
import { transformTypingRequest } from "../../utils/transformTyping";

interface SpotifyTracks {
  items: Array<{
    track: {
      preview_url: string;
      id: string;
      name: string;
      track_number: number;
      artists: Array<{
        name: string;
      }>;
    };
  }>;
}

/**
 * Returns spotify tracks using user token access.
 *
 * @param token : string, user access token that should be: 'bearer xxxxxxxx'.
 * @param spotifyPlaylistId
 */
export function requestSpotifyTracks(token: string, spotifyPlaylistId: string): Promise<Array<Track>> {
  const getOptions = {
    url: `https://api.spotify.com/v1/playlists/${spotifyPlaylistId}/tracks?${querystring.stringify({
      fields: "items(track(name, id, artists, preview_url, track_number))",
      market: "fr",
    })}`,
    headers: {
      Authorization: token,
    },
    json: true,
  };

  return new Promise<Array<Track>>((resolve, reject) => {
    request.get(getOptions, (error, response, body: SpotifyTracks) => {
      if (!error && response.statusCode === 200) {
        const tracks: Array<Track> = [];
        for (const track of body.items) {
          tracks.push({
            previewUrl: track.track.preview_url,
            id: track.track.id,
            name: track.track.name,
            trackNumber: track.track.track_number,
            artist: track.track.artists.map(a => a.name).join(" & "),
          });
        }
        resolve(tracks);
      } else {
        reject();
      }
    });
  });
}

/**
 * Spotify tracks handler to get tracks at /spotify/tracks
 *
 * @param req
 * @param res
 */
export async function getSpotifyTracks(req: Request, res: Response): Promise<void> {
  const token: string | undefined = req.header("Authorization");
  const spotifyPlaylistId: string | undefined = transformTypingRequest(req.query.spotifyPlaylistId);
  if (token === undefined) {
    throw "Bearer authorization missing !";
  }
  if (spotifyPlaylistId === undefined) {
    throw "No playlist id was given !";
  }

  let tracks: Array<Track>;

  try {
    tracks = await requestSpotifyTracks(token, spotifyPlaylistId);
  } catch (e) {
    throw "Error...";
  }

  res.sendJSON(tracks);
}
