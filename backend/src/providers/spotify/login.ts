/* eslint @typescript-eslint/camelcase: 0 */
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import * as querystring from 'querystring';
import request from 'request';
import { logger } from '../../utils/logger';

const redirect_uri = process.env.BACKEND_REDIRECT_URI || 'http://localhost:5000/callback';
const front_redirect_uri = process.env.FRONTEND_REDIRECT_URI || 'http://localhost:3000/login?';

function getExpiresAt(expiresIn: number): number {
  return new Date().getTime() + expiresIn * 1000 - 120 * 1000;
}

export function login(req: Request, res: Response): void {
  // Generate and cache secure random state for later verification.
  const state = crypto.randomBytes(16).toString('hex');
  req.appCache.set<boolean>(state, true, 600);

  const scope = 'user-read-private user-read-email user-read-playback-state';

  res.json({
    response_type: 'code',
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
    res.redirect(front_redirect_uri +
      querystring.stringify({
        error: true
      }));
    return;
  }
  req.appCache.del(state);

  // Get access and refresh token using the code provided by Spotify.
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn } = body;
      const expiresAt = getExpiresAt(expiresIn);

      // pass the token to the front end
      // TODO: we would like to save the tokens in our db here.
      res.redirect(front_redirect_uri +
        querystring.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_at: expiresAt,
        }));
    } else {
      logger.error(JSON.stringify(response));
      res.redirect(front_redirect_uri +
        querystring.stringify({
          error: true
        }));
    }
  });
}

export function refreshToken(req: Request, res: Response): void {
  // requesting access token from refresh token
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token,
    },
    json: true
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
