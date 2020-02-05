/* eslint @typescript-eslint/camelcase: 0 */
import * as crypto from "crypto";
import { Request, Response } from "express";
import * as querystring from "querystring";
import request from "request";
import { logger } from "../../utils/logger";
import { getSpotifyUser } from "./user";
import { User } from "../../entities/user";
import { getRepository } from "typeorm";

let redirect_uri: string = "http://localhost:5000/callback";
// prod
if (process.env.BACKEND_NAME_FULL) {
  redirect_uri = process.env.BACKEND_NAME_FULL + "/callback";
}
let front_redirect_uri: string = "http://localhost:3000/login?";
// prod
if (process.env.FRONTEND_NAME_FULL) {
  front_redirect_uri = process.env.FRONTEND_NAME_FULL + "/login?";
}

function getExpiresAt(expiresIn: number): number {
  return new Date().getTime() + expiresIn * 1000 - 120 * 1000;
}

async function createUser(accessToken: string): Promise<void> {
  const spotifyUser = await getSpotifyUser(accessToken);
  const user: User = new User();
  user.id = spotifyUser.id;
  user.name = spotifyUser.display_name;
  await getRepository(User).save(user);
}

export function login(req: Request, res: Response): void {
  // Generate and cache secure random state for later verification.
  const state = crypto.randomBytes(16).toString("hex");
  req.appCache.set<boolean>(state, true, 600);

  const scope = "user-read-private user-read-email user-read-playback-state";

  res.json({
    response_type: "code",
    client_id: process.env.CLIENT_ID,
    scope,
    redirect_uri,
    state,
  });
  res.end();
}

export function callback(req: Request, res: Response): void {
  const code = req.query.code || null;
  const state = req.query.state || null;

  // Check that it is indeed Spotify answering us.
  if (state === null || !req.appCache.get(state)) {
    res.redirect(
      front_redirect_uri +
        querystring.stringify({
          error: true,
        }),
    );
    return;
  }
  req.appCache.del(state);

  // Get access and refresh token using the code provided by Spotify.
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code,
      redirect_uri,
      grant_type: "authorization_code",
    },
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64")}`,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = body;
      const expiresAt = getExpiresAt(expiresIn);

      // create the user in the database
      createUser(accessToken);

      // pass the token to the front end
      res.redirect(
        front_redirect_uri +
          querystring.stringify({
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: expiresAt,
          }),
      );
    } else {
      logger.error(JSON.stringify(response));
      res.redirect(
        front_redirect_uri +
          querystring.stringify({
            error: true,
          }),
      );
    }
  });
}

export function refreshToken(req: Request, res: Response): void {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64")}`,
    },
    form: {
      grant_type: "refresh_token",
      refresh_token,
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.send({
        access_token: body.access_token,
        expires_at: getExpiresAt(body.expires_in),
      });
    } else {
      res.send({ error: true });
    }
  });
}
