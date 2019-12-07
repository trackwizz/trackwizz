import React, {useEffect, useState} from "react";
import axios from "axios";
import querystring from 'query-string';
import {Redirect, RouteComponentProps, withRouter} from "react-router";
import Cookies from 'universal-cookie';
import {CookieKey, isTokenValid, isTokenExpired} from "../utils/auth";

const cookies = new Cookies();

const Login: React.FC<RouteComponentProps> = ({ location: { search } }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(false);

  useEffect( () => {
    (async () => {
      /**
       * The user is already logged in, just pass.
       */
      if (isTokenValid()) {
        setIsLoggedIn(true);
        setError(false);
        return;
      }

      /**
       * The user is already logged in but the token is expired: fetch a new token with the refresh token.
       * Save the token in a cookie.
       */
      if (isTokenExpired()) {
        const url = `http://localhost:8888/refresh_token?refresh_token=${cookies.get(CookieKey.REFRESH_TOKEN)}`;
        const response = await axios.get(url);

        const { access_token: accessToken, expires_at: expiresAt, error } = response.data;

        if (error) {
          setIsLoggedIn(false);
          setError(true);
          return;
        }

        cookies.set(CookieKey.ACCESS_TOKEN, accessToken, { path: '/' });
        cookies.set(CookieKey.EXPIRES_AT, expiresAt, { path: '/' });
        setIsLoggedIn(true);
        setError(false);
        return;
      }

      /**
       * The token is in the url query params: the user just logged in and got redirected here.
       * Save the token in a cookie.
       */
      const {
        error,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
      } = querystring.parse(search);

      if (error) {
        setIsLoggedIn(false);
        setError(true);
        return;
      }

      if (accessToken) {
        // An access token is in the query params, the user successfully logged in.
        cookies.set(CookieKey.ACCESS_TOKEN, accessToken, { path: '/' });
        cookies.set(CookieKey.REFRESH_TOKEN, refreshToken, { path: '/' });
        cookies.set(CookieKey.EXPIRES_AT, expiresAt, { path: '/' });

        setIsLoggedIn(true);
        setError(false);
        return;
      }

      /**
       * The user is not logged in.
       */
      setIsLoggedIn(false);
      setError(false);
    })();
  });

  if (isLoggedIn) {
    return <Redirect to={'/'}/>;
  }

  const handleLoginButtonClick = async () => {
    const response = await axios.get("http://localhost:8888/login");
    window.location.href = `https://accounts.spotify.com/authorize?${querystring.stringify(response.data)}`;
  };

  return (
    <div>
      { error && <p>An error happened, please try again</p> }
      <button onClick={handleLoginButtonClick}>Login with Spotify</button>
    </div>
  );
};

export default withRouter(Login);
