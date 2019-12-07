import React from "react";
import axios from "axios";
import querystring from 'query-string';
import {Redirect, RouteComponentProps, withRouter} from "react-router";
import Cookies from 'universal-cookie';
import {CookieKey, isLoggedIn} from "../utils/auth";

const cookies = new Cookies();

const Login: React.FC<RouteComponentProps> = ({ location: { search } }) => {
  if (isLoggedIn()) {
    // TODO request new access token with refresh token if the access token is invalid
    return <Redirect to={'/'}/>;
  }

  const { error, access_token: accessToken, refresh_token: refreshToken } = querystring.parse(search);

  if (accessToken) {
    // An access token is in the query params, the user successfully logged in.
    cookies.set(CookieKey.ACCESS_TOKEN, accessToken, { path: '/' });
    cookies.set(CookieKey.REFRESH_TOKEN, refreshToken, { path: '/' });

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
