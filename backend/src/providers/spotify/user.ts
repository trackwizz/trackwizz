import request from "request";
import { logger } from "../../utils/logger";

export interface SpotifyUser {
  display_name: string;
  id: string;
}

/**
 * Returns the spotify user using an access token.
 * @param accessToken: string, user access token
 */
export function getSpotifyUser(accessToken: string): Promise<SpotifyUser> {
  const authOptions = {
    headers: {
      Authorization: `Authorization: Bearer ${accessToken}`,
    },
    json: true,
  };

  return new Promise<SpotifyUser>((resolve, reject) => {
    request.get("https://api.spotify.com/v1/me", authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        logger.error(JSON.stringify(response));
        reject();
      }
    });
  });
}
