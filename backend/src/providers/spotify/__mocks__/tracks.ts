/**
 * Mocks spotify functions to run the tests without spotify account.
 */
import { Request, Response } from "express";
import { Track } from "../../track";

export function requestSpotifyTracks(): Promise<Array<Track>> {
  return new Promise<Array<Track>>((resolve) => {
    resolve([
      {
        previewUrl: "https://p.scdn.co/mp3-preview/1234?cid=1234",
        id: "1234",
        name: "We will rock you",
        trackNumber: 0,
        artist: "Queen",
      },
    ]);
  });
}

export async function getSpotifyTracks(_: Request, res: Response): Promise<void> {
  res.sendJSON(await requestSpotifyTracks());
}
