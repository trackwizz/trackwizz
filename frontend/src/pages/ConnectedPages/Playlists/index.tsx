import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Method } from "axios";

import PlaylistContainer from "./components/PlaylistContainer";
import { axiosRequest, createHeader } from "../components/axiosRequest";
import { getToken } from "../../../utils/auth";
import { IPlaylist } from "./types";
import { UserContext } from "../components/UserContext";

const Playlists: React.FC<RouteComponentProps> = () => {
  const userContext = useContext(UserContext);

  const [yourPlaylists, setYourPlaylists] = useState<IPlaylist[] | null>(null);
  const [mostPopularPlaylists, setMostPopularPlaylists] = useState<
    IPlaylist[] | null
  >(null);

  useEffect(() => {
    requestPlaylists();
  }, []);

  const requestPlaylists = async () => {
    const headers = createHeader(getToken());

    if (userContext.user) {
      const requestUserPlaylists = {
        headers,
        method: "GET" as Method,
        url: `http://localhost:5000/spotify/playlists?userId=${userContext.user.id}`
      };
      const responseUserPlaylists = await axiosRequest(requestUserPlaylists);

      if (responseUserPlaylists.complete && !responseUserPlaylists.error) {
        setYourPlaylists(responseUserPlaylists.data as IPlaylist[]);
      }
    }

    const requestMostPopularPlaylists = {
      headers,
      method: "GET" as Method,
      url: "http://localhost:5000/spotify/playlists"
    };
    const responsetMostPopularPlaylists = await axiosRequest(
      requestMostPopularPlaylists
    );

    if (
      responsetMostPopularPlaylists.complete &&
      !responsetMostPopularPlaylists.error
    ) {
      setMostPopularPlaylists(
        responsetMostPopularPlaylists.data as IPlaylist[]
      );
    }
  };

  return (
    <div className="all-playlists">
      <PlaylistContainer
        title="Your playlists"
        playlists={yourPlaylists || []}
      />
      <div style={{ marginBottom: "5rem" }}>
        <PlaylistContainer
          title="Most popular playlists"
          playlists={mostPopularPlaylists || []}
        />
      </div>
    </div>
  );
};

export default withRouter(Playlists);
