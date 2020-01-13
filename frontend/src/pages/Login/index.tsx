import React, { useEffect, useState } from "react";
import axios from "axios";
import querystring from "query-string";
import { Redirect, RouteComponentProps, withRouter } from "react-router";
import Cookies from "universal-cookie";
import { CookieKey, isTokenValid, isTokenExpired } from "../../utils/auth";
import useInterval from "../../utils/setInterval";

import "./login.css";

const cookies = new Cookies();
const adjectives = [
  "incredible",
  "amazing",
  "extraordinary",
  "beyond belief",
  "inspiring",
  "sensational",
  "wonderful",
  "prodigious",
  "mysterious",
  "wizarding"
];

const Login: React.FC<RouteComponentProps> = ({ location: { search } }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [superAdjectiveIndex, setSuperAdjectiveIndex] = useState<number>(0);

  useInterval(() => {
    setSuperAdjectiveIndex((superAdjectiveIndex + 1) % adjectives.length);
  }, 8000);

  useEffect(() => {
    (async (): Promise<void> => {
      /**
       * The user is already logged in, just pass.
       */
      if (isTokenValid()) {
        setIsLoggedIn(true);
        setHasError(false);
        return;
      }

      /**
       * The user is already logged in but the token is expired: fetch a new token with the refresh token.
       * Save the token in a cookie.
       */
      if (isTokenExpired() && cookies.get(CookieKey.REFRESH_TOKEN)) {
        const url = `http://localhost:5000/refresh_token?refresh_token=${cookies.get(
          CookieKey.REFRESH_TOKEN
        )}`;
        const response = await axios.get(url);

        const {
          access_token: accessToken,
          expires_at: expiresAt,
          hasError
        } = response.data;

        if (hasError) {
          setIsLoggedIn(false);
          setHasError(true);
          return;
        }

        cookies.set(CookieKey.ACCESS_TOKEN, accessToken, { path: "/" });
        cookies.set(CookieKey.EXPIRES_AT, expiresAt, { path: "/" });
        setIsLoggedIn(true);
        setHasError(false);
        return;
      }

      /**
       * The token is in the url query params: the user just logged in and got redirected here.
       * Save the token in a cookie.
       */
      const {
        hasError,
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: expiresAt
      } = querystring.parse(search);

      if (hasError) {
        setIsLoggedIn(false);
        setHasError(true);
        return;
      }

      if (accessToken) {
        // An access token is in the query params, the user successfully logged in.
        cookies.set(CookieKey.ACCESS_TOKEN, accessToken, { path: "/" });
        cookies.set(CookieKey.REFRESH_TOKEN, refreshToken, { path: "/" });
        cookies.set(CookieKey.EXPIRES_AT, expiresAt, { path: "/" });

        setIsLoggedIn(true);
        setHasError(false);
        return;
      }

      /**
       * The user is not logged in.
       */
      setIsLoggedIn(false);
      setHasError(false);
    })();
  }, [search]);

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  const handleLoginButtonClick = async (): Promise<void> => {
    const response = await axios.get("http://localhost:5000/login");
    window.location.href = `https://accounts.spotify.com/authorize?${querystring.stringify(
      response.data
    )}`;
  };

  return (
    <div className="flex-container">
      <div className="login-wrapper">
        <h1>
          Welcome on the{" "}
          <span className="tracking-in-expand">
            {adjectives[superAdjectiveIndex]}
          </span>{" "}
          <span className="brand-name">Blind-test</span>!
        </h1>
        {hasError && (
          <div className="error">
            <p>An hasError happened, please try again...</p>
          </div>
        )}
        <button onClick={handleLoginButtonClick}>Login with Spotify</button>
      </div>
      <p className="soon">
        (Soon available with Youtube Music, Apple Music, Deezer...)
      </p>
    </div>
  );
};

export default withRouter(Login);
