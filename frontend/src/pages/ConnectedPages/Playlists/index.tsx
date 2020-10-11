import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Method } from "axios";

import PlaylistContainer from "./components/PlaylistContainer";
import { axiosRequest } from "../components/axiosRequest";
import { IPlaylist } from "./types";
import { UserContext, ICreateContext } from "../components/UserContext";
import GameLength from "./components/GameLength";

const Playlists: React.FC<RouteComponentProps> = () => {
  const userContext: ICreateContext = useContext(UserContext);

  const [yourPlaylists, setYourPlaylists] = useState<IPlaylist[] | null>(null);
  const [mostPopularPlaylists, setMostPopularPlaylists] = useState<
    IPlaylist[] | null
  >(null);
  const [numberSongsTen, setNumberSongsTen] = useState<number>(0);
  const [numberSongsUnit, setNumberSongsUnit] = useState<number>(0);

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
          numberSongsTen={numberSongsTen}
          numberSongsUnit={numberSongsUnit}
        />
      )}
      {(mostPopularPlaylists || []).length > 0 && (
        <PlaylistContainer
          title="Most popular playlists"
          playlists={mostPopularPlaylists || []}
          numberSongsTen={numberSongsTen}
          numberSongsUnit={numberSongsUnit}
        />
      )}
      <GameLength
        numberSongsTen={numberSongsTen}
        setNumberSongsTen={setNumberSongsTen}
        numberSongsUnit={numberSongsUnit}
        setNumberSongsUnit={setNumberSongsUnit}
        />
    </div>
  );
};

export default withRouter(Playlists);
