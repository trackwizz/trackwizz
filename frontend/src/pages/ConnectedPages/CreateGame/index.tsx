import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Method } from "axios";

import PlaylistContainer from "./components/PlaylistContainer";
import { axiosRequest } from "../components/axiosRequest";
import { IPlaylist, NumberOperation, NumberProperty } from "./types";
import { UserContext, ICreateContext } from "../components/UserContext";
import GameLength from "./components/GameLength";

export const splitNumber = (n: number): number[] => {
  return [Math.floor(n / 10), n % 10]
}

const CreateGame: React.FC<RouteComponentProps> = () => {
  const userContext: ICreateContext = useContext(UserContext);

  const [yourPlaylists, setYourPlaylists] = useState<IPlaylist[] | null>(null);
  const [mostPopularPlaylists, setMostPopularPlaylists] = useState<
    IPlaylist[] | null
  >(null);
  const [numberSongs, setNumberSongs] = useState<number>(0);

  const setNewNumberSongs = (np: NumberProperty) => (no: NumberOperation) => () => {
    let [tens, unit] = splitNumber(numberSongs);
    let modifier: (n: number) => number;
    switch (no) {
      case "add":
        modifier = (n: number) => (n + 1 === 10 ? 0 : n + 1);
        break;
      case "sub":
        modifier = (n: number) => (n - 1 === -1 ? 9 : n - 1);
        break;
      default:
        return;
    }
    switch (np) {
      case "unit":
        unit = modifier(unit);
        break;
      case "tens":
        tens = modifier(tens);
        break;
      default:
        break;
    }
    setNumberSongs(tens * 10 + unit);
  }

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
          numberSongs={numberSongs}
        />
      )}
      {(mostPopularPlaylists || []).length > 0 && (
        <PlaylistContainer
          title="Most popular playlists"
          playlists={mostPopularPlaylists || []}
          numberSongs={numberSongs}
        />
      )}
      <GameLength
        numberSongs={numberSongs}
        setNumberSongs={setNewNumberSongs}
      />
    </div>
  );
};

export default withRouter(CreateGame);
