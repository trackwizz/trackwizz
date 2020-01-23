import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Method } from "axios";

import PlaylistContainer from "./components/PlaylistContainer";
import { axiosRequest } from "../components/axiosRequest";
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
    if (userContext.user) {
      const requestUserPlaylists = {
        method: "GET" as Method,
        url: `/spotify/playlists?userId=${userContext.user.id}`
      };
      const responseUserPlaylists = await axiosRequest(requestUserPlaylists);

      if (responseUserPlaylists.complete && !responseUserPlaylists.error) {
        setYourPlaylists(responseUserPlaylists.data as IPlaylist[]);
      }
    }

    const requestMostPopularPlaylists = {
      method: "GET" as Method,
      url: "/spotify/playlists"
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
