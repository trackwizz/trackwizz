/**
 * Implementation of the authorization code flow described in the official Spotify docs:
 * https://developer.spotify.com/documentation/general/guides/authorization-guide/
 *
 * - Our front-end calls /login and gets a unique state, our app client_id and a redirect uri to our backend.
 * - With this information, the front end redirects the user to spotify to authenticate
 * - Once the user is has logged in, Spotify redirects /callback on our backend with a code and the unique state generated before.
 * - Our backend uses this code to call the Spotify API and get an access and a refresh token.
 * - Our backend redirects the response again to our front end, adding the token, the user is now logged in!
 */

const express = require('express');
const request = require('request');
const querystring = require('querystring');
const crypto = require('crypto');
const cors = require('cors');
const NodeCache = require( "node-cache" );
require('dotenv').config();

const cache = new NodeCache();

const redirect_uri = 'http://localhost:8888/callback';
const front_redirect_uri = 'http://localhost:3000/login?';

const app = express();
app.use(cors());


app.get('/login', function(req, res) {
    // Generate and cache secure random state for later verification.
    const state = crypto.randomBytes(16).toString('hex');
    cache.set(state, true, 600);

    const scope = 'user-read-private user-read-email user-read-playback-state';

    res.json({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope,
        redirect_uri,
        state,
    });
    res.end();
});

app.get('/callback', function(req, res) {
    const code = req.query.code || null;
    const state = req.query.state || null;

    // Check that it is indeed Spotify answering us.
    if (state === null || !cache.get(state)) {
        console.log("Invalid state");
        res.redirect(front_redirect_uri +
            querystring.stringify({
                error: true
            }));
        return;
    }
    cache.del(state);

    // Get access and refresh token using the code provided by Spotify.
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code,
            redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            Authorization: `Basic ${new Buffer(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
        },
        json: true
    };
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            const access_token = body.access_token,
                refresh_token = body.refresh_token;

            // pass the token to the front end
            // TODO: we would like to save the tokens in our db here.
            res.redirect(front_redirect_uri +
                querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                }));
        } else {
            res.redirect(front_redirect_uri +
                querystring.stringify({
                    error: true
                }));
        }
    });
});

app.get('/refresh_token', function(req, res) {
    // requesting access token from refresh token
    const refresh_token = req.query.refresh_token;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization: `Basic ${new Buffer(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')}`
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token,
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            res.send({ access_token: body.access_token });
        } else {
            res.send({ error: true });
        }
    });
});

console.log('Listening on 8888');
app.listen(8888);