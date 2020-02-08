import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Method } from "axios";

import PlaylistContainer from "./components/PlaylistContainer";
import { axiosRequest } from "../components/axiosRequest";
import { IPlaylist } from "./types";
import { UserContext, ICreateContext } from "../components/UserContext";

const Playlists: React.FC<RouteComponentProps> = () => {
  const userContext: ICreateContext = useContext(UserContext);

  const [yourPlaylists, setYourPlaylists] = useState<IPlaylist[] | null>(null);
  const [mostPopularPlaylists, setMostPopularPlaylists] = useState<
    IPlaylist[] | null
  >(null);

  useEffect(() => {
    const requestPlaylists = async (): Promise<void> => {
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

      return;
    };

    requestPlaylists();
  }, [userContext.user]);

  return (
    <div className="all-playlists">
      {(yourPlaylists || []).length > 0 && (
        <PlaylistContainer
          title="Your playlists"
          playlists={yourPlaylists || []}
        />
      )}
      {(mostPopularPlaylists || []).length > 0 && (
        <PlaylistContainer
          title="Most popular playlists"
          playlists={mostPopularPlaylists || []}
        />
      )}
    </div>
  );
};

export default withRouter(Playlists);
